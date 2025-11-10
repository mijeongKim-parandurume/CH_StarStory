/**
 * Interactive Korea Map - Main Application
 * Vanilla JS (ES6+) - Production Ready
 */

// ============================================================================
// Configuration & Constants
// ============================================================================

const CONFIG = {
    svgPath: 'assets/KoreaMap.svg',
    debounceDelay: 150,
    tooltipOffset: 15,
};

// Region ID to Human-readable label mapping (matches actual SVG IDs)
const REGION_LABELS = {
    // South Korea regions
    seoul: '서울특별시',
    incheon: '인천광역시',
    gyeonggi: '경기도',
    gangwon_south: '강원도',
    chungcheong_north: '충청북도',
    chungcheong_south: '충청남도',
    jeolla_north: '전라북도',
    jeolla_south: '전라남도',
    gyeongsang_north: '경상북도',
    gyeongsang_south: '경상남도',
    busan: '부산광역시',
    daegu: '대구광역시',
    gwangju: '광주광역시',
    daejeon: '대전광역시',
    ulsan: '울산광역시',
    jeju: '제주도',

    // Islands
    ulleungdo: '울릉도',
    dokdo: '독도',

    // North Korea regions
    nason: '나선특별시',
    hamgyeong_north: '함경북도',
    ryanggang: '양강도',
    jagang: '자강도',
    pyeongan_north: '평안북도',
    pyeongan_south: '평안남도',
    hamgyeong_south: '함경남도',
    pyongyang: '평양직할시',
    nampo: '남포특별시',
    gangwon_north: '강원도 (북한 지역)',
    hwanghae_north: '황해북도',
    hwanghae_south: '황해남도',
    kaesong: '개성특별시',
};

// Constellation mapping (example data - can be loaded externally)
const CONSTELLATION_DATA = {
    // South Korea
    seoul: '왕도의 하늘',
    gyeonggi: '중심의 별',
    gangwon_south: '산과 별의 이야기',
    jeju: '화산과 별',
    busan: '바다와 별빛',
    incheon: '항구의 별',
    daegu: '분지의 별',
    gwangju: '예향의 하늘',
    daejeon: '과학의 별',
    ulsan: '산업의 빛',
    gyeongsang_south: '남해의 별빛',
    gyeongsang_north: '영남의 하늘',
    jeolla_south: '호남의 별',
    jeolla_north: '전주의 소리와 별',
    chungcheong_south: '백제의 별',
    chungcheong_north: '내륙의 별',
    ulleungdo: '동해의 외로운 별',
    dokdo: '독도의 수호별',

    // North Korea
    nason: '동해의 새벽별',
    hamgyeong_north: '북방의 하늘',
    ryanggang: '백두의 별',
    jagang: '산악의 별빛',
    pyeongan_north: '서해의 별',
    pyeongan_south: '대동강의 하늘',
    hamgyeong_south: '함흥의 별',
    pyongyang: '평양의 하늘',
    nampo: '항구의 밤하늘',
    gangwon_north: '금강산의 별',
    hwanghae_north: '서해안의 별빛',
    hwanghae_south: '남해안의 하늘',
    kaesong: '개성의 별',
};

// ============================================================================
// State Management
// ============================================================================

const AppState = {
    svg: null,
    regions: [],
    selectedRegion: null,
    originalFills: new Map(),
    originalTransforms: new Map(), // CRITICAL: Store original SVG transforms
    groupChildFills: new Map(), // Store original fills for child paths in groups
};

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Debounce function to limit rapid event firing
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Get human-readable label for region ID
 */
function getRegionLabel(id) {
    return REGION_LABELS[id] || id.charAt(0).toUpperCase() + id.slice(1);
}

/**
 * Get constellation data for region
 */
function getConstellation(id) {
    return CONSTELLATION_DATA[id] || '정보 없음';
}

/**
 * Normalize region ID (handle different naming conventions)
 */
function normalizeRegionId(element) {
    // First check data-region-id (set by our grouping logic)
    let id = element.getAttribute('data-region-id');
    if (!id) {
        // Fallback to element id or data-region
        id = element.id || element.getAttribute('data-region');
    }
    return id ? id.toLowerCase().trim() : null;
}

// ============================================================================
// SVG Loading & Processing
// ============================================================================

/**
 * Load external SVG file and inject into DOM
 */
