# 🎨 이미지 에셋 가이드

통합된 메인 버전(`index.html`)에서 사용할 수 있는 이미지 에셋 가이드입니다.

> **참고**: v2 버전 파일들은 `_backup_old_version` 폴더로 이동되었습니다.

## 📁 폴더 구조

```
assets/
├── images/
│   ├── korea-map.png           # 한반도 지도 이미지
│   ├── cheonsang-yeolcha.png   # 천상열차분야지도 이미지
│   └── constellations/         # 별자리 이미지들
│       ├── gwangmyeong.png
│       ├── gaeseong.png
│       ├── hanyang.png
│       ├── gyeongju.png
│       ├── gangneung.png
│       ├── jeju.png
│       ├── jeonju.png
│       └── buyeo.png
└── audio/
    └── (기존과 동일)
```

---

## 1️⃣ 한반도 지도 이미지

### 파일명
`assets/images/korea-map.png`

### 사양
- **크기**: 1200×1600px (3:4 비율)
- **포맷**: PNG (투명 배경 권장)
- **스타일**:
  - 심플한 아웃라인 스타일
  - 약간의 발광 효과 (선택)
  - 색상: 청록색 계열 (#00D4FF)
  - 배경: 투명 또는 매우 어두운 색

### 제작 방법

#### 방법 1: 무료 이미지 사용
1. [Wikimedia Commons](https://commons.wikimedia.org) 에서 "South Korea map" 검색
2. 심플한 아웃라인 지도 다운로드 (SVG 권장)
3. Photoshop/GIMP에서 색상 변경 (#00D4FF)
4. Outer Glow 효과 추가

#### 방법 2: 직접 제작 (Figma/Illustrator)
1. 한반도 지도 SVG 다운로드
2. 불필요한 디테일 제거
3. 단순한 패스로 정리
4. 발광 효과 적용
5. PNG로 내보내기

#### 방법 3: AI 생성
```
프롬프트: "Minimalist outline map of Korean Peninsula,
glowing cyan lines, transparent background,
simple vector style, no text"
```

### 예시 스타일
```
- 깔끔한 라인 (2-3px 두께)
- 외곽 발광 (10-20px blur)
- 반투명 내부 그라데이션 (선택)
```

---

## 2️⃣ 천상열차분야지도 이미지

### 파일명
`assets/images/cheonsang-yeolcha.png`

### 사양
- **크기**: 1920×1080px (Full HD)
- **포맷**: PNG 또는 JPG
- **스타일**: 역사적 천문도 (실제 또는 재해석)

### 제작 방법

#### 방법 1: 실제 유물 이미지 사용
1. [국립중앙박물관 e뮤지엄](https://www.emuseum.go.kr) 방문
2. "천상열차분야지도" 검색
3. 고해상도 이미지 다운로드 (공공누리 확인)
4. 밝기/대비 조정

#### 방법 2: 별자리 패턴 생성
- Starry Sky Generator 사용
- 전통 천문도 스타일로 재해석
- 별들을 연결하는 선 추가

#### 방법 3: Photoshop 합성
1. 별 텍스처 레이어
2. 전통 패턴 오버레이
3. 금색 또는 청록색 색조 적용

---

## 3️⃣ 별자리 이미지 (선택)

### 파일명
각 지역별로 8개 파일:
- `gwangmyeong.png` (광명시)
- `gaeseong.png` (개성)
- `hanyang.png` (한양)
- `gyeongju.png` (경주)
- `gangneung.png` (강릉)
- `jeju.png` (제주)
- `jeonju.png` (전주)
- `buyeo.png` (부여)

### 사양
- **크기**: 600×400px
- **포맷**: PNG (투명 배경 필수)
- **스타일**:
  - 별 + 연결선
  - 각 지역 테마 색상 사용
  - 발광 효과

### 제작 방법

#### 방법 1: Illustrator/Figma
1. 별 아이콘 배치 (data.json의 좌표 참고)
2. 선으로 연결
3. 각 지역 테마 색상 적용
4. Outer Glow 효과
5. PNG로 내보내기 (배경 투명)

#### 방법 2: 온라인 도구
- [Canva](https://canva.com) - 별 템플릿 사용
- [Figma](https://figma.com) - 무료 버전으로 제작
- [Photopea](https://photopea.com) - 브라우저 기반 Photoshop

#### 별자리별 테마 색상
| 지역 | 색상 코드 | 설명 |
|------|-----------|------|
| 광명 | `#FFD93D` | 따뜻한 금색 |
| 개성 | `#A8E6CF` | 옥색 녹색 |
| 한양 | `#FF6B9D` | 왕실 분홍 |
| 경주 | `#C5A3FF` | 보라색 |
| 강릉 | `#6BCFFF` | 바다 청색 |
| 제주 | `#FF8C42` | 화산 주황 |
| 전주 | `#98D8C8` | 민트색 |
| 부여 | `#E8B4B8` | 장미색 |

---

## 🔧 이미지 활성화 방법

### script.js 파일 수정

파일 상단의 `CONFIG` 객체에서 설정 변경:

```javascript
const CONFIG = {
    // 한반도 지도 이미지 사용 여부
    useKoreaMapImage: true,  // 이미지 준비되면 true로 변경

    // 별자리 이미지 사용 여부
    useConstellationImages: true,  // 이미지 준비되면 true로 변경

    // 천상열차 이미지 사용 여부
    useCheonsangImage: true,  // 이미지 준비되면 true로 변경

    enableParticles: true,
    enableAdvancedEffects: true
};
```

> **통합 완료**: 이제 `index.html`, `script.js`, `styles.css` 파일만 사용하면 됩니다!

### 부분 적용도 가능!

모든 이미지를 한 번에 준비할 필요 없습니다:

```javascript
// 예: 한반도 지도만 이미지 사용
const CONFIG = {
    useKoreaMapImage: true,        // ✅ 지도는 이미지
    useConstellationImages: false, // ❌ 별자리는 SVG
    useCheonsangImage: false,      // ❌ 완료 화면은 CSS
    // ...
};
```

---

## 🎨 빠른 시작: 무료 리소스

### 1. 한반도 지도
- **Google Images**: "korea map outline transparent"
- **Flaticon**: 무료 지도 아이콘
- **Vecteezy**: 무료 벡터 지도

### 2. 별자리/별 이미지
- **Unsplash**: "stars", "constellation" 검색
- **Pexels**: 무료 우주 사진
- **NASA Image Library**: 실제 천문 사진

### 3. 천상열차분야지도
- **국립중앙박물관**: 공식 고해상도 이미지
- **문화재청**: 문화유산 이미지
- **Google Arts & Culture**: 한국 전통 예술

---

## 🖼️ 이미지 최적화 팁

### 파일 크기 줄이기
```bash
# ImageMagick 사용 (PNG 압축)
magick convert input.png -quality 85 -strip output.png

# TinyPNG 온라인 도구
https://tinypng.com
```

### 적절한 해상도
- **지도**: 1200×1600px (최대 500KB)
- **별자리**: 600×400px (최대 200KB)
- **천상열차**: 1920×1080px (최대 1MB)

### 브라우저 캐싱
이미지는 자동으로 캐시되므로, 한 번 로드되면 빠릅니다.

---

## ⚠️ 주의사항

### 저작권
- 상업적 사용 시 반드시 라이선스 확인
- 공공누리 표시 이미지는 출처 명시
- AI 생성 이미지도 서비스 약관 확인

### 폴백(Fallback)
이미지가 없어도 **자동으로 SVG/CSS로 대체**되므로 걱정 마세요!

```javascript
// 이미지 로드 실패 시 자동으로 SVG 사용
mapImage.onerror = () => {
    console.warn('Image not found, using SVG fallback');
    useSVGInstead();
};
```

---

## 🚀 빠른 테스트

이미지 추가 없이 바로 실행하려면:

```javascript
// 모두 false로 설정 (기본값)
const CONFIG = {
    useKoreaMapImage: false,
    useConstellationImages: false,
    useCheonsangImage: false,
    // ...
};
```

이 경우 원래 버전과 동일하게 SVG/CSS로 렌더링됩니다!

---

## 📞 문제 해결

### 이미지가 안 보여요
1. 파일 경로 확인: `assets/images/korea-map.png`
2. 파일명 대소문자 확인 (리눅스는 구분!)
3. 브라우저 콘솔(F12) 에서 404 에러 확인
4. `CONFIG` 설정 확인

### 이미지가 깨져요
1. 파일 형식 확인 (PNG/JPG)
2. 파일 크기 확인 (너무 크면 로딩 실패)
3. 이미지 손상 여부 확인 (다른 뷰어로 열어보기)

---

**이미지 없이도 충분히 아름답습니다!** 🌟

시간이 되면 천천히 이미지를 추가해보세요. 부분적으로 적용해도 멋진 효과를 볼 수 있습니다.
