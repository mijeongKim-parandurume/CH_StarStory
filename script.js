/**
 * 별과 땅의 이야기 (Stories of Stars and the Land)
 * Enhanced Version with Image Asset Support
 */

// ============================================================================
// Global State Management
// ============================================================================

const AppState = {
    regions: [],
    visitedRegions: new Set(),
    currentRegion: null,
    isModalOpen: false,
    audioPlaying: false,
    isComplete: false,
    useImageAssets: false // Toggle between image and SVG
};

// ============================================================================
// Configuration
// ============================================================================

const CONFIG = {
    // Set to true if you have image assets
    useKoreaMapImage: false, // Set true if assets/images/korea-map.png exists
    useConstellationImages: false, // Set true if constellation images exist
    useCheonsangImage: false, // Set true if cheonsang-yeolcha.png exists

    // Enhanced animation settings
    enableParticles: true,
    enableAdvancedEffects: true
};

// ============================================================================
// Data Loading
// ============================================================================

async function loadRegionData() {
    try {
        const response = await fetch('data.json');
        const data = await response.json();
        AppState.regions = data.regions;

        // Add constellation image paths if using images
        if (CONFIG.useConstellationImages) {
            AppState.regions = AppState.regions.map(region => ({
                ...region,
                constellation_image: `assets/images/constellations/${region.id}.png`
            }));
        }

        return data;
    } catch (error) {
        console.error('Failed to load region data:', error);
        return getFallbackData();
    }
}