async function loadSVG() {
    const container = document.getElementById('mapContainer');
    const loadingEl = container.querySelector('.loading');

    try {
        const response = await fetch(CONFIG.svgPath);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const svgText = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(svgText, 'image/svg+xml');

        // Check for parsing errors
        const parserError = doc.querySelector('parsererror');
        if (parserError) {
            throw new Error('SVG parsing failed');
        }

        const svg = doc.querySelector('svg');
        if (!svg) throw new Error('No SVG element found');

        // Store original viewBox or set default
        if (!svg.hasAttribute('viewBox')) {
            const width = svg.getAttribute('width') || '800';
            const height = svg.getAttribute('height') || '1000';
            svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
        }

        // Remove fixed width/height to make responsive
        svg.removeAttribute('width');
        svg.removeAttribute('height');

        // Clear loading and inject SVG
        if (loadingEl) loadingEl.remove();
        container.appendChild(svg);

        AppState.svg = svg;

        // Process regions
        processRegions();

        return svg;
    } catch (error) {
        console.error('Failed to load SVG:', error);
        if (loadingEl) {
            loadingEl.textContent = `지도를 불러올 수 없습니다: ${error.message}`;
            loadingEl.style.color = '#ff6b6b';
        }
        throw error;
    }
}

/**
 * Process SVG elements to identify and prepare regions
 */
function processRegions() {
    if (!AppState.svg) return;

    // Find all potential region elements (paths and groups with IDs)
    const candidates = AppState.svg.querySelectorAll('path[id], g[id]');

    // Group elements by base ID (handle cases like "chungcheong_south" and "chungcheong_south-2")
    const regionGroups = new Map();

    candidates.forEach((element) => {
        // Get the element's ID
        let id = element.id || element.getAttribute('id');
        if (!id) return;

        id = id.toLowerCase().trim();

        // Skip elements that are likely not regions (e.g., 'defs', 'background')
        if (id === 'background' || id === 'defs' || id.startsWith('_')) return;

        // CRITICAL: Skip child elements of groups (avoid duplicate IDs like "dokdo-2", "jeolla_south-2")
        // Only process the parent group or standalone paths
        const parentGroup = element.parentElement.closest('g[id]');
        if (parentGroup && element.tagName.toLowerCase() === 'path') {
            // This is a child path inside a group - skip it
            return;
        }

        // Check for data-name attribute (used for numbered variants like "chungcheong_south-2")
        const dataName = element.getAttribute('data-name');
        if (dataName) {
            id = dataName.toLowerCase().trim();
        }

        // Remove suffix numbers from ID (dokdo-2 -> dokdo)
        const baseId = id.replace(/-\d+$/, '');

        // Group elements with same base ID
        if (!regionGroups.has(baseId)) {
            regionGroups.set(baseId, []);
        }
        regionGroups.get(baseId).push(element);
    });

    // Now process each region group
    regionGroups.forEach((elements, baseId) => {
        // For each region, we'll use the first element as the primary element
        // but track all elements for interaction
        const primaryElement = elements[0];

        // Add region class to all elements
        elements.forEach(el => {
            el.classList.add('region');
            el.setAttribute('data-region-id', baseId);
        });

        // Make primary element focusable
        primaryElement.setAttribute('tabindex', '0');

        // CRITICAL: Store original fill color
        const originalFill = getComputedStyle(primaryElement).fill;
        AppState.originalFills.set(baseId, originalFill);

        // CRITICAL: Store all child paths' original fills (for both <g> and multiple <path> elements)
        const childFills = [];
        elements.forEach(element => {
            if (element.tagName.toLowerCase() === 'g') {
                const childPaths = element.querySelectorAll('path');
                childPaths.forEach(path => {
                    const fill = getComputedStyle(path).fill;
                    childFills.push({ element: path, fill: fill });
                });
            } else if (element.tagName.toLowerCase() === 'path') {
                const fill = getComputedStyle(element).fill;
                childFills.push({ element: element, fill: fill });
            }
        });
        if (childFills.length > 0) {
            AppState.groupChildFills.set(baseId, childFills);
        }

        // CRITICAL: Store original transform attribute for all elements
        elements.forEach(element => {
            const originalTransform = element.getAttribute('transform') || '';
            const elementKey = `${baseId}_${elements.indexOf(element)}`;
            AppState.originalTransforms.set(elementKey, originalTransform);
        });
        // Store primary transform with base ID
        AppState.originalTransforms.set(baseId, primaryElement.getAttribute('transform') || '');

        // Add accessibility attributes to primary element
        primaryElement.setAttribute('role', 'button');
        primaryElement.setAttribute('aria-label', getRegionLabel(baseId));

        // Add constellation data attribute if available
        if (CONSTELLATION_DATA[baseId]) {
            primaryElement.setAttribute('data-star', CONSTELLATION_DATA[baseId]);
        }

        // Store references to ALL elements for this region
        AppState.regions.push({ id: baseId, element: primaryElement, allElements: elements });
    });

    console.log(`Processed ${AppState.regions.length} regions`);

    // Attach event listeners
    attachEventListeners();

    // Handle deep link (URL hash)
    handleDeepLink();
}

