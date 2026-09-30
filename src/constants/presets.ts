import { ResultCategory, TargetAIOption } from '../types/prompt';

export interface CategoryMeta {
  id: ResultCategory;
  nameKo: string;
  nameEn: string;
  iconName: string;
  description: string;
  types: string[];
  placeholderTopic: string;
  sampleTopics: string[];
}

export const CATEGORIES: CategoryMeta[] = [
  {
    id: 'document',
    nameKo: '문서 / 텍스트',
    nameEn: 'Document & Text',
    iconName: 'FileText',
    description: '블로그, 사업계획서, 기획서, 카피라이팅, 이메일, 리포트',
    types: [
      '블로그 글',
      '사업 계획서',
      '마케팅 카피 / 광고 문구',
      '기획서 / 제안서',
      '업무 보고서',
      '뉴스레터',
      '보도자료',
      '소설 / 시나리오',
      '학술 논문 요약',
    ],
    placeholderTopic: '예: B2B 생산성 SaaS 서비스를 소개하고 초기 가입을 유도하는 랜딩페이지 헤드라인과 상세 카피라이팅',
    sampleTopics: [
      '초기 스타트업 투자 유치를 위한 5분 피치 요약 사업계획서',
      '개발자를 위한 최신 생성형 AI 트렌드 기술 블로그 포스팅',
      'MZ세대를 타깃으로 한 비건 화장품 론칭 인스타그램 마케팅 카피',
    ],
  },
  {
    id: 'image',
    nameKo: '이미지 / 디자인',
    nameEn: 'Image & Design',
    iconName: 'Image',
    description: '로고, 일러스트, 실사 렌더링, 콘셉트 아트, UI 목업',
    types: [
      '미니멀 로고 디자인',
      '실사 제품 사진 (Product Shot)',
      '디지털 일러스트레이션',
      '3D 캐릭터 콘셉트 아트',
      '웹 / 앱 UI 목업',
      '유튜브 썸네일 그래픽',
      '패키지 디자인',
      '건축 인테리어 렌더링',
    ],
    placeholderTopic: '예: 자연광이 들어오는 미니멀한 스튜디오에서 촬영된 친환경 유리 세라믹 커피잔 실사 제품 샷',
    sampleTopics: [
      '사이버펑크 서울의 네온 비 오는 골목길 시네마틱 포토그래피',
      '핀테크 스타트업을 위한 모던하고 기하학적인 벡터 심볼 로고',
      '지브리 스튜디오 화풍의 따뜻한 여름 시골 기차역 수채화 일러스트',
    ],
  },
  {
    id: 'presentation',
    nameKo: '프레젠테이션',
    nameEn: 'Presentation',
    iconName: 'LayoutTemplate',
    description: '피치덱, 강의 슬라이드, 프로젝트 기획 발표자료',
    types: [
      '스타트업 피치덱 (10-12장)',
      '신규 프로젝트 제안 슬라이드',
      '교육 / 사내 워크숍 강의자료',
      '분기 실적 성과 보고 발표',
      '학술 콘퍼런스 발표자료',
      '투자 설명회 (IR) 자료',
    ],
    placeholderTopic: '예: 물류 자동화 로봇 스타트업의 시리즈 A 투자 유치용 10장 피치덱 슬라이드별 핵심 메시지와 구성',
    sampleTopics: [
      '신입사원 온보딩을 위한 비즈니스 매너 및 협업 툴 교육 슬라이드',
      '2026 글로벌 AI SaaS 시장 트렌드 분석 임원 보고용 7슬라이드 덱',
    ],
  },
  {
    id: 'video',
    nameKo: '비디오 / 영상',
    nameEn: 'Video Generation',
    iconName: 'Video',
    description: '쇼츠/릴스, 시네마틱 트레일러, 제품 광고, 3D 애니메이션',
    types: [
      '유튜브 쇼츠 / 인스타 릴스 (15~30초)',
      '시네마틱 무비 트레일러',
      '제품 홍보 광고 영상',
      '자연 다큐멘터리 클립',
      '3D 캐릭터 모션 영상',
      '음악 뮤직비디오 비주얼라이저',
    ],
    placeholderTopic: '예: 빗물 젖은 밤거리에서 미래형 스포츠카가 질주하는 역동적인 드론 트래킹 샷 (10초, 4K 시네마틱)',
    sampleTopics: [
      '우주 정거장 창가에서 지구를 내려다보는 우주비행사의 슬로우 줌아웃 샷',
      '신선한 과일이 얼음물에 떨어지며 터지는 초고속 슬로모션 광고 클립',
    ],
  },
  {
    id: 'audio',
    nameKo: '오디오 / 음성 / 음악',
    nameEn: 'Audio & Music',
    iconName: 'Volume2',
    description: '성우 목소리, 팟캐스트 내레이션, BGM 음악 생성',
    types: [
      '내레이션 음성 (Voiceover)',
      '팟캐스트 오프닝 대화',
      '시네마틱 배경음악 (BGM)',
      '로파이(Lo-Fi) 칠 비트',
      '게임 사운드 이펙트 (SFX)',
      'K-POP 스타일 댄스 인스트루멘털',
    ],
    placeholderTopic: '예: 다큐멘터리에 어울리는 신뢰감 있고 차분한 40대 남성 내레이터 톤앤매너와 오디오 지침',
    sampleTopics: [
      '명상과 수면을 위한 어쿠스틱 피아노와 빗소리가 섞인 앰비언트 음악',
      'SF 게임의 우주선 워프 및 레이저 발사 특수 음향 효과 프롬프트',
    ],
  },
  {
    id: 'code',
    nameKo: '코드 / 개발',
    nameEn: 'Code & Development',
    iconName: 'Code',
    description: '풀스택 웹앱, REST API, React 컴포넌트, 버그 디버깅, SQL',
    types: [
      'React / Next.js UI 컴포넌트',
      'Node.js Express REST API 서버',
      'SQL 쿼리 작성 및 성능 최적화',
      '파이썬 데이터 크롤러 / 스크립트',
      '단위 테스트 (Unit Test) 코드 작성',
      '풀스택 CRUD 웹 애플리케이션',
      '알고리즘 및 버그 디버깅',
    ],
    placeholderTopic: '예: TypeScript와 Tailwind CSS를 사용한 드래그 앤 드롭 지원 칸반 보드 React 컴포넌트',
    sampleTopics: [
      'JWT 인증과 Refresh Token rotation이 적용된 Express 미들웨어 및 라우트',
      '대규모 로그 테이블에서 월별 통계를 고속 집계하는 PostgreSQL 인덱스 및 쿼리',
    ],
  },
  {
    id: 'data',
    nameKo: '데이터 / 분석',
    nameEn: 'Data & Analytics',
    iconName: 'BarChart3',
    description: '통계 분석, KPI 대시보드 기획, A/B 테스트 가설 검증',
    types: [
      'A/B 테스트 분석 및 가설 검증',
      'KPI 대시보드 지표 설계',
      '고객 코호트 분석 및 리텐션 진단',
      '시장 점유율 데이터 분석 보고서',
      '머신러닝 특성 엔지니어링 가이드',
    ],
    placeholderTopic: '예: 이커머스 장바구니 이탈률 개선을 위한 결제 페이지 A/B 테스트 설계 및 통계 검정 가이드',
    sampleTopics: [
      'SaaS 비즈니스의 월간 구독자 코호트 및 LTV/CAC 건전성 진단 리포트',
    ],
  },
  {
    id: 'other',
    nameKo: '기타 / 직접 지정',
    nameEn: 'Custom / Other',
    iconName: 'Sparkles',
    description: '다양한 복합 과업 및 특정 용도 커스텀 프롬프트',
    types: [
      '업무 자동화 워크플로 설계',
      '인터뷰 질문지 작성',
      '이벤트 기획 및 프로그램 구성',
      '브랜드 네이밍 및 슬로건 도출',
      '사용자 직접 지정',
    ],
    placeholderTopic: '예: 생성형 AI 도입을 준비 중인 전통 제조업 기업 임원진과의 1:1 심층 인터뷰 질문지',
    sampleTopics: [
      '친환경 모빌리티 스타트업을 위한 직관적이고 기억하기 쉬운 브랜드 네이밍 20선',
    ],
  },
];