function getFallbackData() {
    return {
        regions: [
            {
                id: "gwangmyeong",
                region_name_kr: "광명시",
                story_title: "애기 별자리",
                story_text_lines: [
                    "별을 사랑한 아이의 눈빛이 밤하늘에 남았대요.",
                    "지금도 이곳의 하늘은 조금 더 밝게 빛나죠.",
                    "어린 아이들의 순수한 마음이 별이 되어 우리를 지켜봅니다."
                ],
                coordinates: { x: 280, y: 450 },
                theme_color: "#FFD93D",
                constellation_shape: {
                    stars: [
                        {x: 100, y: 50}, {x: 140, y: 80}, {x: 180, y: 60},
                        {x: 160, y: 100}, {x: 120, y: 90}
                    ],
                    connections: [[0,1],[1,2],[2,3],[3,4],[4,0]]
                },
                audio_narration: "assets/audio/gwangmyeong_story.mp3",
                mini_symbol: "👶"
            },
            {
                id: "gaeseong",
                region_name_kr: "개성",
                story_title: "고려의 별",
                story_text_lines: [
                    "천 년 전 이곳에서 왕들이 하늘을 보며",
                    "나라의 미래를 점쳤어요.",
                    "그 별빛은 지금도 역사의 지혜를 속삭입니다."
                ],
                coordinates: { x: 320, y: 280 },
                theme_color: "#A8E6CF",
                constellation_shape: {
                    stars: [
                        {x: 150, y: 60}, {x: 200, y: 60},
                        {x: 200, y: 110}, {x: 150, y: 110}
                    ],
                    connections: [[0,1],[1,2],[2,3],[3,0]]
                },
                audio_narration: "assets/audio/gaeseong_story.mp3",
                mini_symbol: "🏛️"
            },
            {
                id: "hanyang",
                region_name_kr: "한양",
                story_title: "왕도의 하늘",
                story_text_lines: [
                    "조선의 하늘 아래,",
                    "백성들의 꿈과 왕의 뜻이 만났습니다.",
                    "궁궐 위로 빛나던 별들은 오백 년 이야기를 간직하고 있어요."
                ],
                coordinates: { x: 380, y: 350 },
                theme_color: "#FF6B9D",
                constellation_shape: {
                    stars: [
                        {x: 175, y: 90}, {x: 160, y: 70}, {x: 175, y: 50},
                        {x: 190, y: 70}, {x: 205, y: 50}, {x: 220, y: 70}, {x: 205, y: 90}
                    ],
                    connections: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,0]]
                },
                audio_narration: "assets/audio/hanyang_story.mp3",
                mini_symbol: "👑"
            },
            {
                id: "gyeongju",
                region_name_kr: "경주",
                story_title: "신라의 달과 별",
                story_text_lines: [
                    "천 년 고도의 밤하늘에는",
                    "신라인들의 지혜가 담겨 있어요.",
                    "첨성대를 통해 본 별들이 지금도 이곳을 비춥니다."
                ],
                coordinates: { x: 520, y: 520 },
                theme_color: "#C5A3FF",
                constellation_shape: {
                    stars: [
                        {x: 175, y: 50}, {x: 210, y: 65}, {x: 220, y: 100},
                        {x: 200, y: 130}, {x: 165, y: 130}, {x: 145, y: 100}, {x: 155, y: 65}
                    ],
                    connections: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,0]]
                },
                audio_narration: "assets/audio/gyeongju_story.mp3",
                mini_symbol: "🌙"
            },
            {
                id: "gangneung",
                region_name_kr: "강릉",
                story_title: "바다와 별빛",
                story_text_lines: [
                    "동해의 파도 소리와 별빛이 만나는 곳.",
                    "어부들은 별을 보며 길을 찾고,",
                    "별들은 바다에 반짝이며 답했어요."
                ],
                coordinates: { x: 600, y: 380 },
                theme_color: "#6BCFFF",
                constellation_shape: {
                    stars: [
                        {x: 140, y: 80}, {x: 160, y: 70}, {x: 180, y: 80},
                        {x: 200, y: 70}, {x: 220, y: 80}, {x: 240, y: 90}
                    ],
                    connections: [[0,1],[1,2],[2,3],[3,4],[4,5]]
                },
                audio_narration: "assets/audio/gangneung_story.mp3",
                mini_symbol: "🌊"
            },
            {
                id: "jeju",
                region_name_kr: "제주",
                story_title: "화산과 별",
                story_text_lines: [
                    "한라산 위로 쏟아지는 별빛.",
                    "섬사람들은 화산의 기운과",
                    "하늘의 빛이 하나라고 믿었답니다."
                ],
                coordinates: { x: 350, y: 720 },
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
            {
                id: "jeonju",
                region_name_kr: "전주",
                story_title: "소리와 별",
                story_text_lines: [
                    "판소리 가락이 별빛처럼 퍼져나가는 곳.",
                    "예술가들의 열정이 하늘에 닿아",
                    "별이 되었어요."
                ],
                coordinates: { x: 340, y: 550 },
                theme_color: "#98D8C8",
                constellation_shape: {
                    stars: [
                        {x: 160, y: 60}, {x: 170, y: 80}, {x: 185, y: 75},
                        {x: 200, y: 90}, {x: 215, y: 70}
                    ],
                    connections: [[0,1],[1,2],[2,3],[3,4]]
                },
                audio_narration: "assets/audio/jeonju_story.mp3",
                mini_symbol: "🎶"
            },
            {
                id: "buyeo",
                region_name_kr: "부여",
                story_title: "백제의 별",
                story_text_lines: [
                    "백제의 마지막 하늘.",
                    "낙화암 위로 떨어진 별들이",
                    "강물에 비쳐 영원한 아름다움이 되었답니다."
                ],
                coordinates: { x: 300, y: 480 },
                theme_color: "#E8B4B8",
                constellation_shape: {
                    stars: [
                        {x: 170, y: 50}, {x: 190, y: 65}, {x: 185, y: 85},
                        {x: 165, y: 95}, {x: 145, y: 80}, {x: 150, y: 60}
                    ],
                    connections: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,0]]
                },
                audio_narration: "assets/audio/buyeo_story.mp3",
                mini_symbol: "🏺"
            }
        ],
        completion_message: {
            main_text: "모든 별은, 우리 땅의 이야기였습니다.",
            sub_text: "우리의 하늘과 땅, 그 별빛은 아직도 이어지고 있습니다."
        }
    };
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

        // Start ambient sound with low volume
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

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// ============================================================================
// Image Asset Loading
// ============================================================================

