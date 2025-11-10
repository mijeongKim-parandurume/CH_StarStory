# 🔧 Transform Conflict Fix - 완료

## 🎯 문제 상황

Adobe Illustrator에서 내보낸 SVG는 각 레이어에 `transform` 속성을 사용합니다:
```xml
<g id="seoul" transform="matrix(1,0,0,1,150,200)">
<path id="busan" transform="translate(500,800) scale(1.2)">
```

기존 코드가 CSS로 `transform: scale(1.05)`를 적용하면:
- ❌ 원본 transform이 무시됨
- ❌ 모든 영역이 한 곳에 뭉침
- ❌ 블록 모양으로 보임
- ❌ 확대 효과 동작 안 함

## ✅ 해결 방법

### 핵심 원칙
> **CSS transform 절대 사용 금지**
> **SVG transform 속성만 사용**

### 구현된 솔루션

#### 1. 원본 Transform 저장 (processRegions)
```javascript
// CRITICAL: Store original transform attribute
const originalTransform = element.getAttribute('transform') || '';
AppState.originalTransforms.set(id, originalTransform);
```

#### 2. Scale 적용 (applyScaleTransform)
```javascript
function applyScaleTransform(element, regionId, scale) {
    // Get original transform
    const originalTransform = AppState.originalTransforms.get(regionId) || '';

    // Calculate center
    const bbox = element.getBBox();
    const cx = bbox.x + bbox.width / 2;
    const cy = bbox.y + bbox.height / 2;

    // APPEND scale transform (do NOT replace)
    const scaleTransform = ` translate(${cx},${cy}) scale(${scale}) translate(${-cx},${-cy})`;
    element.setAttribute('transform', originalTransform + scaleTransform);
}
```

#### 3. 복원 (restoreOriginalTransform)
```javascript
function restoreOriginalTransform(element, regionId) {
    const originalTransform = AppState.originalTransforms.get(regionId) || '';
    element.setAttribute('transform', originalTransform);
}
```

#### 4. CSS 정리 (styles_map.css)
```css
.region {
    /* CRITICAL: NO CSS transform! */
    transition:
        opacity 0.35s ease,
        fill 0.35s ease,
        filter 0.35s ease;
    /* transform 제거됨 */
}

.region.active {
    /* NO transform here - handled by JS */
    filter: drop-shadow(0 0 6px rgba(255,255,255,0.6));
}
```

## 🔄 변경된 파일

### [app_map.js](app_map.js)
- ✅ `AppState.originalTransforms` 추가
- ✅ `processRegions()`: 원본 transform 저장
- ✅ `applyScaleTransform()`: 새 함수 추가
- ✅ `restoreOriginalTransform()`: 새 함수 추가
- ✅ `selectRegion()`: transform 속성으로 변경
- ✅ `resetSelection()`: 복원 로직 추가

### [styles_map.css](styles_map.css)
- ✅ `.region`: CSS transform 제거
- ✅ `.region.active`: CSS transform 제거
- ✅ `.region.fade`: CSS transform 제거
- ✅ 주석으로 이유 설명 추가

## ✨ 작동 방식

### Before (문제)
```
Illustrator: transform="translate(100,200)"
CSS: .active { transform: scale(1.05) }
→ 결과: CSS가 SVG 속성을 덮어씀
→ 원본 위치 정보 손실 ❌
```

### After (해결)
```
Illustrator: transform="translate(100,200)"
JS: element.setAttribute('transform',
    'translate(100,200) translate(150,250) scale(1.05) translate(-150,-250)')
→ 결과: 원본 transform 보존 + scale 추가
→ 정확한 위치에서 확대 ✅
```

## 🎨 Transform 연산 순서

```javascript
// 1. 원본 (Illustrator)
transform="translate(100,200) rotate(15)"

// 2. 선택 시 (JS가 추가)
transform="translate(100,200) rotate(15) translate(150,250) scale(1.05) translate(-150,-250)"
         ↑──────────────────────────────↑ ↑────────────────────────────────────────────────↑
         원본 보존                        중심 기준 확대

// 3. 해제 시 (JS가 복원)
transform="translate(100,200) rotate(15)"
         ↑──────────────────────────────↑
         원본으로 복원
```

## 📋 테스트 체크리스트

### 기본 동작
- [x] SVG 로드 시 영역이 올바른 위치에 표시
- [x] 클릭 시 해당 영역만 확대 (1.05배)
- [x] 다른 영역은 회색으로 페이드
- [x] 리셋 시 원래 크기/위치로 복원
- [x] 같은 영역 재클릭 시 토글

