# Audio Assets Guide

이 폴더에는 웹 경험에 필요한 모든 오디오 파일이 들어갑니다.

## 폴더 구조

```
audio/
├── ambient/        # 배경 사운드 (루프)
├── interaction/    # 인터랙션 효과음
├── narration/      # 지역 스토리 음성 해설
└── completion/     # 완료 음악
```

## 필요한 파일 목록

### ambient/ (배경 사운드)
- `night_wind_loop.mp3` - 90초 루프, 밤바람 소리 (-28dB)
- `harp_harmonics_loop.mp3` - 45초 루프, 하프 화음 (-30dB)

### interaction/ (효과음)
- `hover_shimmer.mp3` - 200ms, 윈드차임 소리 (-20dB)
- `click_ting.mp3` - 800ms, 크리스탈 + 하프 글리산도 (-18dB)
- `modal_open.mp3` - 400ms, 우쉬 + 벨 소리 (-22dB)
- `modal_close.mp3` - 300ms, 역재생 우쉬 (-24dB)

### narration/ (음성 해설)
각 지역의 스토리 음성 해설 (9-14초, -12dB):
- `gwangmyeong_story.mp3` - 광명시 (12초)
- `gaeseong_story.mp3` - 개성 (10초)
- `hanyang_story.mp3` - 한양 (14초)
- `gyeongju_story.mp3` - 경주 (13초)
- `gangneung_story.mp3` - 강릉 (11초)
- `jeju_story.mp3` - 제주 (10초)
- `jeonju_story.mp3` - 전주 (9초)
- `buyeo_story.mp3` - 부여 (11초)

### completion/ (완료 음악)
- `orchestral_swell.mp3` - 오케스트라 스웰 (8초, -15dB)
- `completion_message.mp3` - 완료 메시지 음성 (선택)

## 음성 해설 스크립트

각 지역별 음성 해설 텍스트는 `data.json`의 `story_text_lines` 필드를 참조하세요.

## 제작 가이드

### 음성 해설
- **포맷**: MP3, 128kbps 이상
- **목소리**: 따뜻하고 차분한 여성 목소리
- **속도**: 120-140 단어/분
- **후처리**: 리버브 (0.8초 decay), 2-4kHz EQ 부스트
- **노이즈**: 최소화

### 효과음
- **포맷**: MP3, 128kbps
- **길이**: 짧고 간결하게 (1초 이내)
- **음량**: 각 파일별 권장 dB 참고

### 배경음
- **루프**: 끊김 없이 자연스럽게 반복되어야 함
- **음량**: 낮게 유지 (배경에 머물러야 함)

## 임시 대체 방안

오디오 파일이 없어도 웹사이트는 정상 작동합니다:
- 음성 해설 없이 텍스트만 표시됨
- 효과음 없이 조용한 인터랙션
- 배경음 없이 시각적 경험만 제공

## 무료 음원 리소스

음악/효과음 제작이 어려운 경우 다음 사이트를 참고하세요:
- **Freesound.org** - 효과음
- **incompetech.com** - 배경 음악
- **AIVA.ai** - AI 음악 생성
- **Google TTS / Azure TTS** - 음성 합성

---

**참고**: 상업적 사용 시 라이선스 확인 필수!
