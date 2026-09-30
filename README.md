# Prom_Maru (프롬마루)

> **한국어 사용자를 위한 생성형 AI 프롬프트 아키텍트**  
> 한국어로 원하는 결과물을 편하게 설명하면 필요한 정보만 추가로 질문하고, 선택한 목표 결과물과 대상 AI에 맞게 최적화된 영문 프롬프트와 충실한 전체 한국어 번역을 제공하는 스마트 프롬프트 빌더입니다.

---

## 📌 프로젝트 소개

생성형 AI 모델(ChatGPT, Claude, Gemini, Midjourney, Veo, Sora, Suno 등)은 상세하고 정교한 지시사항을 영문으로 입력했을 때 가장 뛰어난 성능을 발휘합니다. 하지만 많은 사용자가 매번 영어로 복잡한 프롬프트 구조를 작성하는 데 어려움을 겪습니다.

**Prom_Maru(프롬마루)**는 사용자가 일상적인 한국어로 대략적인 아이디어나 요구사항을 입력하더라도, **5대 핵심 프레임워크(Context, Role, Audience, Format, Task)**를 기반으로 분석하여 결측 요소를 보완하고 대상 AI 엔진 특성에 특화된 **최종 영문 프롬프트와 1:1 완역 한국어본**을 완성해 줍니다.

---

## ✨ 주요 기능

1. **8대 목표 결과물 카테고리 지원**
   - 문서, 이미지, 프레젠테이션, 비디오, 오디오, 코드, 데이터, 기타 등 용도별 세분화된 프리셋 제공.
2. **대상 AI 엔진 맞춤 최적화**
   - ChatGPT, Claude, Midjourney, Veo, Sora, Kling, Suno, Cursor 등 대상 AI의 문법과 파라미터 규칙에 맞춤 설계.
3. **영문 프롬프트 최우선 표시 & 전체 한국어 완역**
   - 대상 AI에 그대로 붙여넣을 수 있는 **[ English Prompt ]**를 최우선으로 배치하고, 검토를 돕는 **[ 한국어 번역 ]**을 누락 없이 제공.
4. **5대 핵심 요소 (C-R-A-F-T) 자동 분석**
   - **Context(맥락)**, **Role(역할)**, **Audience(대상)**, **Format(형식)**, **Task(작업)**으로 프롬프트를 해체 분석하여 제공.
5. **추천 템플릿 (Starter)**
   - 8개 카테고리별 실용적인 32개 대표 템플릿을 통해 클릭 한 번으로 파라미터 자동 설정.
6. **더 다듬기 & 5요소 부분 수정**
   - AI가 추가 유도 질문을 제시하여 프롬프트를 고도화하는 **[ 더 다듬기 ]**, 특정 요소만 정밀 교정하는 **[ 부분 수정 ]**.
7. **프라이빗 브라우저 로컬 히스토리**
   - 별도 회원가입이나 서버 동기화 없이, 브라우저 `localStorage`에만 안전하게 보관되는 히스토리 관리.
8. **BYOK (Bring Your Own Key) 보안 아키텍처**
   - 사용자가 직접 본인의 Google Gemini API Key를 입력하여 독립적으로 실행.

---

## 📂 지원 결과물 8개 카테고리

| 카테고리 | 대표 세부 결과물 | 추천 대상 AI |
|---|---|---|
| **문서 / 텍스트** | 업무 보고서, 기획서/제안서, 마케팅 카피, 블로그 글 등 | ChatGPT, Claude, Gemini |
| **이미지 / 디자인** | 실사 제품 사진, SNS 광고 그래픽, 일러스트, 캐릭터 디자인 등 | Midjourney, Imagen 3, Stable Diffusion |
| **프레젠테이션** | 스타트업 피치덱, 제안 발표 슬라이드, 워크숍 교안 등 | ChatGPT, Claude, Gamma |
| **비디오 / 영상** | 제품 홍보 광고 영상, 쇼츠/릴스, 시네마틱 트레일러 등 | Veo, Sora, Runway, Kling |
| **오디오 / 보이스** | 광고/오디오북 내레이션, 팟캐스트 인트로, BGM, 완전한 곡 작곡 | Suno, Udio, ElevenLabs |
| **코드 / 개발** | 프론트엔드 UI 컴포넌트, 백엔드 API, 알고리즘 유틸리티, DB 스키마 | Cursor, Claude, ChatGPT |
| **데이터 / 분석** | A/B 테스트 분석, KPI 대시보드 설계, 고객 코호트 리텐션 진단 | ChatGPT, Claude |
| **기타 / 커스텀** | 브랜드 네이밍, 심층 인터뷰 질문지, 노코드 자동화 워크플로 등 | Auto (자동 판별) |

