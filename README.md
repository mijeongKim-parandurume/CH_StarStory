# 별과 땅의 이야기 (Stories of Stars and the Land)

고대 한국 천문도인 **천상열차분야지도**와 한국의 실제 지역을 연결하는 인터랙티브 교육 웹 체험입니다.

## 📖 프로젝트 개요

이 프로젝트는 하늘의 별자리와 땅의 전설이 어떻게 연결되는지를 보여주는 교육적인 웹 경험을 제공합니다. 사용자는 한반도 지도의 여러 지역을 탐험하며, 각 지역에 얽힌 천문학적 이야기와 문화적 전설을 발견합니다.

### 핵심 컨셉
- **테마**: "하늘의 별이 땅의 이야기로 이어진다"
- **교육 목표**: 고대 천문학과 지역 민속 신화의 연결 고리 학습
- **대상**: 어린이와 일반 대중
- **톤**: 차분하고 신비로우며 문화적으로 풍부함

## 🌟 주요 기능

- **인터랙티브 지도**: 한반도 지도 위의 8개 지역 탐험
- **별자리 애니메이션**: 각 지역을 클릭하면 해당 별자리가 하늘에 그려집니다
- **스토리텔링**: 각 지역의 고유한 이야기와 음성 해설
- **진행 상황 추적**: 발견한 이야기를 시각적으로 표시
- **완료 축하**: 모든 지역 탐험 시 특별한 애니메이션

## 📂 파일 구조

```
CH_StarStory/
├── index.html              # 메인 HTML 구조
├── styles.css              # 모든 스타일과 애니메이션
├── script.js               # 인터랙션 로직
├── data.json               # 지역 데이터 및 스토리
├── README.md               # 이 문서
└── assets/
    └── audio/
        ├── ambient/        # 배경 사운드
        │   ├── night_wind_loop.mp3
        │   └── harp_harmonics_loop.mp3
        ├── interaction/    # 인터랙션 사운드
        │   ├── hover_shimmer.mp3
        │   ├── click_ting.mp3
        │   └── modal_open.mp3
        ├── narration/      # 스토리 음성 해설
        │   ├── gwangmyeong_story.mp3
        │   ├── gaeseong_story.mp3
        │   ├── hanyang_story.mp3
        │   ├── gyeongju_story.mp3
        │   ├── gangneung_story.mp3
        │   ├── jeju_story.mp3
        │   ├── jeonju_story.mp3
        │   └── buyeo_story.mp3
        └── completion/     # 완료 사운드
            └── orchestral_swell.mp3
```

## 🚀 설치 및 실행

### 필수 요구사항
- 모던 웹 브라우저 (Chrome, Firefox, Safari, Edge 최신 버전)
- 로컬 웹 서버 (CORS 정책으로 인해 파일 직접 열기 불가)

### 실행 방법

#### 방법 1: Python 간단 서버
```bash
# Python 3.x
cd CH_StarStory
python -m http.server 8000

# 브라우저에서 http://localhost:8000 접속
```

#### 방법 2: Node.js 서버
```bash
# http-server 설치 (전역)
npm install -g http-server

# 서버 실행
cd CH_StarStory
http-server -p 8000

# 브라우저에서 http://localhost:8000 접속
```

#### 방법 3: VS Code Live Server
1. VS Code에서 프로젝트 폴더 열기
2. "Live Server" 확장 설치
3. `index.html` 파일에서 우클릭 → "Open with Live Server"

## 🎮 사용 방법

### 기본 조작
1. **지역 탐험**: 지도 위의 별빛 포인트에 마우스를 올리거나 클릭
2. **스토리 읽기**: 모달 창에서 각 지역의 이야기 확인
3. **음성 듣기**: 🔊 버튼을 클릭하여 음성 해설 재생
4. **다음 이야기**: "다른 하늘 이야기 보기" 버튼으로 다음 지역 탐험
5. **완료**: 8개 지역을 모두 탐험하면 특별한 완료 화면 표시

### 키보드 접근성
- `Tab`: 핫스팟 사이 이동
- `Enter` / `Space`: 핫스팟 활성화
- `Esc`: 모달 창 닫기
- `Arrow Keys`: 핫스팟 간 탐색 (선택)

## 🎨 포함된 지역

| 지역 | 이야기 제목 | 테마 색상 | 상징 |
|------|-------------|-----------|------|
| 광명시 | 애기 별자리 | 🟡 Gold | 👶 |
| 개성 | 고려의 별 | 🟢 Jade Green | 🏛️ |
| 한양 | 왕도의 하늘 | 🩷 Royal Pink | 👑 |
| 경주 | 신라의 달과 별 | 🟣 Purple | 🌙 |
| 강릉 | 바다와 별빛 | 🔵 Ocean Blue | 🌊 |
| 제주 | 화산과 별 | 🟠 Volcanic Orange | 🌋 |
| 전주 | 소리와 별 | 🟢 Mint | 🎶 |
| 부여 | 백제의 별 | 🩷 Rose | 🏺 |