function setupMapDisplay() {
    const mapImage = document.querySelector('.korea-map-image');
    const mapSVG = document.querySelector('.korea-map-svg');

    if (CONFIG.useKoreaMapImage && mapImage) {
        // Use image version
        mapImage.style.display = 'block';
        mapSVG.style.display = 'none';

        // Check if image loads successfully
        mapImage.onerror = () => {
            console.warn('Korea map image not found, falling back to SVG');
            mapImage.style.display = 'none';
            mapSVG.style.display = 'block';
        };
    } else {
        // Use SVG version (default)
        if (mapImage) mapImage.style.display = 'none';
        if (mapSVG) mapSVG.style.display = 'block';
    }
}

function setupCompletionDisplay() {
    const cheonsangImage = document.querySelector('.cheonsang-image');

    if (CONFIG.useCheonsangImage && cheonsangImage) {
        cheonsangImage.style.display = 'block';

        cheonsangImage.onerror = () => {
            console.warn('Cheonsang Yeolcha image not found, using CSS stars');
            cheonsangImage.style.display = 'none';
        };
    } else if (cheonsangImage) {
        cheonsangImage.style.display = 'none';
    }
}

// ============================================================================
// UI Rendering
// ============================================================================

function renderHotspots() {
    const container = document.querySelector('.hotspots-container');
    container.innerHTML = '';

    AppState.regions.forEach((region, index) => {
        const hotspot = document.createElement('div');
        hotspot.className = 'hotspot';
        hotspot.setAttribute('role', 'button');
        hotspot.setAttribute('aria-label', `${region.region_name_kr} 이야기 열기`);
        hotspot.setAttribute('tabindex', '0');
        hotspot.dataset.regionId = region.id;
        hotspot.style.left = `${region.coordinates.x}px`;
        hotspot.style.top = `${region.coordinates.y}px`;
        hotspot.style.animationDelay = `${1.2 + index * 0.1}s`;

        hotspot.innerHTML = `
            <div class="hotspot-glow"></div>
            <div class="hotspot-star">★</div>
            <div class="hotspot-label">${region.region_name_kr}</div>
        `;

        // Event listeners
        hotspot.addEventListener('mouseenter', () => handleHotspotHover(region));
        hotspot.addEventListener('click', () => handleHotspotClick(region, hotspot));
        hotspot.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleHotspotClick(region, hotspot);
            }
        });

        container.appendChild(hotspot);
    });
}

function renderProgressOrbs() {
    const container = document.querySelector('.progress-orbs');
    container.innerHTML = '';

    AppState.regions.forEach((region) => {
        const orb = document.createElement('div');
        orb.className = 'progress-orb';
        orb.dataset.regionId = region.id;
        orb.setAttribute('aria-label', `${region.region_name_kr} ${AppState.visitedRegions.has(region.id) ? '발견됨' : '미발견'}`);

        if (AppState.visitedRegions.has(region.id)) {
            orb.classList.add('discovered');
        }

        container.appendChild(orb);
    });

    updateProgressText();
}

function updateProgressText() {
    const text = document.querySelector('.progress-text');
    const visited = AppState.visitedRegions.size;
    const total = AppState.regions.length;

    if (visited === 0) {
        text.textContent = '더 많은 이야기를 발견하세요';
    } else if (visited === total) {
        text.textContent = '모든 이야기를 발견했습니다!';
    } else {
        text.textContent = `${visited}/${total} 이야기를 발견했습니다`;
    }
}

// ============================================================================
// Enhanced Interaction Handlers
// ============================================================================

function handleHotspotHover(region) {
    if (!AppState.isModalOpen) {
        AudioManager.play('hover', 0.3);
    }
}