---

## 🎯 대상 AI 최적화

선택한 대상 AI 엔진에 따라 프롬프트의 어조와 문법 규칙이 자동으로 전환됩니다:

- **ChatGPT / Claude**: 논리적인 단계별 사고(Chain-of-thought), 마크다운 구조화, 명확한 제약 조건 및 예시 제시.
- **Midjourney**: 조명(Cinematic lighting), 카메라 화각/렌즈 규격(85mm lens, f/1.8), 화면비(--ar 16:9), 스타일 가중치.
- **Veo / Sora / Runway / Kling**: 시간적 흐름, 카메라 무빙(Pan, Dolly, FPV), 프레임 레이트, 피사체의 물리적 동작.
- **ElevenLabs**: 성우의 발화 톤, 감정 표현, 호흡 주기 및 억양 지침.
- **Suno / Udio**: 음악 장르(Genre), 템포(BPM), 악기 편성 및 [Verse], [Chorus] 메타 태그 구조화.
- **Cursor**: 함수 시그니처, 타입 안정성(TypeScript), 엣지 케이스 처리 및 클린 코드 원칙.

---

## 🧭 5대 프레임워크 (C-R-A-F-T)

Prom_Maru는 프롬프트 엔지니어링의 정수인 5대 요소를 기준으로 작동합니다:

1. **Context (맥락)**: AI가 알아야 할 배경, 비즈니스 상황, 목적, 선행 조건. ⭐ *(가장 중요)*
2. **Task (작업)**: AI가 실제로 완수해야 하는 핵심 수행 지침. ⭐ *(가장 중요)*
3. **Role (역할)**: AI에게 부여할 구체적인 전문가 페르소나 및 관점.
4. **Audience (대상)**: 최종 결과물을 소비하거나 읽을 대상 독자 및 사용자 계층.
5. **Format (형식)**: 출력 구조, 문서 양식, 해상도, 화면 비율, 문체 및 제약조건.

> 💡 **안내**: 사용자가 5가지 요소를 모두 직접 입력할 필요가 없습니다. 핵심 아이디어(Context, Task)만 간단히 적어주셔도 Prom_Maru가 분석하여 나머지 요소를 이상적으로 자동 추론합니다.

---

## 🔒 Gemini API Key (BYOK) 및 보안 안내

- **공용 API Key 미제공**: Prom_Maru는 공용 Gemini API Key를 제공하지 않으며, 각 사용자가 자신의 Google Gemini API Key를 입력하여 사용하는 **BYOK (Bring Your Own Key)** 방식을 적용합니다.
- **서버 DB 미저장**: 입력하신 API Key와 프롬프트 히스토리는 **외부 데이터베이스나 서버 파일에 절대 영구 저장되지 않습니다**.
- **안전한 브라우저 저장**: API Key와 히스토리는 오직 **사용자 본인의 브라우저 `localStorage`**에만 암호화 및 격리 보관되며 다른 기기와 동기화되지 않습니다.
- **상시 삭제 가능**: 상단 [설정] 메뉴에서 언제든지 API Key를 즉시 삭제하거나 새로 등록할 수 있습니다.