// ============================================================================
// Event Handling
// ============================================================================

/**
 * Attach all event listeners
 */
function attachEventListeners() {
    const svg = AppState.svg;
    if (!svg) return;

    // Event delegation on SVG root
    svg.addEventListener('click', handleRegionClick);
    svg.addEventListener('touchstart', handleRegionTouch, { passive: false });

    // Keyboard navigation
    svg.addEventListener('keydown', handleKeyDown);

    // Hover effects with tooltip
    svg.addEventListener('mousemove', debounce(handleMouseMove, 50));
    svg.addEventListener('mouseleave', handleMouseLeave);

    // Focus events for tooltip
    svg.addEventListener('focusin', handleFocusIn);
    svg.addEventListener('focusout', handleFocusOut);

    // Reset button
    const resetBtn = document.getElementById('resetBtn');
    if (resetBtn) {
        resetBtn.addEventListener('click', resetSelection);
    }

    // Global escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            resetSelection();
        }
    });

    // Click outside SVG to reset
    document.addEventListener('click', (e) => {
        if (!svg.contains(e.target) && !e.target.closest('#resetBtn')) {
            resetSelection();
        }
    });
}

/**
 * Handle region click
 */
function handleRegionClick(event) {
    const target = event.target.closest('.region');
    if (!target) return;

    event.preventDefault();
    const id = normalizeRegionId(target);

    // Toggle if clicking same region
    if (AppState.selectedRegion === id) {
        resetSelection();
    } else {
        selectRegion(id);
    }
}

/**
 * Handle touch events (mobile)
 */
function handleRegionTouch(event) {
    const target = event.target.closest('.region');
    if (!target) return;

    // Prevent accidental text selection
    event.preventDefault();

    const id = normalizeRegionId(target);
    if (AppState.selectedRegion === id) {
        resetSelection();
    } else {
        selectRegion(id);
    }
}

/**
 * Handle keyboard navigation
 */
function handleKeyDown(event) {
    const target = event.target;
    if (!target.classList.contains('region')) return;

    if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        const id = normalizeRegionId(target);
        if (AppState.selectedRegion === id) {
            resetSelection();
        } else {
            selectRegion(id);
        }
    }
}

/**
 * Handle mouse move for tooltip
 */
function handleMouseMove(event) {
    const target = event.target.closest('.region');
    const tooltip = document.getElementById('tooltip');

    if (!tooltip) return;

    if (target && !target.classList.contains('active')) {
        const id = normalizeRegionId(target);
        const label = getRegionLabel(id);

        tooltip.textContent = label;
        tooltip.style.left = `${event.pageX + CONFIG.tooltipOffset}px`;
        tooltip.style.top = `${event.pageY + CONFIG.tooltipOffset}px`;
        tooltip.classList.add('visible');
        tooltip.setAttribute('aria-hidden', 'false');
    } else {
        hideTooltip();
    }
}

/**
 * Handle mouse leave
 */
function handleMouseLeave() {
    hideTooltip();
}

/**
 * Handle focus in (keyboard navigation)
 */
function handleFocusIn(event) {
    const target = event.target;
    if (!target.classList.contains('region')) return;

    const tooltip = document.getElementById('tooltip');
    if (!tooltip) return;

    const id = normalizeRegionId(target);
    const label = getRegionLabel(id);

    // Position tooltip near the element
    const rect = target.getBoundingClientRect();
    tooltip.textContent = label;
    tooltip.style.left = `${rect.left + rect.width / 2}px`;
    tooltip.style.top = `${rect.top - 30}px`;
    tooltip.classList.add('visible');
    tooltip.setAttribute('aria-hidden', 'false');
}

/**
 * Handle focus out
 */
function handleFocusOut() {
    hideTooltip();
}

/**
 * Hide tooltip
 */
function hideTooltip() {
    const tooltip = document.getElementById('tooltip');
    if (tooltip) {
        tooltip.classList.remove('visible');
        tooltip.setAttribute('aria-hidden', 'true');
    }
}