function handleHotspotClick(region, hotspotElement) {
    if (AppState.isModalOpen) return;

    AudioManager.play('click', 0.4);
    AppState.currentRegion = region;

    // Create enhanced light beam effect
    createEnhancedLightBeam(region.coordinates);

    // Draw constellation in sky
    setTimeout(() => {
        drawConstellation(region);
    }, 300);

    // Show modal
    setTimeout(() => {
        showStoryModal(region);
    }, 800);

    // Mark as visited
    if (!AppState.visitedRegions.has(region.id)) {
        AppState.visitedRegions.add(region.id);
        hotspotElement.classList.add('visited');
        updateProgressOrb(region.id);
        checkCompletion();
    }
}

function createEnhancedLightBeam(coordinates) {
    const container = document.querySelector('.light-beams-container');
    const beam = document.createElement('div');
    beam.className = 'light-beam';
    beam.style.left = `${coordinates.x}px`;
    beam.style.top = `${coordinates.y}px`;

    // Add particle effects if enabled
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

    // Remove after animation
    setTimeout(() => {
        beam.remove();
    }, 1500);
}

function drawConstellation(region) {
    const svg = document.querySelector('.constellation-overlay');
    const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    group.setAttribute('class', 'constellation-group');
    group.setAttribute('data-region', region.id);

    const shape = region.constellation_shape;
    const baseX = region.coordinates.x - 50;
    const baseY = region.coordinates.y - 100;

    // Draw connections (lines) with enhanced effects
    shape.connections.forEach(([start, end], index) => {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('class', 'constellation-line');
        line.setAttribute('x1', baseX + shape.stars[start].x);
        line.setAttribute('y1', baseY + shape.stars[start].y);
        line.setAttribute('x2', baseX + shape.stars[end].x);
        line.setAttribute('y2', baseY + shape.stars[end].y);
        line.setAttribute('stroke', region.theme_color);
        line.style.animationDelay = `${300 + index * 100}ms`;
        group.appendChild(line);
    });

    // Draw stars with glow effect
    shape.stars.forEach((star, index) => {
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('class', 'constellation-star');
        circle.setAttribute('cx', baseX + star.x);
        circle.setAttribute('cy', baseY + star.y);
        circle.setAttribute('r', '4');
        circle.setAttribute('fill', region.theme_color);
        circle.setAttribute('filter', 'url(#starGlow)');
        circle.style.animationDelay = `${index * 80}ms`;
        group.appendChild(circle);
    });

    svg.appendChild(group);
}

function updateProgressOrb(regionId) {
    const orb = document.querySelector(`.progress-orb[data-region-id="${regionId}"]`);
    if (orb) {
        orb.classList.add('discovered');
        orb.setAttribute('aria-label', `${regionId} 발견됨`);
    }
    updateProgressText();
}

// ============================================================================
// Enhanced Story Modal
// ============================================================================

function showStoryModal(region) {
    const modal = document.getElementById('story-modal');
    AppState.isModalOpen = true;

    // Set theme color
    const modalContent = modal.querySelector('.modal-content');
    modalContent.style.borderColor = region.theme_color + '60';
    modalContent.style.boxShadow = `
        0 25px 80px rgba(0, 0, 0, 0.6),
        inset 0 0 60px ${region.theme_color}20
    `;

    // Draw constellation in modal
    if (CONFIG.useConstellationImages && region.constellation_image) {
        displayConstellationImage(region);
    } else {
        drawModalConstellation(region);
    }

    // Set content
    document.querySelector('.region-symbol').textContent = region.mini_symbol;
    document.getElementById('story-title').textContent = region.region_name_kr;
    document.querySelector('.story-subtitle').textContent = region.story_title;

    const storyTextContainer = document.querySelector('.story-text');
    storyTextContainer.innerHTML = region.story_text_lines
        .map(line => `<p>${line}</p>`)
        .join('');

    // Setup audio
    setupAudioPlayer(region);

    // Show modal
    modal.style.display = 'flex';

    // Event listeners
    const closeBtn = modal.querySelector('.modal-close');
    const nextBtn = modal.querySelector('.next-story-btn');

    closeBtn.onclick = closeStoryModal;
    nextBtn.onclick = closeStoryModal;

    modal.addEventListener('keydown', handleModalKeydown);
    closeBtn.focus();
}