export interface AIDefinition {
  id: string;
  name: string;
  description: string;
}

export const AI_DESCRIPTIONS: Record<string, AIDefinition> = {
  auto: {
    id: 'auto',
    name: 'Auto',
    description: '특정 AI를 지정하지 않고 목표 결과물에 맞는 범용 프롬프트를 생성합니다.',
  },
  chatgpt: {
    id: 'chatgpt',
    name: 'ChatGPT',
    description: '명확한 역할, 맥락, 작업 지시와 결과 형식을 중심으로 프롬프트를 구성합니다.',
  },
  claude: {
    id: 'claude',
    name: 'Claude',
    description: '충분한 맥락과 구조화된 지시를 중심으로 프롬프트를 구성합니다.',
  },
  gemini: {
    id: 'gemini',
    name: 'Gemini',
    description: '명확한 작업 지시와 멀티모달 활용을 고려해 프롬프트를 구성합니다.',
  },
  midjourney: {
    id: 'midjourney',
    name: 'Midjourney',
    description: '피사체, 구도, 조명, 색감, 스타일 등 이미지 생성 요소를 중심으로 구성합니다.',
  },
  veo: {
    id: 'veo',
    name: 'Veo',
    description: '장면, 동작, 카메라 움직임, 분위기와 오디오 등 영상 생성 요소를 중심으로 구성합니다.',
  },
  sora: {
    id: 'sora',
    name: 'Sora',
    description: '장면의 흐름, 피사체 움직임, 카메라와 시각적 연속성을 중심으로 구성합니다.',
  },
  google_flow: {
    id: 'google_flow',
    name: 'Google Flow',
    description: '장면 구성과 영상 제작 흐름을 고려해 사용할 수 있는 프롬프트를 구성합니다.',
  },
  higgsfield: {
    id: 'higgsfield',
    name: 'Higgsfield',
    description: '인물과 장면의 움직임, 카메라 연출 등 영상 표현 요소를 중심으로 구성합니다.',
  },
  runway: {
    id: 'runway',
    name: 'Runway',
    description: '영상 장면, 움직임, 카메라 및 스타일 요소를 명확하게 전달하도록 구성합니다.',
  },
  kling: {
    id: 'kling',
    name: 'Kling',
    description: '피사체 움직임과 장면의 시각적 연속성을 고려한 영상 프롬프트를 구성합니다.',
  },
  elevenlabs: {
    id: 'elevenlabs',
    name: 'ElevenLabs',
    description: '생생한 감정, 억양, 호흡과 발화 톤 등 음성 표현 요소를 중심으로 구성합니다.',
  },
  suno: {
    id: 'suno',
    name: 'Suno',
    description: '장르, 악기 편성, 템포, 분위기와 보컬 스타일 등 작곡 요소를 중심으로 구성합니다.',
  },
  udio: {
    id: 'udio',
    name: 'Udio',
    description: '음악 장르, 무드, 구조와 보컬/인스트루멘털 요소를 명확히 구성합니다.',
  },
  github_copilot: {
    id: 'github_copilot',
    name: 'GitHub Copilot',
    description: '명확한 언어, 프레임워크 규격, 타입 및 함수 명세를 중심으로 구성합니다.',
  },
  custom: {
    id: 'custom',
    name: '기타 / 직접 입력',
    description: '사용자가 직접 지정한 도구 또는 특화된 환경에 맞는 프롬프트를 구성합니다.',
  },
};