### Illustrator Export 호환성
- [x] `transform="matrix(...)"` 보존
- [x] `transform="translate(...)"` 보존
- [x] `transform="rotate(...)"` 보존
- [x] `transform="scale(...)"` 보존
- [x] 복합 transform 보존 (예: `translate(...) rotate(...)`)

### 그룹(`<g>`) 처리
- [x] `<g>` 요소의 transform 보존
- [x] `<path>` 요소의 transform 보존
- [x] 중첩 그룹의 transform 보존

### 엣지 케이스
- [x] transform 속성 없는 영역 (빈 문자열 처리)
- [x] viewBox 없는 SVG (자동 추가)
- [x] 매우 작은/큰 영역 (bbox 계산)

## 🚫 금지 사항

### CSS에서 절대 금지
```css
/* ❌ 절대 사용 금지 */
.region {
    transform: scale(1.05);           /* NO */
    transform-origin: center;         /* NO */
    transform-box: fill-box;          /* NO */
}
```

### JS에서 절대 금지
```javascript
// ❌ 절대 사용 금지
element.style.transform = 'scale(1.05)';  // NO
element.classList.add('scaled');          // CSS transform 사용하면 NO
```

## ✅ 올바른 사용법

### JS에서만 transform 제어
```javascript
// ✅ 올바른 방법
element.setAttribute('transform', originalTransform + scaleTransform);
element.getAttribute('transform');
```

### CSS는 fill, opacity, filter만
```css
/* ✅ 올바른 방법 */
.region.fade {
    fill: #bfbfbf !important;
    opacity: 0.5;
    filter: none;
}

.region.active {
    filter: drop-shadow(0 0 6px rgba(255,255,255,0.6));
}
```

## 🎯 성능 최적화

### getBBox() 캐싱 (선택적)
현재는 매번 계산하지만, 필요시 캐싱 가능:
```javascript
const bboxCache = new Map();

function applyScaleTransform(element, regionId, scale) {
    if (!bboxCache.has(regionId)) {
        bboxCache.set(regionId, element.getBBox());
    }
    const bbox = bboxCache.get(regionId);
    // ... rest of code
}
```

### Transform 문자열 최적화
불필요한 공백 제거:
```javascript
const scaleTransform = `translate(${cx},${cy})scale(${scale})translate(${-cx},${-cy})`;
```

## 📚 참고 자료

### SVG Transform 우선순위
1. Inline `transform` 속성 (가장 높음)
2. CSS `transform` (중간)
3. Presentation attributes (가장 낮음)

### Transform 누적
```xml
<!-- 부모와 자식 transform 모두 적용됨 -->
<g transform="translate(100,100)">
    <path transform="rotate(45)" />
</g>
```

### getBBox() vs getBoundingClientRect()
- `getBBox()`: SVG 좌표계 기준 (viewport 변환 전)
- `getBoundingClientRect()`: 화면 좌표계 기준 (viewport 변환 후)
- **우리는 getBBox() 사용** (SVG 내부 좌표 필요)

## 🐛 디버깅 팁

### Console에서 확인
```javascript
// 1. 원본 transform 확인
console.log(window.KoreaMap.state.originalTransforms);

// 2. 현재 transform 확인
document.querySelectorAll('.region').forEach(el => {
    console.log(el.id, el.getAttribute('transform'));
});

// 3. Bbox 확인
document.querySelectorAll('.region').forEach(el => {
    console.log(el.id, el.getBBox());
});
```

### 문제 진단
```javascript
// 모든 영역이 한곳에 뭉쳐있다면
// → CSS transform이 아직 남아있는지 확인
getComputedStyle(document.querySelector('.region')).transform;
// "none"이 나와야 정상

// 확대가 안 된다면
// → SVG transform 속성에 scale이 추가되었는지 확인
document.querySelector('.region.active').getAttribute('transform');
// "... scale(1.05) ..." 포함되어야 함
```

## 🎉 결과

### Before
- ❌ 모든 영역이 겹쳐서 블록처럼 보임
- ❌ 확대 효과 작동 안 함
- ❌ Illustrator export 호환 안 됨

### After
- ✅ 각 영역이 올바른 위치에 표시
- ✅ 선택 시 해당 영역만 정확히 확대
- ✅ Illustrator의 모든 transform 보존
- ✅ 그룹, 경로 모두 정상 작동

---

**핵심 교훈**: SVG에서는 CSS transform 말고 SVG transform 속성을 사용하자! 🎨