function displayConstellationImage(region) {
    const constellationImage = document.querySelector('.constellation-image');
    const constellationSVG = document.querySelector('.modal-content .constellation-svg');

    if (constellationImage && region.constellation_image) {
        constellationImage.src = region.constellation_image;
        constellationImage.style.display = 'block';
        constellationImage.style.filter = `drop-shadow(0 0 15px ${region.theme_color})`;
        constellationSVG.style.display = 'none';

        constellationImage.onerror = () => {
            console.warn(`Constellation image not found for ${region.id}, using SVG`);
            constellationImage.style.display = 'none';
            constellationSVG.style.display = 'block';
            drawModalConstellation(region);
        };
    } else {
        drawModalConstellation(region);
    }
}

function drawModalConstellation(region) {
    const svg = document.querySelector('.modal-content .constellation-svg');
    svg.innerHTML = '';
    svg.style.display = 'block';

    const shape = region.constellation_shape;

    // Draw connections with glow
    shape.connections.forEach(([start, end]) => {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('class', 'constellation-line');
        line.setAttribute('x1', shape.stars[start].x);
        line.setAttribute('y1', shape.stars[start].y);
        line.setAttribute('x2', shape.stars[end].x);
        line.setAttribute('y2', shape.stars[end].y);
        line.setAttribute('stroke', region.theme_color);
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
        circle.setAttribute('fill', region.theme_color);
        circle.setAttribute('filter', 'url(#modalStarGlow)');
        svg.appendChild(circle);
    });
}

function setupAudioPlayer(region) {
    const audioControl = document.querySelector('.audio-control');
    const narrationAudio = AudioManager.elements.narration;

    // If no audio element, disable the audio player
    if (!narrationAudio) {
        if (audioControl) {
            audioControl.disabled = true;
            audioControl.style.opacity = '0.5';
            audioControl.style.cursor = 'not-allowed';
            document.querySelector('.audio-label').textContent = '오디오 준비 중...';
        }
        return;
    }

    narrationAudio.src = region.audio_narration;

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
}

function handleModalKeydown(e) {
    if (e.key === 'Escape') {
        closeStoryModal();
    }
}

// ============================================================================
// Completion
// ============================================================================

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

    document.querySelectorAll('.hotspot').forEach(hotspot => {
        hotspot.classList.remove('visited');
    });

    renderProgressOrbs();
    AudioManager.stop('completion');
}

// ============================================================================
// Initialization
// ============================================================================

async function init() {
    // Load data
    const data = await loadRegionData();
    AppState.regions = data.regions;

    // Setup displays
    setupMapDisplay();
    setupCompletionDisplay();

    // Initialize audio
    AudioManager.init();

    // Render UI
    renderHotspots();
    renderProgressOrbs();

    // Remove entry transition
    setTimeout(() => {
        const transition = document.getElementById('entry-transition');
        if (transition) {
            transition.style.display = 'none';
        }
    }, 2500);
}

// Start the experience when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// ============================================================================
// Accessibility Enhancements
// ============================================================================

// Keyboard navigation between hotspots
document.addEventListener('keydown', (e) => {
    if (AppState.isModalOpen) return;

    const hotspots = Array.from(document.querySelectorAll('.hotspot'));
    const currentIndex = hotspots.findIndex(h => h === document.activeElement);

    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        const nextIndex = (currentIndex + 1) % hotspots.length;
        hotspots[nextIndex].focus();
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        const prevIndex = (currentIndex - 1 + hotspots.length) % hotspots.length;
        hotspots[prevIndex].focus();
    }
});

// Export for debugging
window.AppState = AppState;
window.CONFIG = CONFIG;