export const CATEGORY_TARGET_AIS: Record<ResultCategory, string[]> = {
  document: ['auto', 'chatgpt', 'claude', 'gemini', 'custom'],
  image: ['auto', 'midjourney', 'chatgpt', 'gemini', 'custom'],
  presentation: ['auto', 'chatgpt', 'claude', 'gemini', 'custom'],
  video: ['auto', 'veo', 'sora', 'google_flow', 'higgsfield', 'runway', 'kling', 'custom'],
  audio: ['auto', 'elevenlabs', 'suno', 'udio', 'custom'],
  code: ['auto', 'chatgpt', 'claude', 'gemini', 'github_copilot', 'custom'],
  data: ['auto', 'chatgpt', 'claude', 'gemini', 'custom'],
  other: ['auto', 'chatgpt', 'claude', 'gemini', 'custom'],
};

export const TARGET_AIS: TargetAIOption[] = Object.values(AI_DESCRIPTIONS).map((ai) => ({
  id: ai.id,
  name: ai.name,
  category: 'all',
  description: ai.description,
}));

export const RESULT_LANGUAGES = [
  { value: '한국어', label: '한국어', flag: '🇰🇷' },
  { value: 'English', label: 'English', flag: '🇺🇸' },
];

export const CORE_ELEMENTS_INFO = [
  {
    key: 'context',
    name: 'Context (배경 및 맥락)',
    icon: '🏛️',
    description: '배경, 목적, 처한 상황, 제약 조건 및 전제 사항',
    tip: 'AI가 문제의 맥락과 달성하려는 궁극적 목표를 오해하지 않도록 명확한 기준선을 제공합니다.',
  },
  {
    key: 'role',
    name: 'Role (역할 및 전문성)',
    icon: '👤',
    description: '결과물 품질을 극대화할 수 있는 AI의 가상 페르소나 또는 전문 영역',
    tip: '단순한 수식어가 아니라 실제 전문 지식 수준과 판단 기준을 부여할 때만 설정합니다.',
  },
  {
    key: 'audience',
    name: 'Audience (대상 및 독자)',
    icon: '🎯',
    description: '결과물을 소비할 대상, 청중, 독자, 고객 또는 최종 사용자',
    tip: '청중의 지식수준(초보자/전문가)과 감정 상태에 맞추어 톤앤매너를 결정합니다.',
  },
  {
    key: 'format',
    name: 'Format (형식 및 미디어 특성)',
    icon: '📐',
    description: '결과물의 구조, 길이, 레이아웃뿐만 아니라 매체별(비디오/이미지/오디오) 특화 규격',
    tip: '시각/영상 매체라면 해상도, 화면비, 카메라 무빙, 조명 스타일까지 규정합니다.',
  },
  {
    key: 'task',
    name: 'Task (핵심 수행 과업)',
    icon: '⚡',
    description: '타깃 AI가 구체적으로 단계별로 완수해야 할 구체적인 작업 명령',
    tip: '모호함을 없애고 산출해야 할 핵심 항목과 논리적 순서를 일목요연하게 명시합니다.',
  },
];
