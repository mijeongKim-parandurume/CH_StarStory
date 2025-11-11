/**
 * 별과 땅의 이야기 (Stories of Stars and the Land)
 * Integrated version with Korea Map + Constellation Stories
 */

// ============================================================================
// Configuration & Constants
// ============================================================================

const CONFIG = {
    svgPath: `assets/KoreaMap.svg?v=${Date.now()}`,
    debounceDelay: 150,
    tooltipOffset: 15,
    enableParticles: true,
    enableAdvancedEffects: true
};

// ============================================================================
// Global State Management
// ============================================================================

const AppState = {
    // Map state
    svg: null,
    regions: [],
    selectedRegion: null,
    originalFills: new Map(),
    originalTransforms: new Map(),
    groupChildFills: new Map(),

    // Story state
    visitedRegions: new Set(),
    isModalOpen: false,
    audioPlaying: false,
    isComplete: false,

    // Region data with stories
    regionData: new Map()
};

// ============================================================================
// Region Data with Stories and Constellations
// ============================================================================

const REGION_STORIES = {
    // 서울/한양
    seoul: {
        region_name_kr: "서울특별시",
        story_title: "왕도의 하늘",
        story_text_lines: [
            "조선의 하늘 아래,",
            "백성들의 꿈과 왕의 뜻이 만났습니다.",
            "궁궐 위로 빛나던 별들은 오백 년 이야기를 간직하고 있어요."
        ],
        theme_color: "#FF6B9D",
        constellation_shape: {
            stars: [
                {x: 175, y: 90}, {x: 160, y: 70}, {x: 175, y: 50},
                {x: 190, y: 70}, {x: 205, y: 50}, {x: 220, y: 70}, {x: 205, y: 90}
            ],
            connections: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,0]]
        },
        audio_narration: "assets/audio/seoul_story.mp3",
        mini_symbol: "👑"
    },

    // 경기도
    gyeonggi: {
        region_name_kr: "경기도",
        story_title: "중심의 별",
        story_text_lines: [
            "나라의 중심에서",
            "모든 길이 시작되고 끝나는 곳.",
            "경기의 별들은 사방으로 빛을 비춥니다."
        ],
        theme_color: "#FFD93D",
        constellation_shape: {
            stars: [
                {x: 150, y: 100}, {x: 175, y: 80}, {x: 200, y: 100},
                {x: 220, y: 120}, {x: 200, y: 140}, {x: 175, y: 120}
            ],
            connections: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,0],[1,5]]
        },
        audio_narration: "assets/audio/gyeonggi_story.mp3",
        mini_symbol: "⭐"
    },

    // 인천
    incheon: {
        region_name_kr: "인천광역시",
        story_title: "항구의 별",
        story_text_lines: [
            "서해 바다와 만나는 곳,",
            "배들은 별을 보며 항구로 돌아왔어요.",
            "등대의 빛과 별빛이 하나가 되는 곳입니다."
        ],
        theme_color: "#6BCFFF",
        constellation_shape: {
            stars: [
                {x: 150, y: 80}, {x: 170, y: 70}, {x: 190, y: 80},
                {x: 210, y: 90}, {x: 190, y: 110}
            ],
            connections: [[0,1],[1,2],[2,3],[3,4]]
        },
        audio_narration: "assets/audio/incheon_story.mp3",
        mini_symbol: "⚓"
    },

    // 강원도
    gangwon_south: {
        region_name_kr: "강원도",
        story_title: "산과 바다의 별",
        story_text_lines: [
            "높은 산과 깊은 바다 사이,",
            "강원의 별들은 더욱 밝게 빛납니다.",
            "설악의 달빛과 동해의 별빛이 어우러집니다."
        ],
        theme_color: "#98D8C8",
        constellation_shape: {
            stars: [
                {x: 140, y: 80}, {x: 160, y: 70}, {x: 180, y: 80},
                {x: 200, y: 70}, {x: 220, y: 80}, {x: 240, y: 90}
            ],
            connections: [[0,1],[1,2],[2,3],[3,4],[4,5]]
        },
        audio_narration: "assets/audio/gangwon_story.mp3",
        mini_symbol: "⛰️"
    },

    // 경상북도
    gyeongsang_north: {
        region_name_kr: "경상북도",
        story_title: "영남의 하늘",
        story_text_lines: [
            "신라 천년의 별빛이 남아있는 곳,",
            "경주의 첨성대에서 본 별들이",
            "지금도 경북의 하늘을 수놓습니다."
        ],
        theme_color: "#C5A3FF",
        constellation_shape: {
            stars: [
                {x: 175, y: 50}, {x: 210, y: 65}, {x: 220, y: 100},
                {x: 200, y: 130}, {x: 165, y: 130}, {x: 145, y: 100}, {x: 155, y: 65}
            ],
            connections: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,0]]
        },
        audio_narration: "assets/audio/gyeongsang_north_story.mp3",
        mini_symbol: "🌙"
    },

    // 경상남도
    gyeongsang_south: {
        region_name_kr: "경상남도",
        story_title: "남해의 별빛",
        story_text_lines: [
            "남쪽 바다의 섬들마다",
            "별들이 내려와 쉬어간다고 했어요.",
            "어부들의 노래와 별빛이 함께 춤춥니다."
        ],
        theme_color: "#00D4FF",
        constellation_shape: {
            stars: [
                {x: 160, y: 90}, {x: 180, y: 75}, {x: 200, y: 90},
                {x: 215, y: 110}, {x: 195, y: 125}, {x: 165, y: 110}
            ],
            connections: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,0]]
        },
        audio_narration: "assets/audio/gyeongsang_south_story.mp3",
        mini_symbol: "🌊"
    },

    // 부산
    busan: {
        region_name_kr: "부산광역시",
        story_title: "바다와 별빛",
        story_text_lines: [
            "해운대 모래사장에 비치는 별빛,",
            "파도 소리와 함께 별들이 이야기합니다.",
            "항구도시의 불빛과 하늘의 별이 하나가 됩니다."
        ],
        theme_color: "#4ECDC4",
        constellation_shape: {
            stars: [
                {x: 170, y: 80}, {x: 190, y: 70}, {x: 210, y: 85},
                {x: 200, y: 105}, {x: 180, y: 100}
            ],
            connections: [[0,1],[1,2],[2,3],[3,4],[4,0]]
        },
        audio_narration: "assets/audio/busan_story.mp3",
        mini_symbol: "🌊"
    },

    // 대구
    daegu: {
        region_name_kr: "대구광역시",
        story_title: "분지의 별",
        story_text_lines: [
            "팔공산이 감싸안은 분지 위로",
            "별들이 더욱 가까이 내려옵니다.",
            "대구의 밤하늘은 특별히 포근합니다."
        ],
        theme_color: "#FF6B9D",
        constellation_shape: {
            stars: [
                {x: 165, y: 85}, {x: 185, y: 75}, {x: 205, y: 85},
                {x: 195, y: 105}, {x: 175, y: 105}
            ],
            connections: [[0,1],[1,2],[2,3],[3,4],[4,0]]
        },
        audio_narration: "assets/audio/daegu_story.mp3",
        mini_symbol: "🏔️"
    },

    // 울산
    ulsan: {
        region_name_kr: "울산광역시",
        story_title: "산업의 별빛",
        story_text_lines: [
            "공장의 불빛과 별빛이 만나는 곳,",
            "현대와 전통이 공존하는 울산의 하늘.",
            "태화강 위로 별들이 흐릅니다."
        ],
        theme_color: "#FFB84D",
        constellation_shape: {
            stars: [
                {x: 160, y: 80}, {x: 180, y: 75}, {x: 200, y: 85},
                {x: 210, y: 105}, {x: 180, y: 115}
            ],
            connections: [[0,1],[1,2],[2,3],[3,4]]
        },
        audio_narration: "assets/audio/ulsan_story.mp3",
        mini_symbol: "⚙️"
    },

    // 전라북도
    jeolla_north: {
        region_name_kr: "전라북도",
        story_title: "전주의 소리와 별",
        story_text_lines: [
            "판소리 가락이 별빛처럼 퍼져나가는 곳,",
            "전주의 한옥마을 위로 별들이 춤춥니다.",
            "예술가들의 열정이 하늘에 닿아 별이 되었어요."
        ],
        theme_color: "#98D8C8",
        constellation_shape: {
            stars: [
                {x: 160, y: 60}, {x: 170, y: 80}, {x: 185, y: 75},
                {x: 200, y: 90}, {x: 215, y: 70}
            ],
            connections: [[0,1],[1,2],[2,3],[3,4]]
        },
        audio_narration: "assets/audio/jeolla_north_story.mp3",
        mini_symbol: "🎶"
    },

    // 전라남도
    jeolla_south: {
        region_name_kr: "전라남도",
        story_title: "호남의 별",
        story_text_lines: [
            "다도해의 섬들마다 별이 하나씩,",
            "전남의 밤바다는 별들의 축제입니다.",
            "고흥의 우주센터에서 별들을 향해 날아갑니다."
        ],
        theme_color: "#A8E6CF",
        constellation_shape: {
            stars: [
                {x: 150, y: 90}, {x: 170, y: 75}, {x: 190, y: 85},
                {x: 210, y: 95}, {x: 195, y: 115}, {x: 170, y: 110}
            ],
            connections: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,0]]
        },
        audio_narration: "assets/audio/jeolla_south_story.mp3",
        mini_symbol: "🏝️"
    },

    // 광주
    gwangju: {
        region_name_kr: "광주광역시",
        story_title: "예향의 하늘",
        story_text_lines: [
            "예술과 민주의 도시,",
            "광주의 별들은 정의의 빛을 비춥니다.",
            "무등산 아래 빛나는 별들의 노래."
        ],
        theme_color: "#FFEAA7",
        constellation_shape: {
            stars: [
                {x: 165, y: 75}, {x: 185, y: 70}, {x: 205, y: 80},
                {x: 200, y: 100}, {x: 180, y: 105}, {x: 170, y: 95}
            ],
            connections: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,0]]
        },
        audio_narration: "assets/audio/gwangju_story.mp3",
        mini_symbol: "🎨"
    },

    // 충청북도
    chungcheong_north: {
        region_name_kr: "충청북도",
        story_title: "내륙의 별",
        story_text_lines: [
            "바다 없는 땅이지만",
            "하늘의 별들은 더욱 가깝습니다.",
            "소백산맥의 별빛이 충북을 비춥니다."
        ],
        theme_color: "#DFE6E9",
        constellation_shape: {
            stars: [
                {x: 160, y: 80}, {x: 180, y: 70}, {x: 200, y: 80},
                {x: 210, y: 100}, {x: 190, y: 110}, {x: 170, y: 100}
            ],
            connections: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,0]]
        },
        audio_narration: "assets/audio/chungcheong_north_story.mp3",
        mini_symbol: "🌲"
    },

    // 충청남도
    chungcheong_south: {
        region_name_kr: "충청남도",
        story_title: "백제의 별",
        story_text_lines: [
            "백제의 마지막 하늘,",
            "부여와 공주의 별들은 아직도 빛납니다.",
            "금강 위로 흐르는 별빛의 역사."
        ],
        theme_color: "#E8B4B8",
        constellation_shape: {
            stars: [
                {x: 170, y: 50}, {x: 190, y: 65}, {x: 185, y: 85},
                {x: 165, y: 95}, {x: 145, y: 80}, {x: 150, y: 60}
            ],
            connections: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,0]]
        },
        audio_narration: "assets/audio/chungcheong_south_story.mp3",
        mini_symbol: "🏺"
    },

    // 대전
    daejeon: {
        region_name_kr: "대전광역시",
        story_title: "과학의 별",
        story_text_lines: [
            "대덕연구단지에서 별을 연구하고,",
            "하늘의 별들도 대전을 내려다봅니다.",
            "과학과 자연이 만나는 별빛의 도시."
        ],
        theme_color: "#74B9FF",
        constellation_shape: {
            stars: [
                {x: 165, y: 75}, {x: 185, y: 65}, {x: 205, y: 75},
                {x: 210, y: 95}, {x: 185, y: 105}, {x: 160, y: 95}
            ],
            connections: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,0]]
        },
        audio_narration: "assets/audio/daejeon_story.mp3",
        mini_symbol: "🔬"
    },

    // 세종
    sejong: {
        region_name_kr: "세종특별자치시",
        story_title: "새로운 별",
        story_text_lines: [
            "새로 태어난 도시 위로",
            "새로운 별들이 모여듭니다.",
            "세종의 미래는 별빛처럼 밝습니다."
        ],
        theme_color: "#55EFC4",
        constellation_shape: {
            stars: [
                {x: 175, y: 80}, {x: 190, y: 75}, {x: 200, y: 90},
                {x: 185, y: 105}, {x: 170, y: 95}
            ],
            connections: [[0,1],[1,2],[2,3],[3,4],[4,0]]
        },
        audio_narration: "assets/audio/sejong_story.mp3",
        mini_symbol: "🌟"
    },

    // 제주
    jeju: {
        region_name_kr: "제주특별자치도",
        story_title: "화산과 별",
        story_text_lines: [
            "한라산 위로 쏟아지는 별빛,",
            "섬사람들은 화산의 기운과",
            "하늘의 빛이 하나라고 믿었답니다."
        ],
        theme_color: "#FF8C42",
        constellation_shape: {
            stars: [
                {x: 175, y: 50}, {x: 190, y: 70}, {x: 200, y: 90},
                {x: 195, y: 110}, {x: 180, y: 120}, {x: 160, y: 115},
                {x: 150, y: 95}, {x: 155, y: 70}
            ],
            connections: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7],[7,0]]
        },
        audio_narration: "assets/audio/jeju_story.mp3",
        mini_symbol: "🌋"
    },

    // 울릉도
    ulleungdo: {
        region_name_kr: "울릉도",
        story_title: "동해의 외로운 별",
        story_text_lines: [
            "동해 한가운데 떠 있는 섬,",
            "울릉도의 별들은 더욱 밝고 외롭습니다.",
            "섬사람들의 든든한 길잡이 별."
        ],
        theme_color: "#00B894",
        constellation_shape: {
            stars: [
                {x: 175, y: 80}, {x: 185, y: 70}, {x: 195, y: 80},
                {x: 190, y: 95}, {x: 180, y: 95}
            ],
            connections: [[0,1],[1,2],[2,3],[3,4],[4,0]]
        },
        audio_narration: "assets/audio/ulleungdo_story.mp3",
        mini_symbol: "🏝️"
    },

    // 독도
    dokdo: {
        region_name_kr: "독도",
        story_title: "수호의 별",
        story_text_lines: [
            "우리 땅 가장 동쪽,",
            "독도의 별은 영토를 지키는 파수꾼입니다.",
            "새벽 가장 먼저 빛나는 별."
        ],
        theme_color: "#0984E3",
        constellation_shape: {
            stars: [
                {x: 175, y: 75}, {x: 190, y: 70}, {x: 200, y: 85},
                {x: 190, y: 100}, {x: 175, y: 95}
            ],
            connections: [[0,1],[1,2],[2,3],[3,4],[4,0]]
        },
        audio_narration: "assets/audio/dokdo_story.mp3",
        mini_symbol: "🗻"
    }
};

