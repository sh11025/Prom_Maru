/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { PromptForm } from './components/PromptForm';
import { QuestionView } from './components/QuestionView';
import { DraftResultView } from './components/DraftResultView';
import { FrameworkGuideModal } from './components/FrameworkGuideModal';
import { HistoryDrawer } from './components/HistoryDrawer';
import { PartialEditModal } from './components/PartialEditModal';
import { SimulationModal } from './components/SimulationModal';
import { SettingsModal } from './components/SettingsModal';
import { TemplatesModal } from './components/TemplatesModal';
import { HeroIllustration } from './components/HeroIllustration';
import {
  ResultCategory,
  PromMaruResponse,
  PromptHistoryItem,
  EditTarget,
} from './types/prompt';
import { AlertCircle, RotateCcw, LayoutTemplate, Search } from 'lucide-react';
import { TARGET_AIS } from './constants/presets';
import { PromptTemplate } from './constants/templates';

const STORAGE_KEY = 'prom_maru_history_v1';
const USER_KEY_STORAGE = 'prom_maru_user_gemini_key';

export default function App() {
  // Input parameters (Preserved across "새 프롬프트")
  const [resultLanguage, setResultLanguage] = useState<string>('한국어');
  const [resultCategory, setResultCategory] = useState<ResultCategory>('document');
  const [resultType, setResultType] = useState<string>('블로그 글');
  const [targetAi, setTargetAi] = useState<string>('auto');
  const [userTopic, setUserTopic] = useState<string>('');

  // User Gemini API Key (Direct input per user)
  const [userApiKey, setUserApiKey] = useState<string>(() => {
    try {
      return localStorage.getItem(USER_KEY_STORAGE) || '';
    } catch {
      return '';
    }
  });
  const [isKeyConnected, setIsKeyConnected] = useState<boolean>(false);

  // Generation & Conversation State
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [response, setResponse] = useState<PromMaruResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [conversationContext, setConversationContext] = useState<any[]>([]);

  // Function reference for "다시 시도" (Retry)
  const lastActionRef = useRef<(() => Promise<void>) | null>(null);

  // History state
  const [history, setHistory] = useState<PromptHistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isCurrentSaved, setIsCurrentSaved] = useState<boolean>(false);

  // Modals state
  const [isTemplatesOpen, setIsTemplatesOpen] = useState<boolean>(false);
  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [isSimulationOpen, setIsSimulationOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [partialEditState, setPartialEditState] = useState<{
    isOpen: boolean;
    target: EditTarget;
  }>({
    isOpen: false,
    target: 'Context',
  });

  // Check initial connection on mount if key exists in localStorage
  useEffect(() => {
    const key = localStorage.getItem(USER_KEY_STORAGE) || '';
    if (key.trim()) {
      handleTestConnection(key.trim()).then((res) => {
        setIsKeyConnected(res.connected);
      });
    } else {
      setIsKeyConnected(false);
    }
  }, []);

  // Save history to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    } catch (e) {
      console.error('Failed to save history to localStorage', e);
    }
  }, [history]);

  // Handle saving API Key to state and localStorage
  const handleSaveKey = (newKey: string) => {
    setUserApiKey(newKey);
    try {
      localStorage.setItem(USER_KEY_STORAGE, newKey);
    } catch (e) {
      console.error('Failed to save API key to localStorage', e);
    }
  };

  // Handle deleting API Key
  const handleDeleteKey = () => {
    setUserApiKey('');
    setIsKeyConnected(false);
    try {
      localStorage.removeItem(USER_KEY_STORAGE);
    } catch (e) {
      console.error('Failed to remove API key from localStorage', e);
    }
  };

  // Check Gemini Connection with the user-provided key
  const handleTestConnection = async (
    keyToTest: string
  ): Promise<{ connected: boolean; message: string }> => {
    try {
      const res = await fetch('/api/gemini/test-connection', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-gemini-api-key': keyToTest.trim(),
        },
        body: JSON.stringify({ apiKey: keyToTest.trim() }),
      });
      const data = await res.json();
      const connected = !!data.connected;
      setIsKeyConnected(connected);
      if (connected) {
        handleSaveKey(keyToTest.trim());
      }
      return {
        connected,
        message: connected ? 'Gemini 연결됨' : data.message || 'API Key를 확인해주세요.',
      };
    } catch {
      setIsKeyConnected(false);
      return {
        connected: false,
        message: 'API Key를 확인해주세요.',
      };
    }
  };

  // Helper to build headers with user API key
  const getAuthHeaders = (): Record<string, string> => {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (userApiKey && userApiKey.trim()) {
      headers['x-gemini-api-key'] = userApiKey.trim();
    }
    return headers;
  };

  // Primary prompt generation (Initial step)
  const handleGenerate = async (params: {
    result_language: string;
    result_category: ResultCategory;
    result_type: string;
    target_ai: string;
    user_topic: string;
  }) => {
    if (!userApiKey || !userApiKey.trim()) {
      setIsSettingsOpen(true);
      setError('Gemini API Key를 먼저 입력해주세요. 설정 화면에서 직접 등록할 수 있습니다.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setIsCurrentSaved(false);
    setConversationContext([]);

    setResultLanguage(params.result_language);
    setResultCategory(params.result_category);
    setResultType(params.result_type);
    setTargetAi(params.target_ai);
    setUserTopic(params.user_topic);

    const action = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/prom-maru/generate', {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify({
            result_language: params.result_language,
            result_category: params.result_category,
            result_type: params.result_type,
            target_ai: params.target_ai,
            user_topic: params.user_topic,
            apiKey: userApiKey.trim(),
            conversation_context: [],
            edit_mode: 'create',
          }),
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || '프롬프트 생성 중 오류가 발생했습니다.');
        }

        const data: PromMaruResponse = await res.json();
        setResponse(data);
        setIsKeyConnected(true);
      } catch (err: any) {
        console.error('Failed to generate prompt:', err);
        setError(err.message || '요청 처리 중 오류가 발생했습니다. 다시 시도해 주세요.');
      } finally {
        setIsLoading(false);
      }
    };

    lastActionRef.current = action;
    await action();
  };

  // Handle answering questions (Turn 2 onwards)
  const handleSubmitAnswers = async (answersText: string) => {
    if (!userApiKey || !userApiKey.trim()) {
      setIsSettingsOpen(true);
      setError('Gemini API Key를 먼저 입력해주세요. 설정 화면에서 직접 등록할 수 있습니다.');
      return;
    }

    if (!response) return;
    setIsLoading(true);
    setError(null);

    const isRefineAnswer = conversationContext.some((c) => c.isRefine);

    const updatedContext = [
      ...conversationContext,
      {
        questions: response.questions,
        answers: answersText,
      },
    ];
    setConversationContext(updatedContext);

    const action = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/prom-maru/generate', {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify({
            result_language: resultLanguage,
            result_category: resultCategory,
            result_type: resultType,
            target_ai: targetAi,
            user_topic: userTopic,
            apiKey: userApiKey.trim(),
            conversation_context: updatedContext,
            instruction: answersText,
            edit_mode: isRefineAnswer ? 'refine' : 'create',
            current_elements: response.elements,
            current_prompt_en: response.prompt_en,
            current_prompt_ko: response.prompt_ko,
          }),
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || '답변 반영 중 오류가 발생했습니다.');
        }

        const data: PromMaruResponse = await res.json();
        setResponse(data);
        setIsKeyConnected(true);
      } catch (err: any) {
        console.error('Failed to submit answers:', err);
        setError(err.message || '답변 반영 중 오류가 발생했습니다. 다시 시도해 주세요.');
      } finally {
        setIsLoading(false);
      }
    };

    lastActionRef.current = action;
    await action();
  };

  const handleUseDefaults = () => {
    handleSubmitAnswers('가장 널리 통용되는 표준 기본값과 모범 사례를 적용해 즉시 완성해주세요.');
  };

  const handleStartRefine = async () => {
    if (!userApiKey || !userApiKey.trim()) {
      setIsSettingsOpen(true);
      setError('Gemini API Key를 먼저 입력해주세요. 설정 화면에서 직접 등록할 수 있습니다.');
      return;
    }
    if (!response) return;
    setIsLoading(true);
    setError(null);

    const action = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/prom-maru/generate', {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify({
            result_language: resultLanguage,
            result_category: resultCategory,
            result_type: resultType,
            target_ai: targetAi,
            user_topic: userTopic,
            apiKey: userApiKey.trim(),
            current_prompt_en: response.prompt_en,
            current_prompt_ko: response.prompt_ko,
            current_elements: response.elements,
            conversation_context: [...conversationContext, { isRefine: true }],
            edit_mode: 'refine',
            instruction: '',
          }),
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || '프롬프트 분석 및 추가 질문 생성 중 오류가 발생했습니다.');
        }

        const data: PromMaruResponse = await res.json();
        setResponse(data);
        setIsCurrentSaved(false);
        setIsKeyConnected(true);
      } catch (err: any) {
        console.error('Failed to start refine:', err);
        setError(err.message || '프롬프트 다듬기 요청 중 오류가 발생했습니다. 다시 시도해 주세요.');
      } finally {
        setIsLoading(false);
      }
    };

    lastActionRef.current = action;
    await action();
  };

  const handleOpenPartialEdit = (target: EditTarget = 'Context') => {
    if (!userApiKey || !userApiKey.trim()) {
      setIsSettingsOpen(true);
      setError('Gemini API Key를 먼저 입력해주세요. 설정 화면에서 직접 등록할 수 있습니다.');
      return;
    }
    setPartialEditState({
      isOpen: true,
      target: target === 'none' ? 'Context' : target,
    });
  };

  const handleConfirmPartialEdit = async (target: EditTarget, instruction: string) => {
    if (!userApiKey || !userApiKey.trim()) {
      setIsSettingsOpen(true);
      setError('Gemini API Key를 먼저 입력해주세요. 설정 화면에서 직접 등록할 수 있습니다.');
      return;
    }
    if (!response) return;
    setIsLoading(true);
    setError(null);

    const action = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/prom-maru/generate', {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify({
            result_language: resultLanguage,
            result_category: resultCategory,
            result_type: resultType,
            target_ai: targetAi,
            user_topic: userTopic,
            apiKey: userApiKey.trim(),
            current_prompt_en: response.prompt_en,
            current_prompt_ko: response.prompt_ko,
            current_elements: response.elements,
            conversation_context: conversationContext,
            edit_mode: 'partial',
            edit_target: target,
            instruction,
          }),
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || '요소 수정 중 오류가 발생했습니다.');
        }

        const data: PromMaruResponse = await res.json();
        setResponse(data);
        setPartialEditState({ isOpen: false, target: 'Context' });
        setIsCurrentSaved(false);
        setIsKeyConnected(true);
      } catch (err: any) {
        console.error('Failed partial edit:', err);
        setError(err.message || '요소 수정 중 오류가 발생했습니다. 다시 시도해 주세요.');
      } finally {
        setIsLoading(false);
      }
    };

    lastActionRef.current = action;
    await action();
  };

  const handleNewPrompt = () => {
    setUserTopic('');
    setResponse(null);
    setError(null);
    setConversationContext([]);
    setIsCurrentSaved(false);
    lastActionRef.current = null;
  };

  const handleSaveToHistory = () => {
    if (!response || !response.prompt_en) return;
    if (isCurrentSaved) return;

    const newItem: PromptHistoryItem = {
      id: `pm_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      createdAt: Date.now(),
      category: resultCategory,
      resultType,
      targetAi,
      resultLanguage,
      topic: userTopic,
      promptEn: response.prompt_en,
      promptKo: response.prompt_ko,
      reviewStatus: response.review_status,
      review: response.review || '',
      elements: response.elements,
    };

    setHistory((prev) => [newItem, ...prev]);
    setIsCurrentSaved(true);
  };

  const handleLoadHistoryItem = (item: PromptHistoryItem) => {
    setResultCategory(item.category);
    setTargetAi(item.targetAi);
    setUserTopic(item.topic);
    setResponse({
      status: 'draft',
      questions: [],
      prompt_en: item.promptEn,
      prompt_ko: item.promptKo,
      review_status: item.reviewStatus,
      review: '히스토리에서 불러온 프롬프트입니다.',
      elements: item.elements,
    });
    setIsCurrentSaved(true);
    setIsHistoryOpen(false);
  };

  const handleDeleteHistoryItem = (id: string) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearAllHistory = () => {
    if (window.confirm('저장된 모든 프롬프트 기록을 삭제하시겠습니까?')) {
      setHistory([]);
    }
  };

  const handleSelectTemplate = (template: PromptTemplate) => {
    setResultCategory(template.category);
    setResultType(template.resultType);
    setTargetAi(template.targetAi);
    setUserTopic(template.starterTopic);
    setIsTemplatesOpen(false);
  };

  const targetAiObj = TARGET_AIS.find((ai) => ai.id === targetAi) || {
    id: targetAi,
    name: targetAi,
    category: 'all',
    description: '',
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-stone-900 flex flex-col font-sans selection:bg-violet-100 selection:text-violet-900">
      {/* Header */}
      <Header
        onOpenGuide={() => setIsGuideOpen(true)}
        onOpenTemplates={() => setIsTemplatesOpen(true)}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onReset={handleNewPrompt}
        historyCount={history.length}
        hasApiKey={isKeyConnected || !!userApiKey.trim()}
      />

      {/* Main Content Area (Max width 1200px on desktop, comfortable margins on mobile) */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-3.5 sm:py-6 lg:py-8 space-y-4 sm:space-y-6 lg:space-y-7 overflow-x-hidden">
        {/* Rich 2-Column Hero Section with Custom Visual Asset */}
        {!response && (
          <div className="relative pt-1 sm:pt-3 pb-0.5 sm:pb-2">
            {/* Ambient subtle background glows: Lavender & Peach */}
            <div className="absolute top-1/2 left-10 -translate-y-1/2 w-64 sm:w-96 h-64 sm:h-96 bg-violet-200/20 rounded-full blur-3xl pointer-events-none -z-10" />
            <div className="absolute top-1/3 right-10 w-56 sm:w-80 h-56 sm:h-80 bg-[#FFE4DC]/35 rounded-full blur-3xl pointer-events-none -z-10" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-6 lg:gap-8 items-center">
              {/* Left Column: Hero Copy (approx 60%) */}
              <div className="lg:col-span-7 space-y-2 sm:space-y-3 lg:space-y-3.5 text-center lg:text-left">
                {/* Coral Accent Badge matching reference */}
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#FFF9F6] text-[#FB7185] border border-[#FECDD3] text-[11px] sm:text-xs font-semibold shadow-2xs">
                  <span>✨</span>
                  <span>한국어 아이디어를 글로벌 결과물로</span>
                </div>

                {/* Hero Title with natural semantic line breaks */}
                <h1 className="text-xl sm:text-3xl lg:text-[38px] font-extrabold tracking-tight text-[#1F2937] leading-[1.3] sm:leading-[1.25] break-keep">
                  <span className="block">한국어로 적으면,</span>
                  <span className="block">최고의 <span className="text-[#7C3AED]">영문 프롬프트</span>로</span>
                  <span className="block">완성합니다</span>
                </h1>

                {/* Hero Description */}
                <p className="text-[11.5px] sm:text-sm text-[#4B5563] leading-relaxed max-w-xl mx-auto lg:mx-0">
                  ChatGPT, Claude, Gemini부터 Midjourney, Sora까지<br className="hidden sm:inline" />
                  어떤 AI를 사용하든, 원하는 결과를 얻을 수 있는 정확하고 효과적인 영문 프롬프트를 만들어드립니다.
                </p>

                {/* Hero Action Buttons: Compact side-by-side on mobile */}
                <div className="pt-0.5 sm:pt-1.5 flex flex-row flex-wrap items-center justify-center lg:justify-start gap-2">
                  {/* Secondary Button: Soft Peach + Coral */}
                  <button
                    type="button"
                    onClick={() => setIsTemplatesOpen(true)}
                    className="inline-flex items-center justify-center gap-1.5 px-3.5 sm:px-4.5 py-2 sm:py-2.5 rounded-2xl bg-[#FFF9F6] hover:bg-[#FFF1F2] text-[#FB7185] border border-[#FECDD3] text-xs sm:text-sm font-semibold transition-all cursor-pointer shadow-2xs min-h-[38px] sm:min-h-[42px]"
                  >
                    <LayoutTemplate className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#FB7185]" />
                    <span>추천 템플릿 둘러보기</span>
                  </button>

                  {/* Ghost Button: White with warm gray border */}
                  <button
                    type="button"
                    onClick={() => setIsGuideOpen(true)}
                    className="inline-flex items-center justify-center gap-1.5 px-3.5 sm:px-4.5 py-2 sm:py-2.5 rounded-2xl bg-white hover:bg-stone-50 text-[#4B5563] border border-[#E5E7EB] text-xs sm:text-sm font-medium transition-all cursor-pointer shadow-2xs min-h-[38px] sm:min-h-[42px]"
                  >
                    <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#6B7280]" />
                    <span>5요소 가이드</span>
                  </button>
                </div>
              </div>

              {/* Right Column: AI Visual Asset (compact on mobile, prominent on desktop) */}
              <div className="lg:col-span-5 flex justify-center lg:justify-end py-1 sm:py-0">
                <HeroIllustration className="w-full max-w-[190px] sm:max-w-[270px] lg:max-w-[420px]" />
              </div>
            </div>
          </div>
        )}

        {/* Global Error Banner */}
        {error && (
          <div className="p-3.5 sm:p-4 rounded-2xl bg-[#FFF1F2] border border-[#FECDD3] text-xs sm:text-sm text-[#E11D48] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-in fade-in duration-200">
            <div className="flex items-start gap-2.5 sm:gap-3">
              <AlertCircle className="w-5 h-5 text-[#FB7185] shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <p className="font-bold text-[#9F1239]">안내:</p>
                <p className="text-[#BE123C]">{error}</p>
              </div>
            </div>

            {lastActionRef.current && (
              <button
                type="button"
                onClick={() => {
                  if (!userApiKey || !userApiKey.trim()) {
                    setIsSettingsOpen(true);
                    return;
                  }
                  lastActionRef.current && lastActionRef.current();
                }}
                disabled={isLoading}
                className="w-full sm:w-auto px-4 py-2 bg-[#FB7185] hover:bg-[#F43F5E] text-white rounded-xl font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 self-end sm:self-center shrink-0 cursor-pointer shadow-xs min-h-[38px]"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>다시 시도</span>
              </button>
            )}
          </div>
        )}

        {/* Layout: Input Form & Output Workbench */}
        <div className="space-y-4 sm:space-y-6">
          {/* Main White Card: Workbench matching reference image */}
          <div className="bg-white border border-[#E5E7EB] rounded-3xl p-4 sm:p-7 lg:p-8 shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3.5 mb-4 sm:pb-4 sm:mb-5 border-b border-[#F3F4F6] gap-2.5">
              <div>
                <h2 className="font-extrabold text-[#1F2937] text-base sm:text-xl tracking-tight">
                  무엇을 만들고 싶으세요?
                </h2>
                <p className="text-[11.5px] sm:text-xs text-[#6B7280] mt-0.5">
                  원하는 결과물을 선택하고, 어떤 내용을 만들고 싶은지 자유롭게 설명해주세요.
                </p>
              </div>
              <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
                <button
                  type="button"
                  onClick={() => setIsTemplatesOpen(true)}
                  className="text-xs text-[#FB7185] hover:text-[#E11D48] flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FFF9F6] hover:bg-[#FFF1F2] border border-[#FECDD3] transition-colors cursor-pointer font-semibold min-h-[34px] sm:min-h-[36px]"
                  title="8대 카테고리 추천 템플릿 불러오기"
                >
                  <LayoutTemplate className="w-3.5 h-3.5 text-[#FB7185]" />
                  <span>추천 템플릿</span>
                </button>
                {response && (
                  <button
                    type="button"
                    onClick={handleNewPrompt}
                    className="text-xs text-[#6B7280] hover:text-[#1F2937] flex items-center gap-1 px-2.5 py-1.5 rounded-lg hover:bg-stone-100 transition-colors cursor-pointer font-medium min-h-[34px] sm:min-h-[36px]"
                    title="새 프롬프트 작성"
                  >
                    <span>새 프롬프트</span>
                  </button>
                )}
              </div>
            </div>

            <PromptForm
              onSubmit={handleGenerate}
              isLoading={isLoading}
              initialTopic={userTopic}
              initialCategory={resultCategory}
              initialResultType={resultType}
              initialTargetAi={targetAi}
              initialLanguage={resultLanguage}
            />
          </div>

          {/* Workbench: Questions or Draft */}
          {response && (
            <div className="pt-1">
              {response.status === 'question' ? (
                <QuestionView
                  response={response}
                  onSubmitAnswers={handleSubmitAnswers}
                  onUseDefaults={handleUseDefaults}
                  isLoading={isLoading}
                />
              ) : (
                <DraftResultView
                  response={response}
                  targetAiId={targetAi}
                  resultCategory={resultCategory}
                  resultLanguage={resultLanguage}
                  onRefine={handleStartRefine}
                  onPartialEdit={handleOpenPartialEdit}
                  onNewPrompt={handleNewPrompt}
                  onSaveToHistory={handleSaveToHistory}
                  onSimulate={() => setIsSimulationOpen(true)}
                  isSaved={isCurrentSaved}
                />
              )}
            </div>
          )}
        </div>
      </main>

      {/* Footer: Compact and subtle */}
      <footer className="border-t border-stone-200/70 bg-white/60 py-3 sm:py-5 text-center text-xs text-stone-500">
        <p className="font-semibold text-stone-700 text-xs sm:text-sm">Prom_Maru (프롬마루)</p>
        <p className="text-[10px] sm:text-[11px] text-stone-400 mt-0.5">
          한국어 사용자를 위한 AI 프롬프트 아키텍트 • Context • Role • Audience • Format • Task
        </p>
      </footer>

      {/* Modals & Drawers */}
      <FrameworkGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />

      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onLoadItem={handleLoadHistoryItem}
        onDeleteItem={handleDeleteHistoryItem}
        onClearAll={handleClearAllHistory}
      />

      <SimulationModal
        isOpen={isSimulationOpen}
        onClose={() => setIsSimulationOpen(false)}
        promptEn={response?.prompt_en || ''}
        targetAiName={targetAiObj.name}
        apiKey={userApiKey}
      />

      <PartialEditModal
        isOpen={partialEditState.isOpen}
        onClose={() => setPartialEditState({ isOpen: false, target: 'Context' })}
        target={partialEditState.target}
        elements={
          response?.elements || {
            context: '',
            role: '',
            audience: '',
            format: '',
            task: '',
          }
        }
        onConfirmEdit={handleConfirmPartialEdit}
        isLoading={isLoading}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        apiKey={userApiKey}
        onSaveKey={handleSaveKey}
        onDeleteKey={handleDeleteKey}
        isConnected={isKeyConnected}
        onTestConnection={handleTestConnection}
      />

      <TemplatesModal
        isOpen={isTemplatesOpen}
        onClose={() => setIsTemplatesOpen(false)}
        onSelectTemplate={handleSelectTemplate}
      />
    </div>
  );
}
