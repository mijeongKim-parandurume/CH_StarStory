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
        story_title: "태미원 - 왕도의 하늘",
        story_text_lines: [
            "태미원(太微垣), 천자의 궁전을 상징하는 별자리.",
            "조선의 왕도 한양 위로 빛나던 태미성군은",
            "왕의 권위와 백성들의 꿈이 교차하는 하늘의 궁궐입니다."
        ],
        theme_color: "#FFD700",
        constellation_images: ["Sil-su.png", "Byeok-su.png"],
        constellation_shape: {
            stars: [
                // 태미원 좌우 담장 형태
                {x: 150, y: 80}, {x: 160, y: 60}, {x: 175, y: 50}, {x: 190, y: 60}, {x: 200, y: 80},
                {x: 190, y: 100}, {x: 175, y: 110}, {x: 160, y: 100}
            ],
            connections: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7],[7,0],[1,7],[3,5]]
        },
        audio_narration: "assets/audio/seoul_story.mp3",
        mini_symbol: "👑"
    },

    // 경기도
    gyeonggi: {
        region_name_kr: "경기도",
        story_title: "태미·천시·백호 - 중심의 별",
        story_text_lines: [
            "태미원, 천시원, 그리고 백호의 규·루·위 별자리.",
            "나라의 중심에 세 개의 하늘이 모여",
            "상서로움을 온 땅에 펼칩니다."
        ],
        theme_color: "#87CEEB",
        constellation_images: ["Gyu-su.png", "Ru-su.png", "Wi-su.png"],
        constellation_shape: {
            stars: [
                // 복합 별자리 형태
                {x: 145, y: 70}, {x: 165, y: 60}, {x: 185, y: 60}, {x: 205, y: 70},
                {x: 175, y: 85}, {x: 190, y: 100}, {x: 160, y: 100}, {x: 175, y: 115}
            ],
            connections: [[0,1],[1,2],[2,3],[1,4],[2,4],[4,5],[4,6],[5,7],[6,7],[0,6],[3,5]]
        },
        audio_narration: "assets/audio/gyeonggi_story.mp3",
        mini_symbol: "⭐"
    },

    // 인천
    incheon: {
        region_name_kr: "인천광역시",
        story_title: "천시원 - 시장의 별",
        story_text_lines: [
            "천시원(天市垣), 하늘의 시장을 나타내는 별자리.",
            "서해의 항구에서 교역하는 배들처럼",
            "천시성은 사람들의 교류와 번영을 지켜봅니다."
        ],
        theme_color: "#4A90E2",
        constellation_images: ["Ru-su.png", "Wi-su.png"],
        constellation_shape: {
            stars: [
                // 천시원 형태 (시장 담장 모양)
                {x: 155, y: 70}, {x: 175, y: 60}, {x: 195, y: 70},
                {x: 205, y: 85}, {x: 195, y: 100}, {x: 175, y: 110}, {x: 155, y: 100}, {x: 145, y: 85}
            ],
            connections: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7],[7,0]]
        },
        audio_narration: "assets/audio/incheon_story.mp3",
        mini_symbol: "⚓"
    },

    // 강원도
    gangwon_south: {
        region_name_kr: "강원도",
        story_title: "청룡 - 각·항·저",
        story_text_lines: [
            "동방청룡칠수 중 각수(角宿), 항수(亢宿), 저수(氐宿).",
            "봄의 시작을 알리는 청룡의 머리와 목,",
            "설악과 동해 위로 푸른 용이 승천합니다."
        ],
        theme_color: "#4ECDC4",
        constellation_images: ["Gak-su.png", "Hang-su.png", "Jeo-su.png"],
        constellation_shape: {
            stars: [
                // 청룡의 머리와 목 형태
                {x: 150, y: 60}, {x: 170, y: 55}, {x: 185, y: 65},
                {x: 195, y: 80}, {x: 200, y: 95}, {x: 210, y: 110}
            ],
            connections: [[0,1],[1,2],[2,3],[3,4],[4,5]]
        },
        audio_narration: "assets/audio/gangwon_story.mp3",
        mini_symbol: "🐉"
    },

    // 경상북도
    gyeongsang_north: {
        region_name_kr: "경상북도",
        story_title: "청룡 - 방·심·미·기",
        story_text_lines: [
            "동방청룡의 심장부, 방수(房宿)·심수(心宿)·미수(尾宿)·기수(箕宿).",
            "첨성대에서 관측한 용의 몸통과 꼬리,",
            "신라 천년의 지혜가 별빛에 담겨 있습니다."
        ],
        theme_color: "#5DADE2",
        constellation_images: ["Bang-su.png", "Sim-su.png", "Mi-su.png", "Gi-su.png"],
        constellation_shape: {
            stars: [
                // 청룡의 몸통과 꼬리
                {x: 160, y: 70}, {x: 175, y: 65}, {x: 190, y: 75},
                {x: 200, y: 90}, {x: 205, y: 105}, {x: 195, y: 120}, {x: 175, y: 125}
            ],
            connections: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6]]
        },
        audio_narration: "assets/audio/gyeongsang_north_story.mp3",
        mini_symbol: "🐉"
    },

    // 경상남도
    gyeongsang_south: {
        region_name_kr: "경상남도",
        story_title: "주작·청룡 경계 - 익·진",
        story_text_lines: [
            "남방주작의 익수(翼宿)와 진수(軫宿),",
            "청룡과 주작이 만나는 경계의 별자리.",
            "남해의 물결 위로 두 신수가 교차합니다."
        ],
        theme_color: "#E74C3C",
        constellation_images: ["Ik-su.png", "Jin-su.png"],
        constellation_shape: {
            stars: [
                // 주작의 날개 형태
                {x: 165, y: 80}, {x: 175, y: 70}, {x: 190, y: 75},
                {x: 205, y: 85}, {x: 200, y: 100}, {x: 185, y: 110}, {x: 170, y: 100}
            ],
            connections: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,0],[1,5]]
        },
        audio_narration: "assets/audio/gyeongsang_south_story.mp3",
        mini_symbol: "🦅"
    },

    // 부산
    busan: {
        region_name_kr: "부산광역시",
        story_title: "청룡·주작 - 동남의 별",
        story_text_lines: [
            "청룡의 꼬리와 주작의 날개가 만나는 곳,",
            "해운대 바다 위로 두 신수의 별빛이",
            "항구를 지키는 등대처럼 빛납니다."
        ],
        theme_color: "#3498DB",
        constellation_images: ["Gi-su.png", "Ik-su.png"],
        constellation_shape: {
            stars: [
                {x: 165, y: 75}, {x: 185, y: 70}, {x: 200, y: 80},
                {x: 205, y: 95}, {x: 195, y: 110}, {x: 175, y: 105}
            ],
            connections: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,0]]
        },
        audio_narration: "assets/audio/busan_story.mp3",
        mini_symbol: "🌊"
    },

    // 대구
    daegu: {
        region_name_kr: "대구광역시",
        story_title: "청룡 - 심수의 빛",
        story_text_lines: [
            "청룡의 심장, 심수(心宿)를 품은 분지.",
            "팔공산이 감싸안은 하늘 위로",
            "용의 심장이 붉게 고동칩니다."
        ],
        theme_color: "#E67E22",
        constellation_images: ["Sim-su.png"],
        constellation_shape: {
            stars: [
                // 심수 - 용의 심장 형태
                {x: 175, y: 75}, {x: 190, y: 70}, {x: 200, y: 85},
                {x: 190, y: 100}, {x: 175, y: 105}, {x: 160, y: 90}
            ],
            connections: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,0],[1,4]]
        },
        audio_narration: "assets/audio/daegu_story.mp3",
        mini_symbol: "❤️"
    },

    // 울산
    ulsan: {
        region_name_kr: "울산광역시",
        story_title: "청룡 - 동해의 용",
        story_text_lines: [
            "청룡의 몸통이 지나는 동해안,",
            "태화강 위로 별들이 흐르고",
            "용의 기운이 산업의 빛과 어우러집니다."
        ],
        theme_color: "#16A085",
        constellation_images: ["Bang-su.png", "Sim-su.png"],
        constellation_shape: {
            stars: [
                {x: 165, y: 75}, {x: 185, y: 70}, {x: 200, y: 80},
                {x: 210, y: 95}, {x: 200, y: 110}
            ],
            connections: [[0,1],[1,2],[2,3],[3,4]]
        },
        audio_narration: "assets/audio/ulsan_story.mp3",
        mini_symbol: "🐉"
    },

    // 전라북도
    jeolla_north: {
        region_name_kr: "전라북도",
        story_title: "주작 - 정·귀",
        story_text_lines: [
            "남방주작의 정수(井宿)와 귀수(鬼宿),",
            "판소리 가락처럼 붉은 새가 날아오르는 곳.",
            "전주의 하늘 위로 주작의 날개가 펼쳐집니다."
        ],
        theme_color: "#E74C3C",
        constellation_images: ["Jeong-su.png", "Gwi-su.png"],
        constellation_shape: {
            stars: [
                {x: 155, y: 70}, {x: 175, y: 60}, {x: 195, y: 70},
                {x: 205, y: 90}, {x: 185, y: 105}, {x: 165, y: 95}
            ],
            connections: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,0],[1,4]]
        },
        audio_narration: "assets/audio/jeolla_north_story.mp3",
        mini_symbol: "🦅"
    },

    // 전라남도
    jeolla_south: {
        region_name_kr: "전라남도",
        story_title: "주작 - 성·장·익·진",
        story_text_lines: [
            "남방주작칠수 중 성수(星宿)·장수(張宿)·익수(翼宿)·진수(軫宿).",
            "다도해의 섬들처럼 흩어진 별들이",
            "주작의 몸과 날개를 이루며 빛납니다."
        ],
        theme_color: "#C0392B",
        constellation_images: ["Seong-su.png", "Jang-su.png", "Ik-su.png", "Jin-su.png"],
        constellation_shape: {
            stars: [
                {x: 150, y: 80}, {x: 170, y: 70}, {x: 185, y: 75}, {x: 200, y: 85},
                {x: 210, y: 100}, {x: 200, y: 115}, {x: 180, y: 120}, {x: 160, y: 110}
            ],
            connections: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7],[7,0],[2,6]]
        },
        audio_narration: "assets/audio/jeolla_south_story.mp3",
        mini_symbol: "🦅"
    },

    // 광주
    gwangju: {
        region_name_kr: "광주광역시",
        story_title: "주작 - 예향의 별",
        story_text_lines: [
            "남방주작의 별빛 아래",
            "예술과 정의가 꽃피는 도시.",
            "무등산 위로 붉은 새가 날아오릅니다."
        ],
        theme_color: "#D63031",
        constellation_images: ["Ryu-su.png", "Seong-su.png"],
        constellation_shape: {
            stars: [
                {x: 165, y: 75}, {x: 185, y: 68}, {x: 200, y: 80},
                {x: 205, y: 98}, {x: 185, y: 110}, {x: 165, y: 100}
            ],
            connections: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,0],[1,4]]
        },
        audio_narration: "assets/audio/gwangju_story.mp3",
        mini_symbol: "🦅"
    },

    // 충청북도
    chungcheong_north: {
        region_name_kr: "충청북도",
        story_title: "백호 - 묘·필·삼",
        story_text_lines: [
            "서방백호칠수 중 묘수(昴宿)·필수(畢宿)·삼수(參宿).",
            "소백산맥 위로 흰 호랑이가 포효하고",
            "내륙의 하늘에 백호의 별이 빛납니다."
        ],
        theme_color: "#ECEFF1",
        constellation_images: ["Myo-su.png", "Pil-su.png", "Sam-su.png"],
        constellation_shape: {
            stars: [
                {x: 160, y: 70}, {x: 175, y: 65}, {x: 190, y: 70},
                {x: 200, y: 85}, {x: 190, y: 100}, {x: 175, y: 105}, {x: 160, y: 95}
            ],
            connections: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,0],[1,5]]
        },
        audio_narration: "assets/audio/chungcheong_north_story.mp3",
        mini_symbol: "🐯"
    },

    // 충청남도
    chungcheong_south: {
        region_name_kr: "충청남도",
        story_title: "백호 - 규·루·위",
        story_text_lines: [
            "서방백호의 규수(奎宿)·루수(婁宿)·위수(胃宿).",
            "백제의 하늘을 지키던 백호의 기운,",
            "금강 위로 흰 호랑이의 별이 흐릅니다."
        ],
        theme_color: "#BDC3C7",
        constellation_images: ["Gyu-su.png", "Ru-su.png", "Wi-su.png"],
        constellation_shape: {
            stars: [
                {x: 165, y: 65}, {x: 180, y: 60}, {x: 195, y: 70},
                {x: 200, y: 85}, {x: 185, y: 95}, {x: 170, y: 90}
            ],
            connections: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,0]]
        },
        audio_narration: "assets/audio/chungcheong_south_story.mp3",
        mini_symbol: "🐯"
    },

    // 대전
    daejeon: {
        region_name_kr: "대전광역시",
        story_title: "백호 - 과학의 빛",
        story_text_lines: [
            "백호의 별빛 아래 과학이 꽃피는 도시,",
            "대덕연구단지에서 우주를 탐구하며",
            "고대의 별과 현대의 과학이 만납니다."
        ],
        theme_color: "#95A5A6",
        constellation_images: ["Pil-su.png", "Ja-su.png"],
        constellation_shape: {
            stars: [
                {x: 170, y: 70}, {x: 185, y: 65}, {x: 200, y: 75},
                {x: 205, y: 90}, {x: 190, y: 100}, {x: 175, y: 95}
            ],
            connections: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,0]]
        },
        audio_narration: "assets/audio/daejeon_story.mp3",
        mini_symbol: "🐯"
    },

    // 세종
    sejong: {
        region_name_kr: "세종특별자치시",
        story_title: "백호 - 새로운 별",
        story_text_lines: [
            "백호의 별빛을 이어받은 새 도시,",
            "세종대왕의 이름처럼",
            "지혜와 빛이 모여드는 하늘입니다."
        ],
        theme_color: "#7F8C8D",
        constellation_images: ["Ru-su.png", "Wi-su.png"],
        constellation_shape: {
            stars: [
                {x: 175, y: 75}, {x: 190, y: 70}, {x: 200, y: 85},
                {x: 190, y: 100}, {x: 175, y: 105}, {x: 165, y: 90}
            ],
            connections: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,0]]
        },
        audio_narration: "assets/audio/sejong_story.mp3",
        mini_symbol: "🐯"
    },

    // 제주
    jeju: {
        region_name_kr: "제주특별자치도",
        story_title: "주작 - 남쪽 끝의 별",
        story_text_lines: [
            "남방주작이 날개를 펼치는 남쪽 끝,",
            "한라산 위로 붉은 새가 날아오르고",
            "화산의 기운과 별빛이 하나가 됩니다."
        ],
        theme_color: "#E17055",
        constellation_images: ["Ik-su.png", "Jin-su.png"],
        constellation_shape: {
            stars: [
                // 주작이 날개를 펼친 형태
                {x: 175, y: 60}, {x: 190, y: 70}, {x: 200, y: 85},
                {x: 195, y: 105}, {x: 180, y: 115}, {x: 160, y: 110},
                {x: 150, y: 95}, {x: 155, y: 75}
            ],
            connections: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7],[7,0],[1,5],[2,6]]
        },
        audio_narration: "assets/audio/jeju_story.mp3",
        mini_symbol: "🦅"
    },

    // 울릉도
    ulleungdo: {
        region_name_kr: "울릉도",
        story_title: "청룡 - 동해의 보석",
        story_text_lines: [
            "동해 한가운데 떠 있는 섬,",
            "청룡의 기운이 머무는 외로운 별.",
            "동방의 용이 쉬어가는 바다 위의 보석입니다."
        ],
        theme_color: "#00B894",
        constellation_images: ["Gak-su.png"],
        constellation_shape: {
            stars: [
                {x: 175, y: 75}, {x: 185, y: 68}, {x: 195, y: 78},
                {x: 190, y: 92}, {x: 180, y: 98}, {x: 165, y: 88}
            ],
            connections: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,0]]
        },
        audio_narration: "assets/audio/ulleungdo_story.mp3",
        mini_symbol: "🐉"
    },

    // 독도
    dokdo: {
        region_name_kr: "독도",
        story_title: "청룡 - 동쪽 끝 수호성",
        story_text_lines: [
            "우리 땅 가장 동쪽, 청룡이 지키는 바위섬.",
            "새벽 가장 먼저 해가 뜨는 곳,",
            "용의 정기가 영토를 수호합니다."
        ],
        theme_color: "#0984E3",
        constellation_images: ["Gak-su.png", "Hang-su.png"],
        constellation_shape: {
            stars: [
                {x: 170, y: 75}, {x: 185, y: 70}, {x: 195, y: 82},
                {x: 190, y: 95}, {x: 175, y: 98}, {x: 165, y: 88}
            ],
            connections: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,0],[1,4]]
        },
        audio_narration: "assets/audio/dokdo_story.mp3",
        mini_symbol: "🐉"
    },

    // ========== 북한 지역 ==========

    // 개성
    kaesong: {
        region_name_kr: "개성특별시",
        story_title: "자미원 - 북극성의 빛",
        story_text_lines: [
            "자미원(紫微垣), 천제가 거처하는 북극성 주변의 별자리.",
            "고려의 수도 개성 위로 빛나던 북극성은",
            "불변의 중심을 상징하는 하늘의 황제입니다."
        ],
        theme_color: "#9B59B6",
        constellation_shape: {
            stars: [
                // 자미원 - 북극성 중심
                {x: 175, y: 70}, {x: 190, y: 65}, {x: 200, y: 75}, {x: 195, y: 90},
                {x: 180, y: 100}, {x: 165, y: 95}, {x: 155, y: 80}, {x: 160, y: 70}
            ],
            connections: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7],[7,0],[0,4]]
        },
        audio_narration: "assets/audio/kaesong_story.mp3",
        mini_symbol: "⭐"
    },

    // 평양
    pyongyang: {
        region_name_kr: "평양직할시",
        story_title: "자미원·현무 경계 - 천봉·천추",
        story_text_lines: [
            "자미원과 북방현무가 만나는 경계의 별,",
            "천봉(天棒)과 천추(天樞)는 하늘의 축을 이루며",
            "대동강 위로 불변의 빛을 비춥니다."
        ],
        theme_color: "#8E44AD",
        constellation_shape: {
            stars: [
                {x: 165, y: 70}, {x: 185, y: 65}, {x: 200, y: 75}, {x: 205, y: 90},
                {x: 190, y: 105}, {x: 170, y: 100}, {x: 155, y: 85}
            ],
            connections: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,0],[1,5]]
        },
        audio_narration: "assets/audio/pyongyang_story.mp3",
        mini_symbol: "⭐"
    },

    // 황해북도
    hwanghae_north: {
        region_name_kr: "황해북도",
        story_title: "백호 - 자·삼",
        story_text_lines: [
            "서방백호의 자수(觜宿)와 삼수(參宿),",
            "서해를 향한 백호의 앞발,",
            "흰 호랑이의 기운이 황해를 지킵니다."
        ],
        theme_color: "#ECF0F1",
        constellation_images: ["Ja-su.png", "Sam-su.png"],
        constellation_shape: {
            stars: [
                {x: 160, y: 75}, {x: 180, y: 70}, {x: 195, y: 80},
                {x: 200, y: 95}, {x: 185, y: 105}, {x: 165, y: 100}
            ],
            connections: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,0]]
        },
        audio_narration: "assets/audio/hwanghae_north_story.mp3",
        mini_symbol: "🐯"
    },

    // 황해남도
    hwanghae_south: {
        region_name_kr: "황해남도",
        story_title: "백호 - 서해의 수호",
        story_text_lines: [
            "서방백호의 별빛 아래,",
            "황해남도의 바다와 육지를 지키는",
            "흰 호랑이의 위엄이 서려 있습니다."
        ],
        theme_color: "#BDC3C7",
        constellation_images: ["Gyu-su.png", "Ru-su.png"],
        constellation_shape: {
            stars: [
                {x: 165, y: 80}, {x: 185, y: 75}, {x: 200, y: 85},
                {x: 195, y: 100}, {x: 175, y: 105}, {x: 160, y: 95}
            ],
            connections: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,0]]
        },
        audio_narration: "assets/audio/hwanghae_south_story.mp3",
        mini_symbol: "🐯"
    },

    // 평안남도
    pyeongan_south: {
        region_name_kr: "평안남도",
        story_title: "현무 - 두·우·여",
        story_text_lines: [
            "북방현무칠수 중 두수(斗宿)·우수(牛宿)·여수(女宿),",
            "거북과 뱀이 얽힌 현무의 형상,",
            "북쪽 하늘의 지혜가 평안을 지킵니다."
        ],
        theme_color: "#34495E",
        constellation_images: ["Du-su.png", "U-su.png", "Yeo-su.png"],
        constellation_shape: {
            stars: [
                {x: 155, y: 70}, {x: 175, y: 65}, {x: 190, y: 70}, {x: 200, y: 85},
                {x: 195, y: 100}, {x: 180, y: 110}, {x: 160, y: 105}, {x: 150, y: 88}
            ],
            connections: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7],[7,0],[2,6]]
        },
        audio_narration: "assets/audio/pyeongan_south_story.mp3",
        mini_symbol: "🐢"
    },

    // 평안북도
    pyeongan_north: {
        region_name_kr: "평안북도",
        story_title: "현무 - 허·위",
        story_text_lines: [
            "북방현무의 허수(虛宿)와 위수(危宿),",
            "북녘 끝 하늘을 지키는 현무의 머리,",
            "압록강 위로 신비로운 별빛이 내립니다."
        ],
        theme_color: "#2C3E50",
        constellation_images: ["Heo-su.png", "Wi-su(Hyeonmu).png"],
        constellation_shape: {
            stars: [
                {x: 160, y: 65}, {x: 180, y: 60}, {x: 195, y: 70},
                {x: 205, y: 85}, {x: 195, y: 100}, {x: 175, y: 105}, {x: 160, y: 95}
            ],
            connections: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,0],[1,5]]
        },
        audio_narration: "assets/audio/pyeongan_north_story.mp3",
        mini_symbol: "🐢"
    },

    // 함경남도
    hamgyeong_south: {
        region_name_kr: "함경남도",
        story_title: "청룡 말단 - 미·기",
        story_text_lines: [
            "동방청룡의 꼬리 끝, 미수(尾宿)와 기수(箕宿),",
            "함흥평야 위로 청룡의 꼬리가 휘날리며",
            "동해를 향해 용의 기운을 뿜어냅니다."
        ],
        theme_color: "#16A085",
        constellation_images: ["Mi-su.png", "Gi-su.png"],
        constellation_shape: {
            stars: [
                {x: 165, y: 70}, {x: 180, y: 65}, {x: 195, y: 75},
                {x: 205, y: 90}, {x: 200, y: 105}, {x: 185, y: 115}
            ],
            connections: [[0,1],[1,2],[2,3],[3,4],[4,5]]
        },
        audio_narration: "assets/audio/hamgyeong_south_story.mp3",
        mini_symbol: "🐉"
    },

    // 함경북도
    hamgyeong_north: {
        region_name_kr: "함경북도",
        story_title: "현무 - 실·벽",
        story_text_lines: [
            "북방현무의 실수(室宿)와 벽수(壁宿),",
            "백두산 위로 현무의 별이 빛나고",
            "두만강 너머 북쪽 끝 하늘을 지킵니다."
        ],
        theme_color: "#1A252F",
        constellation_images: ["Sil-su.png", "Byeok-su.png"],
        constellation_shape: {
            stars: [
                {x: 160, y: 70}, {x: 175, y: 65}, {x: 190, y: 70}, {x: 200, y: 85},
                {x: 195, y: 100}, {x: 180, y: 105}, {x: 165, y: 95}
            ],
            connections: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,0]]
        },
        audio_narration: "assets/audio/hamgyeong_north_story.mp3",
        mini_symbol: "🐢"
    },

    // 나선 (라선)
    nason: {
        region_name_kr: "나선특별시",
        story_title: "현무·청룡 경계 - 동해의 새벽별",
        story_text_lines: [
            "현무와 청룡이 만나는 북동쪽 끝,",
            "동해의 새벽을 가장 먼저 맞이하는 별.",
            "두 신수의 기운이 교차하는 신비로운 곳입니다."
        ],
        theme_color: "#1ABC9C",
        constellation_images: ["Byeok-su.png", "Gak-su.png"],
        constellation_shape: {
            stars: [
                {x: 170, y: 70}, {x: 185, y: 65}, {x: 200, y: 75},
                {x: 205, y: 90}, {x: 190, y: 100}, {x: 175, y: 95}
            ],
            connections: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,0],[1,4]]
        },
        audio_narration: "assets/audio/nason_story.mp3",
        mini_symbol: "⭐"
    },

    // 강원도(북)
    gangwon_north: {
        region_name_kr: "강원도(북한)",
        story_title: "금강산의 별",
        story_text_lines: [
            "금강산 일만이천 봉우리 위로",
            "청룡과 현무의 별빛이 어우러지고",
            "산신령의 전설이 별이 되어 빛납니다."
        ],
        theme_color: "#27AE60",
        constellation_images: ["Jeo-su.png", "Bang-su.png"],
        constellation_shape: {
            stars: [
                {x: 165, y: 75}, {x: 180, y: 70}, {x: 195, y: 80},
                {x: 200, y: 95}, {x: 185, y: 105}, {x: 170, y: 100}
            ],
            connections: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,0]]
        },
        audio_narration: "assets/audio/gangwon_north_story.mp3",
        mini_symbol: "⛰️"
    },

    // 자강도
    jagang: {
        region_name_kr: "자강도",
        story_title: "현무 - 산악의 별빛",
        story_text_lines: [
            "낭림산맥과 묘향산 위로",
            "북방현무의 기운이 산악을 감싸고",
            "험준한 산세가 별빛을 머금습니다."
        ],
        theme_color: "#2C3E50",
        constellation_images: ["Du-su.png", "U-su.png", "Heo-su.png"],
        constellation_shape: {
            stars: [
                {x: 160, y: 70}, {x: 175, y: 65}, {x: 190, y: 75},
                {x: 200, y: 90}, {x: 185, y: 100}, {x: 170, y: 95}
            ],
            connections: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,0]]
        },
        audio_narration: "assets/audio/jagang_story.mp3",
        mini_symbol: "⛰️"
    },

    // 양강도
    ryanggang: {
        region_name_kr: "양강도",
        story_title: "현무 - 백두의 별",
        story_text_lines: [
            "백두산 천지 위로 쏟아지는 별빛,",
            "북방현무의 정기가 가장 강한 곳.",
            "민족의 영산에 하늘의 빛이 머뭅니다."
        ],
        theme_color: "#34495E",
        constellation_images: ["Sil-su.png", "Byeok-su.png"],
        constellation_shape: {
            stars: [
                {x: 170, y: 65}, {x: 185, y: 60}, {x: 195, y: 70}, {x: 200, y: 85},
                {x: 190, y: 100}, {x: 175, y: 105}, {x: 160, y: 95}, {x: 155, y: 80}
            ],
            connections: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7],[7,0],[1,5],[2,6]]
        },
        audio_narration: "assets/audio/ryanggang_story.mp3",
        mini_symbol: "⛰️"
    },

    // 남포
    nampo: {
        region_name_kr: "남포특별시",
        story_title: "백호·현무 - 항구의 밤하늘",
        story_text_lines: [
            "서해안 항구 위로 백호와 현무의 별이 만나고",
            "대동강 하구의 물결 위로",
            "두 신수의 빛이 조화롭게 흐릅니다."
        ],
        theme_color: "#95A5A6",
        constellation_images: ["Ja-su.png", "Sam-su.png", "Du-su.png"],
        constellation_shape: {
            stars: [
                {x: 165, y: 75}, {x: 185, y: 70}, {x: 200, y: 80},
                {x: 205, y: 95}, {x: 190, y: 105}, {x: 170, y: 100}
            ],
            connections: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,0]]
        },
        audio_narration: "assets/audio/nampo_story.mp3",
        mini_symbol: "⚓"
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

    // Initialize all regions as gray/faded
    AppState.regions.forEach(({ allElements }) => {
        allElements.forEach(el => {
            el.classList.add('fade');
        });
        applyGrayFill(allElements);
    });

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
    // Mark this region as visited
    AppState.visitedRegions.add(id);
    AudioManager.play('click', 0.4);

    // Apply visual effects
    AppState.regions.forEach(({ id: regionId, element, allElements }) => {
        if (regionId === id) {
            (allElements || [element]).forEach(el => {
                applyScaleTransform(el, regionId, allElements.indexOf(el), 1.05);
                el.classList.add('active');
                el.classList.remove('fade', 'visited');
                if (AppState.svg && el.parentNode === AppState.svg) {
                    AppState.svg.appendChild(el);
                }
            });
            element.setAttribute('aria-pressed', 'true');
            restoreOriginalFill(allElements || [element], regionId);
        } else {
            // Check if this region has been visited before
            const isVisited = AppState.visitedRegions.has(regionId);

            (allElements || [element]).forEach(el => {
                restoreOriginalTransform(el, regionId, allElements.indexOf(el));
                el.classList.remove('active');

                if (isVisited) {
                    // Visited regions keep their original color
                    el.classList.add('visited');
                    el.classList.remove('fade');
                } else {
                    // Unvisited regions are faded
                    el.classList.add('fade');
                    el.classList.remove('visited');
                }
            });
            element.setAttribute('aria-pressed', 'false');

            // Apply appropriate fill based on visited status
            if (isVisited) {
                restoreOriginalFill(allElements || [element], regionId);
            } else {
                applyGrayFill(allElements || [element]);
            }
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

    // Draw constellation in sky (disabled)
    // setTimeout(() => {
    //     drawConstellation(storyData, coordinates);
    // }, 300);

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
    // Clear visited regions
    AppState.visitedRegions.clear();

    AppState.regions.forEach(({ id: regionId, element, allElements }) => {
        (allElements || [element]).forEach((el, index) => {
            restoreOriginalTransform(el, regionId, index);
            el.classList.remove('active', 'visited');
            el.classList.add('fade');
        });
        applyGrayFill(allElements || [element]);
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

    // Remove all existing constellation groups before drawing new one
    const existingGroups = svg.querySelectorAll('.constellation-group');
    existingGroups.forEach(group => group.remove());

    const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    group.setAttribute('class', 'constellation-group');
    group.setAttribute('data-region', storyData.region_name_kr);

    // Check if constellation images are available
    if (storyData.constellation_images && storyData.constellation_images.length > 0) {
        // Use actual constellation images
        const baseX = coordinates.x;
        const baseY = coordinates.y - 120;
        const imageSpacing = 80; // Space between images horizontally
        const startX = baseX - (storyData.constellation_images.length * imageSpacing) / 2;

        storyData.constellation_images.forEach((imageName, index) => {
            const xPos = startX + index * imageSpacing;

            // Add constellation image with glow effect (no background)
            const image = document.createElementNS('http://www.w3.org/2000/svg', 'image');
            image.setAttribute('class', 'constellation-image');
            image.setAttributeNS('http://www.w3.org/1999/xlink', 'href', `assets/images/28/${imageName}`);
            image.setAttribute('x', xPos);
            image.setAttribute('y', baseY);
            image.setAttribute('width', '70');
            image.setAttribute('height', '70');
            image.setAttribute('opacity', '0');
            image.style.animation = `fadeInScale 0.6s ease-out ${index * 0.15}s forwards`;
            // Enhanced brightness and strong glow for white constellation images
            image.style.filter = `brightness(2.5) contrast(1.3) drop-shadow(0 0 12px ${storyData.theme_color}) drop-shadow(0 0 6px white)`;
            group.appendChild(image);
        });
    } else {
        // Fallback: Draw original SVG constellation shapes
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
    }

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

    // Check if constellation images are available
    if (storyData.constellation_images && storyData.constellation_images.length > 0) {
        // Use actual constellation images
        const imageWidth = 80;
        const imageHeight = 80;
        const imageSpacing = 10;
        const totalWidth = storyData.constellation_images.length * (imageWidth + imageSpacing) - imageSpacing;
        const startX = (300 - totalWidth) / 2; // Center in viewBox
        const startY = (200 - imageHeight) / 2;

        storyData.constellation_images.forEach((imageName, index) => {
            const xPos = startX + index * (imageWidth + imageSpacing);

            // Add constellation image with strong glow (no background box)
            const image = document.createElementNS('http://www.w3.org/2000/svg', 'image');
            image.setAttribute('class', 'constellation-image-modal');
            image.setAttributeNS('http://www.w3.org/1999/xlink', 'href', `assets/images/28/${imageName}`);
            image.setAttribute('x', xPos);
            image.setAttribute('y', startY);
            image.setAttribute('width', imageWidth);
            image.setAttribute('height', imageHeight);
            // Force opacity inline
            image.style.opacity = '1';
            // Extreme brightness and strong glow for white constellation images
            image.style.filter = `brightness(3) contrast(1.5) drop-shadow(0 0 20px ${storyData.theme_color}) drop-shadow(0 0 10px white) drop-shadow(0 0 5px white)`;
            svg.appendChild(image);
        });
    } else {
        // Fallback: Draw original SVG constellation shapes
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

    // Update the currently selected region to visited state (keep its color)
    if (AppState.selectedRegion) {
        const regionData = AppState.regions.find(r => r.id === AppState.selectedRegion);
        if (regionData) {
            const { element, allElements } = regionData;
            (allElements || [element]).forEach((el, index) => {
                restoreOriginalTransform(el, AppState.selectedRegion, index);
                el.classList.remove('active');
                el.classList.add('visited');
            });
            element.setAttribute('aria-pressed', 'false');
        }
        AppState.selectedRegion = null;
    }
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