// ============================================================================
// Selection Logic
// ============================================================================

/**
 * Select a region
 * CRITICAL: Uses SVG transform attribute (not CSS transform) to avoid conflicts
 */
function selectRegion(id) {
    const regionData = AppState.regions.find((r) => r.id === id);
    if (!regionData) return;

    // Update state
    AppState.selectedRegion = id;

    // Visual updates
    AppState.regions.forEach(({ id: regionId, element, allElements }) => {
        if (regionId === id) {
            // Active region - apply scale transform to all elements
            (allElements || [element]).forEach(el => {
                applyScaleTransform(el, regionId, allElements.indexOf(el), 1.05);
                el.classList.add('active');
                el.classList.remove('fade');
            });
            element.setAttribute('aria-pressed', 'true');
            // Restore original fill
            restoreOriginalFill(allElements || [element], regionId);
        } else {
            // Fade others - restore original transform
            (allElements || [element]).forEach(el => {
                restoreOriginalTransform(el, regionId, allElements.indexOf(el));
                el.classList.add('fade');
                el.classList.remove('active');
            });
            element.setAttribute('aria-pressed', 'false');
            // Apply gray fill
            applyGrayFill(allElements || [element]);
        }
    });

    // Update info panel
    updateInfoPanel(id);

    // Update URL hash
    updateHash(id);

    // Hide tooltip
    hideTooltip();

    // Announce to screen readers
    announceSelection(id);
}

/**
 * Apply scale transform around element's center
 * PRESERVES original transform from Illustrator
 */
function applyScaleTransform(element, regionId, elementIndex, scale) {
    // Get original transform (use indexed key for multi-element regions)
    const transformKey = elementIndex >= 0 ? `${regionId}_${elementIndex}` : regionId;
    const originalTransform = AppState.originalTransforms.get(transformKey) || AppState.originalTransforms.get(regionId) || '';

    // Calculate bounding box center (works for both <path> and <g>)
    const bbox = element.getBBox();
    const cx = bbox.x + bbox.width / 2;
    const cy = bbox.y + bbox.height / 2;

    // Build transform: translate to center, scale, translate back
    const scaleTransform = ` translate(${cx},${cy}) scale(${scale}) translate(${-cx},${-cy})`;

    // APPEND to original transform (do NOT replace)
    element.setAttribute('transform', originalTransform + scaleTransform);
}

/**
 * Restore original transform from Illustrator
 */
function restoreOriginalTransform(element, regionId, elementIndex) {
    // Get original transform (use indexed key for multi-element regions)
    const transformKey = elementIndex >= 0 ? `${regionId}_${elementIndex}` : regionId;
    const originalTransform = AppState.originalTransforms.get(transformKey) || AppState.originalTransforms.get(regionId) || '';
    element.setAttribute('transform', originalTransform);
}

/**
 * Apply gray fill to elements (handles both <path>, <g>, and arrays)
 */
function applyGrayFill(elements) {
    const grayColor = '#bfbfbf';
    const elementArray = Array.isArray(elements) ? elements : [elements];

    elementArray.forEach(element => {
        if (element.tagName.toLowerCase() === 'g') {
            // For groups, apply gray to all child paths
            const childPaths = element.querySelectorAll('path');
            childPaths.forEach(path => {
                path.style.fill = grayColor;
            });
        } else {
            // For single paths, apply directly
            element.style.fill = grayColor;
        }
    });
}

/**
 * Restore original fill color (handles both <path>, <g>, and arrays)
 */
function restoreOriginalFill(elements, regionId) {
    const childFills = AppState.groupChildFills.get(regionId);

    if (childFills) {
        // Restore from saved child fills
        childFills.forEach(({ element: path }) => {
            path.style.fill = '';  // Clear inline style to let SVG attribute show
        });
    } else {
        // Fallback: clear inline styles
        const elementArray = Array.isArray(elements) ? elements : [elements];
        elementArray.forEach(element => {
            if (element.tagName.toLowerCase() === 'g') {
                const childPaths = element.querySelectorAll('path');
                childPaths.forEach(path => {
                    path.style.fill = '';
                });
            } else {
                element.style.fill = '';
            }
        });
    }
}

/**
 * Reset selection (clear all)
 */