// ============================================================================
// Utility Functions
// ============================================================================

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

function normalizeRegionId(element) {
    let id = element.getAttribute('data-region-id');
    if (!id) {
        id = element.id || element.getAttribute('data-region');
    }
    return id ? id.toLowerCase().trim() : null;
}

function getRegionStory(id) {
    return REGION_STORIES[id] || null;
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// ============================================================================
// SVG Loading & Processing
// ============================================================================

async function loadSVG() {
    const container = document.getElementById('mapContainer');
    const loadingEl = container.querySelector('.loading');

    try {
        const response = await fetch(CONFIG.svgPath, {
            cache: 'no-store',
            headers: {
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0'
            }
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const svgText = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(svgText, 'image/svg+xml');

        const parserError = doc.querySelector('parsererror');
        if (parserError) {
            throw new Error('SVG parsing failed');
        }

        const svg = doc.querySelector('svg');
        if (!svg) throw new Error('No SVG element found');

        if (!svg.hasAttribute('viewBox')) {
            const width = svg.getAttribute('width') || '1000';
            const height = svg.getAttribute('height') || '1200';
            svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
        }

        svg.removeAttribute('width');
        svg.removeAttribute('height');
        svg.classList.add('korea-map-svg');

        if (loadingEl) loadingEl.remove();
        container.appendChild(svg);

        AppState.svg = svg;

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

function processRegions() {
    if (!AppState.svg) return;

    const candidates = AppState.svg.querySelectorAll('path[id], g[id]');
    const regionGroups = new Map();

    candidates.forEach((element) => {
        let id = element.id || element.getAttribute('id');
        if (!id) return;

        id = id.toLowerCase().trim();

        if (id === 'background' || id === 'defs' || id.startsWith('_')) return;

        const parentGroup = element.parentElement.closest('g[id]');
        if (parentGroup && element.tagName.toLowerCase() === 'path') {
            return;
        }

        const dataName = element.getAttribute('data-name');
        if (dataName) {
            id = dataName.toLowerCase().trim();
        }

        const baseId = id.replace(/-\d+$/, '');

        if (!regionGroups.has(baseId)) {
            regionGroups.set(baseId, []);
        }
        regionGroups.get(baseId).push(element);
    });

    regionGroups.forEach((elements, baseId) => {
        const primaryElement = elements[0];
        const storyData = getRegionStory(baseId);

        // Only process regions that have story data
        if (!storyData) return;

        elements.forEach(el => {
            el.classList.add('region');
            el.setAttribute('data-region-id', baseId);
        });

        primaryElement.setAttribute('tabindex', '0');

        const originalFill = getComputedStyle(primaryElement).fill;
        AppState.originalFills.set(baseId, originalFill);

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

        elements.forEach(element => {
            const originalTransform = element.getAttribute('transform') || '';
            const elementKey = `${baseId}_${elements.indexOf(element)}`;
            AppState.originalTransforms.set(elementKey, originalTransform);
        });
        AppState.originalTransforms.set(baseId, primaryElement.getAttribute('transform') || '');

        primaryElement.setAttribute('role', 'button');
        primaryElement.setAttribute('aria-label', storyData.region_name_kr);

        AppState.regions.push({
            id: baseId,
            element: primaryElement,
            allElements: elements,
            storyData: storyData
        });

        AppState.regionData.set(baseId, storyData);
    });

    console.log(`Processed ${AppState.regions.length} regions with stories`);

    attachEventListeners();
    renderProgressOrbs();
}

// ============================================================================
// Event Handling
// ============================================================================

function attachEventListeners() {
    const svg = AppState.svg;
    if (!svg) return;

    svg.addEventListener('click', handleRegionClick);
    svg.addEventListener('touchstart', handleRegionTouch, { passive: false });
    svg.addEventListener('keydown', handleKeyDown);
    svg.addEventListener('mousemove', debounce(handleMouseMove, 50));
    svg.addEventListener('mouseleave', handleMouseLeave);
    svg.addEventListener('focusin', handleFocusIn);
    svg.addEventListener('focusout', handleFocusOut);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !AppState.isModalOpen) {
            resetSelection();
        }
    });
}

function handleRegionClick(event) {
    const target = event.target.closest('.region');
    if (!target || AppState.isModalOpen) return;

    event.preventDefault();
    const id = normalizeRegionId(target);
    const storyData = getRegionStory(id);

    if (!storyData) return;

    selectRegion(id);
}

function handleRegionTouch(event) {
    const target = event.target.closest('.region');
    if (!target || AppState.isModalOpen) return;

    event.preventDefault();
    const id = normalizeRegionId(target);
    const storyData = getRegionStory(id);

    if (!storyData) return;

    selectRegion(id);
}

function handleKeyDown(event) {
    const target = event.target;
    if (!target.classList.contains('region') || AppState.isModalOpen) return;

    if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        const id = normalizeRegionId(target);
        const storyData = getRegionStory(id);

        if (!storyData) return;

        selectRegion(id);
    }
}

function handleMouseMove(event) {
    const target = event.target.closest('.region');
    const tooltip = document.getElementById('tooltip');

    if (!tooltip) return;

    if (target && !target.classList.contains('active') && !AppState.isModalOpen) {
        const id = normalizeRegionId(target);
        const storyData = getRegionStory(id);

        if (storyData) {
            AudioManager.play('hover', 0.3);

            tooltip.textContent = storyData.region_name_kr;
            tooltip.style.left = `${event.pageX + CONFIG.tooltipOffset}px`;
            tooltip.style.top = `${event.pageY + CONFIG.tooltipOffset}px`;
            tooltip.classList.add('visible');
            tooltip.setAttribute('aria-hidden', 'false');
        }
    } else {
        hideTooltip();
    }
}

function handleMouseLeave() {
    hideTooltip();
}

function handleFocusIn(event) {
    const target = event.target;
    if (!target.classList.contains('region') || AppState.isModalOpen) return;

    const tooltip = document.getElementById('tooltip');
    if (!tooltip) return;

    const id = normalizeRegionId(target);
    const storyData = getRegionStory(id);

    if (storyData) {
        const rect = target.getBoundingClientRect();
        tooltip.textContent = storyData.region_name_kr;
        tooltip.style.left = `${rect.left + rect.width / 2}px`;
        tooltip.style.top = `${rect.top - 30}px`;
        tooltip.classList.add('visible');
        tooltip.setAttribute('aria-hidden', 'false');
    }
}

function handleFocusOut() {
    hideTooltip();
}

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

function selectRegion(id) {
    const regionData = AppState.regions.find((r) => r.id === id);
    if (!regionData) return;

    const storyData = regionData.storyData;
    if (!storyData) return;

    AppState.selectedRegion = id;
    AudioManager.play('click', 0.4);

    // Apply visual effects
    AppState.regions.forEach(({ id: regionId, element, allElements }) => {
        if (regionId === id) {
            (allElements || [element]).forEach(el => {
                applyScaleTransform(el, regionId, allElements.indexOf(el), 1.05);
                el.classList.add('active');
                el.classList.remove('fade');
                if (AppState.svg && el.parentNode === AppState.svg) {
                    AppState.svg.appendChild(el);
                }
            });
            element.setAttribute('aria-pressed', 'true');
            restoreOriginalFill(allElements || [element], regionId);
        } else {
            (allElements || [element]).forEach(el => {
                restoreOriginalTransform(el, regionId, allElements.indexOf(el));
                el.classList.add('fade');
                el.classList.remove('active');
            });
            element.setAttribute('aria-pressed', 'false');
            applyGrayFill(allElements || [element]);
        }
    });

    // Get region coordinates from SVG element
    const bbox = regionData.element.getBBox();
    const svgRect = AppState.svg.getBoundingClientRect();
    const coordinates = {
        x: bbox.x + bbox.width / 2,
        y: bbox.y + bbox.height / 2
    };

    // Create light beam effect
    createEnhancedLightBeam(coordinates, svgRect);

    // Draw constellation in sky
    setTimeout(() => {
        drawConstellation(storyData, coordinates);
    }, 300);

    // Show modal
    setTimeout(() => {
        showStoryModal(storyData);
    }, 800);

    // Mark as visited
    if (!AppState.visitedRegions.has(id)) {
        AppState.visitedRegions.add(id);
        updateProgressOrb(id);
        checkCompletion();
    }

    hideTooltip();
}

function applyScaleTransform(element, regionId, elementIndex, scale) {
    const transformKey = elementIndex >= 0 ? `${regionId}_${elementIndex}` : regionId;
    const originalTransform = AppState.originalTransforms.get(transformKey) || AppState.originalTransforms.get(regionId) || '';

    const bbox = element.getBBox();
    const cx = bbox.x + bbox.width / 2;
    const cy = bbox.y + bbox.height / 2;

    const scaleTransform = ` translate(${cx},${cy}) scale(${scale}) translate(${-cx},${-cy})`;

    element.setAttribute('transform', originalTransform + scaleTransform);
}

function restoreOriginalTransform(element, regionId, elementIndex) {
    const transformKey = elementIndex >= 0 ? `${regionId}_${elementIndex}` : regionId;
    const originalTransform = AppState.originalTransforms.get(transformKey) || AppState.originalTransforms.get(regionId) || '';
    element.setAttribute('transform', originalTransform);
}

function applyGrayFill(elements) {
    const grayColor = '#bfbfbf';
    const elementArray = Array.isArray(elements) ? elements : [elements];

    elementArray.forEach(element => {
        if (element.tagName.toLowerCase() === 'g') {
            const childPaths = element.querySelectorAll('path');
            childPaths.forEach(path => {
                path.style.fill = grayColor;
            });
        } else {
            element.style.fill = grayColor;
        }
    });
}

function restoreOriginalFill(elements, regionId) {
    const childFills = AppState.groupChildFills.get(regionId);

    if (childFills) {
        childFills.forEach(({ element: path }) => {
            path.style.fill = '';
        });
    } else {
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

function resetSelection() {
    AppState.selectedRegion = null;

    AppState.regions.forEach(({ id: regionId, element, allElements }) => {
        (allElements || [element]).forEach((el, index) => {
            restoreOriginalTransform(el, regionId, index);
            el.classList.remove('active', 'fade');
        });
        restoreOriginalFill(allElements || [element], regionId);
        element.setAttribute('aria-pressed', 'false');
    });
}

// ============================================================================
// Constellation & Light Effects
// ============================================================================

function createEnhancedLightBeam(coordinates, svgRect) {
    const container = document.querySelector('.light-beams-container');
    const beam = document.createElement('div');
    beam.className = 'light-beam';

    // Convert SVG coordinates to screen coordinates
    const screenX = svgRect.left + (coordinates.x / 1000) * svgRect.width;
    const screenY = svgRect.top + (coordinates.y / 1200) * svgRect.height;

    beam.style.left = `${screenX}px`;
    beam.style.top = `${screenY}px`;

    if (CONFIG.enableParticles) {
        for (let i = 0; i < 5; i++) {
            const particle = document.createElement('div');
            particle.className = 'beam-particle';
            particle.style.left = `${Math.random() * 10 - 5}px`;
            particle.style.animationDelay = `${i * 0.1}s`;
            beam.appendChild(particle);
        }
    }

    container.appendChild(beam);

    setTimeout(() => {
        beam.remove();
    }, 1500);
}

function drawConstellation(storyData, coordinates) {
    const svg = document.querySelector('.constellation-overlay');
    const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    group.setAttribute('class', 'constellation-group');
    group.setAttribute('data-region', storyData.region_name_kr);

    const shape = storyData.constellation_shape;
    const baseX = coordinates.x - 50;
    const baseY = coordinates.y - 100;

    // Draw connections
    shape.connections.forEach(([start, end], index) => {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('class', 'constellation-line');
        line.setAttribute('x1', baseX + shape.stars[start].x);
        line.setAttribute('y1', baseY + shape.stars[start].y);
        line.setAttribute('x2', baseX + shape.stars[end].x);
        line.setAttribute('y2', baseY + shape.stars[end].y);
        line.setAttribute('stroke', storyData.theme_color);
        line.style.animationDelay = `${300 + index * 100}ms`;
        group.appendChild(line);
    });

    // Draw stars
    shape.stars.forEach((star, index) => {
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('class', 'constellation-star');
        circle.setAttribute('cx', baseX + star.x);
        circle.setAttribute('cy', baseY + star.y);
        circle.setAttribute('r', '4');
        circle.setAttribute('fill', storyData.theme_color);
        circle.setAttribute('filter', 'url(#starGlow)');
        circle.style.animationDelay = `${index * 80}ms`;
        group.appendChild(circle);
    });

    svg.appendChild(group);
}

// ============================================================================
// Story Modal
// ============================================================================

function showStoryModal(storyData) {
    const modal = document.getElementById('story-modal');
    AppState.isModalOpen = true;

    const modalContent = modal.querySelector('.modal-content');
    modalContent.style.borderColor = storyData.theme_color + '60';
    modalContent.style.boxShadow = `
        0 25px 80px rgba(0, 0, 0, 0.6),
        inset 0 0 60px ${storyData.theme_color}20
    `;

    drawModalConstellation(storyData);

    document.querySelector('.region-symbol').textContent = storyData.mini_symbol;
    document.getElementById('story-title').textContent = storyData.region_name_kr;
    document.querySelector('.story-subtitle').textContent = storyData.story_title;

    const storyTextContainer = document.querySelector('.story-text');
    storyTextContainer.innerHTML = storyData.story_text_lines
        .map(line => `<p>${line}</p>`)
        .join('');

    setupAudioPlayer(storyData);

    modal.style.display = 'flex';

    const closeBtn = modal.querySelector('.modal-close');
    const nextBtn = modal.querySelector('.next-story-btn');

    closeBtn.onclick = closeStoryModal;
    nextBtn.onclick = closeStoryModal;

    modal.addEventListener('keydown', handleModalKeydown);
    closeBtn.focus();
}

function drawModalConstellation(storyData) {
    const svg = document.querySelector('.modal-content .constellation-svg');
    svg.innerHTML = '';
    svg.style.display = 'block';

    const shape = storyData.constellation_shape;

    // Draw connections
    shape.connections.forEach(([start, end]) => {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('class', 'constellation-line');
        line.setAttribute('x1', shape.stars[start].x);
        line.setAttribute('y1', shape.stars[start].y);
        line.setAttribute('x2', shape.stars[end].x);
        line.setAttribute('y2', shape.stars[end].y);
        line.setAttribute('stroke', storyData.theme_color);
        line.setAttribute('filter', 'url(#modalStarGlow)');
        svg.appendChild(line);
    });

    // Draw stars
    shape.stars.forEach((star) => {
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('class', 'constellation-star');
        circle.setAttribute('cx', star.x);
        circle.setAttribute('cy', star.y);
        circle.setAttribute('r', '5');
        circle.setAttribute('fill', storyData.theme_color);
        circle.setAttribute('filter', 'url(#modalStarGlow)');
        svg.appendChild(circle);
    });
}

function setupAudioPlayer(storyData) {
    const audioControl = document.querySelector('.audio-control');
    const narrationAudio = AudioManager.elements.narration;

    if (!narrationAudio) {
        if (audioControl) {
            audioControl.disabled = true;
            audioControl.style.opacity = '0.5';
            audioControl.style.cursor = 'not-allowed';
            document.querySelector('.audio-label').textContent = '오디오 준비 중...';
        }
        return;
    }

    narrationAudio.src = storyData.audio_narration;

    audioControl.classList.remove('playing');
    audioControl.setAttribute('aria-pressed', 'false');
    document.querySelector('.audio-progress-bar').style.width = '0%';
    document.querySelector('.audio-time').textContent = '0:00';

    audioControl.onclick = () => {
        if (narrationAudio.paused) {
            narrationAudio.play().catch(() => {});
            audioControl.classList.add('playing');
            audioControl.setAttribute('aria-pressed', 'true');
            document.querySelector('.audio-label').textContent = '재생 중...';
        } else {
            narrationAudio.pause();
            audioControl.classList.remove('playing');
            audioControl.setAttribute('aria-pressed', 'false');
            document.querySelector('.audio-label').textContent = '음성 해설 듣기';
        }
    };

    narrationAudio.ontimeupdate = () => {
        const progress = (narrationAudio.currentTime / narrationAudio.duration) * 100;
        document.querySelector('.audio-progress-bar').style.width = `${progress}%`;
        document.querySelector('.audio-time').textContent = formatTime(narrationAudio.currentTime);
    };

    narrationAudio.onended = () => {
        audioControl.classList.remove('playing');
        audioControl.setAttribute('aria-pressed', 'false');
        document.querySelector('.audio-label').textContent = '음성 해설 듣기';
    };
}

function closeStoryModal() {
    const modal = document.getElementById('story-modal');
    modal.style.display = 'none';
    AppState.isModalOpen = false;

    AudioManager.stop('narration');
    modal.removeEventListener('keydown', handleModalKeydown);

    resetSelection();
}

function handleModalKeydown(e) {
    if (e.key === 'Escape') {
        closeStoryModal();
    }
}

// ============================================================================
// Progress & Completion
// ============================================================================

function renderProgressOrbs() {
    const container = document.querySelector('.progress-orbs');
    container.innerHTML = '';

    AppState.regions.forEach((region) => {
        const orb = document.createElement('div');
        orb.className = 'progress-orb';
        orb.dataset.regionId = region.id;
        orb.setAttribute('aria-label', `${region.storyData.region_name_kr} ${AppState.visitedRegions.has(region.id) ? '발견됨' : '미발견'}`);

        if (AppState.visitedRegions.has(region.id)) {
            orb.classList.add('discovered');
        }

        container.appendChild(orb);
    });

    updateProgressText();
}

function updateProgressOrb(regionId) {
    const orb = document.querySelector(`.progress-orb[data-region-id="${regionId}"]`);
    if (orb) {
        orb.classList.add('discovered');
        const storyData = getRegionStory(regionId);
        if (storyData) {
            orb.setAttribute('aria-label', `${storyData.region_name_kr} 발견됨`);
        }
    }
    updateProgressText();
}

function updateProgressText() {
    const text = document.querySelector('.progress-text');
    const visited = AppState.visitedRegions.size;
    const total = AppState.regions.length;

    if (visited === 0) {
        text.textContent = '지도에서 지역을 선택하세요';
    } else if (visited === total) {
        text.textContent = '모든 이야기를 발견했습니다!';
    } else {
        text.textContent = `${visited}/${total} 이야기를 발견했습니다`;
    }
}

function checkCompletion() {
    if (AppState.visitedRegions.size === AppState.regions.length && !AppState.isComplete) {
        AppState.isComplete = true;
        setTimeout(() => {
            showCompletionScreen();
        }, 1000);
    }
}

function showCompletionScreen() {
    const overlay = document.getElementById('completion-overlay');
    overlay.style.display = 'flex';

    AudioManager.play('completion', 0.5);

    const returnBtn = overlay.querySelector('.return-btn');
    returnBtn.onclick = resetExperience;
    returnBtn.focus();
}

function resetExperience() {
    AppState.visitedRegions.clear();
    AppState.isComplete = false;

    document.getElementById('completion-overlay').style.display = 'none';
    document.querySelector('.constellation-overlay').innerHTML = '';

    renderProgressOrbs();
    resetSelection();
    AudioManager.stop('completion');
}

// ============================================================================
// Audio Management
// ============================================================================

const AudioManager = {
    elements: {},

    init() {
        this.elements.ambient = document.getElementById('ambient-wind');
        this.elements.hover = document.getElementById('hover-sound');
        this.elements.click = document.getElementById('click-sound');
        this.elements.narration = document.getElementById('narration-audio');
        this.elements.completion = document.getElementById('completion-music');

        if (this.elements.ambient) {
            this.elements.ambient.volume = 0.15;
            this.elements.ambient.play().catch(() => {
                document.addEventListener('click', () => {
                    this.elements.ambient.play().catch(() => {});
                }, { once: true });
            });
        }
    },

    play(soundName, volume = 0.5) {
        const audio = this.elements[soundName];
        if (audio) {
            audio.volume = volume;
            audio.currentTime = 0;
            audio.play().catch(() => {});
        }
    },

    stop(soundName) {
        const audio = this.elements[soundName];
        if (audio) {
            audio.pause();
            audio.currentTime = 0;
        }
    }
};

// ============================================================================
// Initialization
// ============================================================================

async function init() {
    console.log('Initializing 별과 땅의 이야기...');

    try {
        // Load SVG map
        await loadSVG();

        // Initialize audio
        AudioManager.init();

        // Remove entry transition
        setTimeout(() => {
            const transition = document.getElementById('entry-transition');
            if (transition) {
                transition.style.display = 'none';
            }
        }, 2500);

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
// Export for debugging
// ============================================================================

window.AppState = AppState;
window.CONFIG = CONFIG;