### Gemini API Key 발급 방법
1. [Google AI Studio](https://aistudio.google.com/)에 접속하여 로그인합니다.
2. 좌측 상단의 **[Get API key]**를 클릭합니다.
3. **[Create API key]**를 눌러 새 API 키를 생성하고 복사합니다.
4. Prom_Maru 상단 **[설정]** 버튼을 누른 뒤 복사한 API Key를 입력하고 연결 테스트를 완료합니다.

---

## 🛠️ 설치 및 로컬 실행 방법

### 요구 사항
- **Node.js**: v18.0.0 이상
- **npm** 또는 **pnpm** / **yarn** / **bun**

### 1. 저장소 복제 (Clone)
```bash
git clone https://github.com/your-username/prom_maru.git
cd prom_maru
```

### 2. 패키지 설치
```bash
npm install
```

### 3. 환경 변수 설정 (선택 사항)
로컬 개발 시 서버 측 기본 키를 사용하려면 `.env` 파일을 생성합니다:
```bash
cp .env.example .env
```
`.env` 파일에 발급받은 Gemini API 키를 입력합니다 (클라이언트에 직접 키를 입력하는 BYOK 방식 사용 시 생략 가능):
```env
GEMINI_API_KEY="your_actual_gemini_api_key_here"
```

### 4. 로컬 개발 서버 실행
```bash
npm run dev
```
브라우저에서 `http://localhost:3000`으로 접속합니다.

### 5. 프로덕션 빌드 및 실행
```bash
# 1) 프론트엔드 정적 파일 빌드 (dist/ 생성)
npm run build

# 2) 풀스택 서버 실행 (포트 3000)
npm start
```

---

## 🚀 웹 배포 안내 (Deployment)

Prom_Maru는 보안 강화 및 모델 폴백 처리를 위해 **Node.js Express 백엔드(`server.ts`)와 React 프론트엔드가 결합된 풀스택(Full-Stack) 구조**로 설계되어 있습니다.

- **정적 호스팅 (GitHub Pages 등) 불가 사유**:
  GitHub Pages와 같은 순수 정적 웹 호스팅은 백엔드 서버를 구동할 수 없으므로 `/api/prom-maru/generate`, `/api/gemini/test-connection` 등의 API 엔드포인트 요청을 처리할 수 없습니다 (404 오류 발생).
- **추천 배포 플랫폼 (Node.js 런타임 지원)**:
  1. **Google Cloud Run**: 컨테이너 기반으로 확장성과 비용 효율성이 우수한 최적의 배포처.
  2. **Render / Railway / Fly.io**: Git 레포지토리 연결만으로 `npm run build && npm start`를 통해 손쉽게 배포 가능.
  3. **Docker 컨테이너**: Node 20/22 기반 이미지로 패키징하여 원하는 클라우드 인프라에 배포.

---

## 📱 프로젝트 구조

```
prom_maru/
├── index.html                 # HTML 엔트리 포인트
├── metadata.json              # 메타데이터 설정
├── package.json               # 프로젝트 의존성 및 스크립트
├── server.ts                  # Express 백엔드 API & Vite 미들웨어 서버
├── tsconfig.json              # TypeScript 설정
├── vite.config.ts             # Vite 번들러 설정
├── .env.example               # 환경 변수 템플릿
├── .gitignore                 # Git 추적 제외 설정
└── src/
    ├── main.tsx               # React 엔트리 포인트
    ├── App.tsx                # 메인 애플리케이션 및 상태 제어
    ├── index.css              # Tailwind CSS 스타일 정의
    ├── types/
    │   └── prompt.ts          # 프롬프트, 응답, 히스토리 TypeScript 인터페이스
    ├── constants/
    │   ├── presets.ts         # 8대 카테고리, 대상 AI 엔진 목록, 프롬프트 엔지니어링 지침
    │   └── templates.ts       # 8대 카테고리별 32개 추천 템플릿 데이터
    └── components/
        ├── Header.tsx                 # 상단 내비게이션 바
        ├── PromptForm.tsx             # 파라미터 설정 및 프롬프트 입력 폼
        ├── DraftResultView.tsx        # 최종 영문/한국어 프롬프트 뷰어 및 액션 툴바
        ├── QuestionView.tsx           # 모호성 해결을 위한 2~3개 정밀 질문 뷰어
        ├── ElementsBreakdown.tsx      # 5대 핵심 요소(C-R-A-F-T) 분석 카드
        ├── FrameworkGuideModal.tsx    # 5요소 초보자 가이드 도움말 모달
        ├── TemplatesModal.tsx         # 32개 추천 템플릿 검색 및 선택 모달
        ├── RefineModal.tsx            # 프롬프트 추가 고도화 모달
        ├── PartialEditModal.tsx       # 5대 요소별 개별 부분 수정 모달
        ├── HistoryDrawer.tsx          # 브라우저 로컬 히스토리 서랍형 패널
        ├── SettingsModal.tsx          # BYOK Gemini API Key 설정 및 연결 테스트 모달
        └── SimulationModal.tsx        # 생성된 프롬프트 사전 시뮬레이션 모달
```

---

## 📄 라이선스 (License)

이 프로젝트는 [MIT License](LICENSE)에 따라 자유롭게 사용 및 수정이 가능합니다.