function resetSelection() {
    AppState.selectedRegion = null;

    // Remove all visual states and restore transforms
    AppState.regions.forEach(({ id: regionId, element, allElements }) => {
        (allElements || [element]).forEach((el, index) => {
            restoreOriginalTransform(el, regionId, index);
            el.classList.remove('active', 'fade');
        });
        restoreOriginalFill(allElements || [element], regionId);
        element.setAttribute('aria-pressed', 'false');
    });

    // Reset info panel
    resetInfoPanel();

    // Clear URL hash
    updateHash('');

    // Announce reset
    announceReset();
}

// ============================================================================
// UI Updates
// ============================================================================

/**
 * Update info panel with selected region data
 */
function updateInfoPanel(id) {
    const infoPanel = document.getElementById('infoPanel');
    if (!infoPanel) return;

    const title = infoPanel.querySelector('.info-title');
    const description = infoPanel.querySelector('.info-description');
    const details = infoPanel.querySelector('.info-details');
    const regionLabel = document.getElementById('regionLabel');
    const constellationLabel = document.getElementById('constellationLabel');

    if (title) title.textContent = getRegionLabel(id);
    if (description) description.textContent = '선택된 지역의 정보입니다';
    if (details) details.style.display = 'block';
    if (regionLabel) regionLabel.textContent = getRegionLabel(id);
    if (constellationLabel) constellationLabel.textContent = getConstellation(id);

    // Animate panel
    infoPanel.style.animation = 'none';
    setTimeout(() => {
        infoPanel.style.animation = '';
    }, 10);
}

/**
 * Reset info panel to default state
 */
function resetInfoPanel() {
    const infoPanel = document.getElementById('infoPanel');
    if (!infoPanel) return;

    const title = infoPanel.querySelector('.info-title');
    const description = infoPanel.querySelector('.info-description');
    const details = infoPanel.querySelector('.info-details');

    if (title) title.textContent = '지역을 선택하세요';
    if (description) description.textContent = '지도에서 원하는 지역을 클릭하거나 탭하세요';
    if (details) details.style.display = 'none';
}

// ============================================================================
// URL Hash Management
// ============================================================================

/**
 * Update URL hash without page reload
 */
function updateHash(id) {
    const newHash = id ? `#${id}` : '';
    if (window.location.hash !== newHash) {
        history.replaceState(null, '', newHash || window.location.pathname);
    }
}

/**
 * Handle deep link from URL hash on page load
 */
function handleDeepLink() {
    const hash = window.location.hash.slice(1); // Remove '#'
    if (!hash) return;

    const regionData = AppState.regions.find((r) => r.id === hash);
    if (regionData) {
        // Delay to allow initial render
        setTimeout(() => {
            selectRegion(hash);
            // Scroll region into view
            regionData.element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 300);
    }
}

/**
 * Listen for hash changes (back/forward navigation)
 */
window.addEventListener('hashchange', () => {
    const hash = window.location.hash.slice(1);
    if (hash && hash !== AppState.selectedRegion) {
        selectRegion(hash);
    } else if (!hash && AppState.selectedRegion) {
        resetSelection();
    }
});

// ============================================================================
// Accessibility Helpers
// ============================================================================

/**
 * Announce selection to screen readers
 */
function announceSelection(id) {
    const announcement = `${getRegionLabel(id)} 선택됨`;
    announceToScreenReader(announcement);
}

/**
 * Announce reset to screen readers
 */
function announceReset() {
    announceToScreenReader('선택이 해제되었습니다');
}

/**
 * Create live region announcement for screen readers
 */
function announceToScreenReader(message) {
    let liveRegion = document.getElementById('sr-live-region');
    if (!liveRegion) {
        liveRegion = document.createElement('div');
        liveRegion.id = 'sr-live-region';
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.style.position = 'absolute';
        liveRegion.style.left = '-10000px';
        liveRegion.style.width = '1px';
        liveRegion.style.height = '1px';
        liveRegion.style.overflow = 'hidden';
        document.body.appendChild(liveRegion);
    }

    // Clear and set new message
    liveRegion.textContent = '';
    setTimeout(() => {
        liveRegion.textContent = message;
    }, 100);
}

// ============================================================================
// Initialization
// ============================================================================

/**
 * Initialize application
 */
async function init() {
    console.log('Initializing Interactive Korea Map...');

    try {
        await loadSVG();
        console.log('Map loaded successfully');
    } catch (error) {
        console.error('Failed to initialize:', error);
    }
}

// Start when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// ============================================================================
// Export for debugging (optional)
// ============================================================================

window.KoreaMap = {
    state: AppState,
    selectRegion,
    resetSelection,
    getRegionLabel,
};