## 🔊 오디오 파일 준비

오디오 파일은 프로젝트에 포함되어 있지 않습니다. 다음 가이드라인에 따라 준비해주세요:

### 음성 해설 제작 가이드
- **포맷**: MP3, 128kbps 이상
- **길이**: 9-14초
- **목소리**: 따뜻하고 차분한 여성 목소리 권장
- **속도**: 120-140 단어/분
- **후처리**: 가벼운 리버브 (0.8초 decay), 2-4kHz EQ 부스트

### 배경음 가이드
- **night_wind_loop.mp3**: 90초 루프, -28dB
- **harp_harmonics_loop.mp3**: 45초 루프, -30dB
- **hover_shimmer.mp3**: 200ms, 윈드차임 소리
- **click_ting.mp3**: 800ms, 크리스탈 소리 + 하프 글리산도

오디오 없이도 체험은 정상 작동하며, 음성이 없을 경우 텍스트만 표시됩니다.

## 🎯 브라우저 호환성

### 완벽히 지원
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

### 부분 지원
- ⚠️ Internet Explorer: 지원 안 함

## 📱 반응형 디자인

이 웹 경험은 다양한 화면 크기에 최적화되어 있습니다:

- **Desktop Large** (≥1920px): 전체 경험 + 추가 세부 사항
- **Desktop** (1280-1919px): 표준 레이아웃
- **Tablet Landscape** (1024-1279px): 약간 축소된 지도
- **Tablet Portrait** (768-1023px): 세로 스크롤 지도
- **Mobile Large** (414-767px): 터치 기반, 단순화된 애니메이션
- **Mobile Small** (≤413px): 최소 애니메이션, 텍스트 중심

## ♿ 접근성 기능

이 프로젝트는 **WCAG 2.1 AA** 기준을 준수합니다:

- ✅ 키보드 네비게이션 완벽 지원
- ✅ 스크린 리더 호환
- ✅ 색상 대비 비율 4.5:1 이상
- ✅ ARIA 레이블 및 역할
- ✅ 애니메이션 감소 모드 지원
- ✅ 포커스 표시기

### 애니메이션 감소 모드
사용자 시스템 설정에서 "애니메이션 감소" 옵션이 활성화된 경우, 모든 애니메이션이 최소화됩니다.

## 🔧 커스터마이징

### 데이터 수정
`data.json` 파일을 편집하여 지역, 스토리, 별자리 모양을 변경할 수 있습니다.

```json
{
  "id": "new_region",
  "region_name_kr": "새로운 지역",
  "story_title": "새로운 이야기",
  "story_text_lines": ["첫 번째 문장", "두 번째 문장"],
  "coordinates": { "x": 400, "y": 500 },
  "theme_color": "#FF5733",
  "constellation_shape": {
    "stars": [{"x": 100, "y": 50}, {"x": 140, "y": 80}],
    "connections": [[0, 1]]
  },
  "audio_narration": "assets/audio/narration/new_region.mp3",
  "mini_symbol": "⭐"
}
```

### 스타일 수정
`styles.css` 파일의 상단 CSS 변수를 수정하여 색상 테마를 변경할 수 있습니다:

```css
:root {
    --bg-top: #0A1128;
    --bg-bottom: #1F2A5A;
    --hotspot-inactive: #FFE66D;
    /* ... */
}
```

## 🐛 문제 해결

### 오디오가 재생되지 않음
- 브라우저의 자동 재생 정책으로 인해 첫 상호작용 전까지 오디오가 차단될 수 있습니다
- 페이지 어디든 클릭하면 오디오가 활성화됩니다

### 데이터가 로드되지 않음
- 로컬 웹 서버를 사용하고 있는지 확인하세요 (파일 직접 열기 불가)
- 브라우저 콘솔(F12)에서 CORS 오류 확인

### 애니메이션이 느림
- 구형 브라우저나 저사양 기기에서는 성능이 저하될 수 있습니다
- `styles.css`에서 애니메이션을 단순화하거나 제거할 수 있습니다

## 📄 라이선스

이 프로젝트는 교육 목적으로 제작되었습니다. 자유롭게 수정하고 사용하세요.

## 🙏 크레딧

- **디자인 컨셉**: 천상열차분야지도와 한국 민속 전설에서 영감
- **개발**: Claude Code
- **문화 자료**: 한국 전통 천문학 및 지역 설화

## 📞 지원

문제가 발생하거나 질문이 있으시면:
1. 브라우저 콘솔(F12)에서 오류 메시지 확인
2. README의 문제 해결 섹션 참조
3. 이슈 트래커에 문제 보고

---

**"우리의 하늘과 땅, 그 별빛은 아직도 이어지고 있습니다."**
