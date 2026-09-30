import React, { useState, useEffect } from 'react';
import {
  FileText,
  Image as ImageIcon,
  LayoutTemplate,
  Video,
  Headphones,
  Code2,
  BarChart3,
  Sparkles,
  Bot,
  Globe,
  Lightbulb,
  RotateCw,
} from 'lucide-react';
import {
  CATEGORIES,
  RESULT_LANGUAGES,
  AI_DESCRIPTIONS,
  CATEGORY_TARGET_AIS,
} from '../constants/presets';
import { ResultCategory } from '../types/prompt';

interface PromptFormProps {
  onSubmit: (params: {
    result_language: string;
    result_category: ResultCategory;
    result_type: string;
    target_ai: string;
    user_topic: string;
  }) => void;
  isLoading: boolean;
  initialTopic?: string;
  initialCategory?: ResultCategory;
  initialResultType?: string;
  initialTargetAi?: string;
  initialLanguage?: string;
  onOpenTemplates?: () => void;
}

export const PromptForm: React.FC<PromptFormProps> = ({
  onSubmit,
  isLoading,
  initialTopic = '',
  initialCategory = 'document',
  initialResultType = '블로그 글',
  initialTargetAi = 'auto',
  initialLanguage = '한국어',
}) => {
  const [category, setCategory] = useState<ResultCategory>(initialCategory);
  const [resultType, setResultType] = useState<string>(initialResultType);
  const [targetAi, setTargetAi] = useState<string>(initialTargetAi);
  const [customAiName, setCustomAiName] = useState<string>('');
  const [resultLanguage, setResultLanguage] = useState<string>(initialLanguage);
  const [userTopic, setUserTopic] = useState<string>(initialTopic);
  const [exampleOffset, setExampleOffset] = useState<number>(0);

  // Sync internal state when external props change
  useEffect(() => {
    setCategory(initialCategory);
    setResultType(initialResultType);
    setTargetAi(initialTargetAi);
    setResultLanguage(initialLanguage);
    setUserTopic(initialTopic);
  }, [initialCategory, initialResultType, initialTargetAi, initialLanguage, initialTopic]);

  const currentCategoryMeta = CATEGORIES.find((c) => c.id === category) || CATEGORIES[0];
  const availableAiIds = CATEGORY_TARGET_AIS[category] || CATEGORY_TARGET_AIS.document;
  const selectedAiInfo = AI_DESCRIPTIONS[targetAi] || AI_DESCRIPTIONS.auto;

  const handleCategoryChange = (newCat: ResultCategory) => {
    setCategory(newCat);
    setExampleOffset(0);
    const meta = CATEGORIES.find((c) => c.id === newCat);
    if (meta && meta.types.length > 0) {
      setResultType(meta.types[0]);
    }
    const allowedAis = CATEGORY_TARGET_AIS[newCat] || CATEGORY_TARGET_AIS.document;
    if (!allowedAis.includes(targetAi)) {
      setTargetAi('auto');
    }
  };

  const handleCycleExamples = () => {
    const total = currentCategoryMeta.sampleTopics.length;
    if (total <= 2) return;
    setExampleOffset((prev) => (prev + 2) % total);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userTopic.trim() || isLoading) return;
    const finalTargetAi =
      targetAi === 'custom' && customAiName.trim() ? customAiName.trim() : targetAi;
    onSubmit({
      result_language: resultLanguage,
      result_category: category,
      result_type: resultType,
      target_ai: finalTargetAi,
      user_topic: userTopic.trim(),
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      if (userTopic.trim() && !isLoading) {
        const finalTargetAi =
          targetAi === 'custom' && customAiName.trim() ? customAiName.trim() : targetAi;
        onSubmit({
          result_language: resultLanguage,
          result_category: category,
          result_type: resultType,
          target_ai: finalTargetAi,
          user_topic: userTopic.trim(),
        });
      }
    }
  };

  // Cohesive icon set: Warm Gray unselected, Violet selected (No rainbow colors, No Blue/Cyan)
  const getCategoryIcon = (id: ResultCategory, isSelected: boolean) => {
    const className = isSelected
      ? 'w-5 h-5 text-[#7C3AED] stroke-[2.2]'
      : 'w-5 h-5 text-[#6B7280] group-hover:text-[#7C3AED] stroke-[1.8] transition-colors';

    switch (id) {
      case 'document':
        return <FileText className={className} />;
      case 'image':
        return <ImageIcon className={className} />;
      case 'presentation':
        return <LayoutTemplate className={className} />;
      case 'video':
        return <Video className={className} />;
      case 'audio':
        return <Headphones className={className} />;
      case 'code':
        return <Code2 className={className} />;
      case 'data':
        return <BarChart3 className={className} />;
      case 'other':
      default:
        return <Sparkles className={className} />;
    }
  };

  // Samples for mobile (window of 2 with cycling) vs desktop (all 3)
  const allSamples = currentCategoryMeta.sampleTopics;
  const mobileVisibleSamples = allSamples.length > 2
    ? [allSamples[exampleOffset % allSamples.length], allSamples[(exampleOffset + 1) % allSamples.length]].filter(Boolean)
    : allSamples;

  return (
    <form onSubmit={handleFormSubmit} className="space-y-4 sm:space-y-5 lg:space-y-5.5">
      {/* 
        1. 목표 결과물 (Numbered flow 1)
      */}
      <div className="space-y-1.5 sm:space-y-2">
        <div className="flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-[#7C3AED] text-white text-[11px] font-bold flex items-center justify-center shrink-0">
            1
          </span>
          <label className="text-sm font-bold text-[#1F2937] tracking-tight">
            목표 결과물
          </label>
        </div>

        {/* 8 Categories Grid: Mobile 2 cols, Tablet 4 cols, Desktop 8 cols */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 sm:gap-2.5">
          {CATEGORIES.map((cat) => {
            const isSelected = category === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleCategoryChange(cat.id)}
                className={`group flex flex-col items-center justify-center px-2 py-2.5 sm:p-3 rounded-2xl border text-xs transition-all cursor-pointer min-h-[66px] sm:min-h-[74px] ${
                  isSelected
                    ? 'bg-[#F5F3FF] border-2 border-[#7C3AED] text-[#7C3AED] font-bold shadow-2xs'
                    : 'bg-white border-[#E5E7EB] text-[#4B5563] hover:border-violet-300 hover:text-[#1F2937] hover:bg-stone-50/70'
                }`}
              >
                <div className="mb-1 transition-transform group-hover:scale-105">
                  {getCategoryIcon(cat.id, isSelected)}
                </div>
                {/* Full name without awkward truncation, 2-line clamp allowed */}
                <span className="text-[11.5px] sm:text-[12px] leading-tight text-center break-keep w-full px-0.5">
                  {cat.nameKo.split(' / ')[0]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 
        2. 세부 유형 (Numbered flow 2)
      */}
      <div className="space-y-1.5 sm:space-y-2">
        <div className="flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-[#7C3AED] text-white text-[11px] font-bold flex items-center justify-center shrink-0">
            2
          </span>
          <label className="text-sm font-bold text-[#1F2937] tracking-tight">
            세부 유형
          </label>
        </div>

        {/* Sub-type chips: Selected violet, Unselected white with light border */}
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          {currentCategoryMeta.types.map((t) => {
            const isSelected = resultType === t;
            return (
              <button
                key={t}
                type="button"
                onClick={() => setResultType(t)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer min-h-[32px] sm:min-h-[34px] flex items-center justify-center ${
                  isSelected
                    ? 'bg-[#7C3AED] text-white shadow-2xs font-semibold'
                    : 'bg-white text-[#374151] hover:bg-stone-50 border border-[#E5E7EB] hover:border-stone-300'
                }`}
              >
                {t}
              </button>
            );
          })}
        </div>

        {/* Custom type input */}
        <input
          type="text"
          value={resultType}
          onChange={(e) => setResultType(e.target.value)}
          placeholder="직접 세부 유형 입력 (예: 기술 블로그 글, IR 투자설명서 등)"
          className="w-full px-3.5 py-2 text-xs sm:text-sm bg-white border border-[#E5E7EB] rounded-xl text-[#1F2937] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#7C3AED] focus:ring-1 focus:ring-[#7C3AED]/20"
        />
      </div>

      {/* 
        3 & 4. 대상 AI & 결과 언어 (Numbered flow 3 & 4 - Desktop Same Row!)
      */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 lg:gap-6 items-start">
        {/* 대상 AI (approx 60%) */}
        <div className="lg:col-span-7 space-y-1.5 sm:space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-[#7C3AED] text-white text-[11px] font-bold flex items-center justify-center shrink-0">
              3
            </span>
            <label className="text-sm font-bold text-[#1F2937] tracking-tight">
              대상 AI
            </label>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <div className="w-full sm:w-[190px] shrink-0 relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#7C3AED]">
                <Bot className="w-4 h-4" />
              </div>
              <select
                value={targetAi}
                onChange={(e) => setTargetAi(e.target.value)}
                className="w-full pl-8.5 pr-8 py-2 text-xs sm:text-sm bg-white border border-[#E5E7EB] rounded-xl text-[#1F2937] focus:outline-none focus:border-[#7C3AED] focus:ring-1 focus:ring-[#7C3AED]/20 font-medium cursor-pointer min-h-[38px] sm:min-h-[42px]"
              >
                {availableAiIds.map((aiId) => {
                  const ai = AI_DESCRIPTIONS[aiId] || { name: aiId };
                  return (
                    <option key={aiId} value={aiId}>
                      {ai.name}
                    </option>
                  );
                })}
              </select>
            </div>

            {/* AI helper text beside selector */}
            <div className="flex-1 text-xs text-[#6B7280] leading-snug py-0.5 sm:py-0">
              <span>{selectedAiInfo.description}</span>
            </div>
          </div>

          {targetAi === 'custom' && (
            <div className="pt-1 animate-in fade-in duration-150">
              <input
                type="text"
                value={customAiName}
                onChange={(e) => setCustomAiName(e.target.value)}
                placeholder="사용할 특정 AI명을 입력하세요 (예: Perplexity, Ideogram 등)"
                className="w-full px-3.5 py-2 text-xs sm:text-sm bg-white border border-[#E5E7EB] rounded-xl text-[#1F2937] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#7C3AED]"
              />
            </div>
          )}
        </div>

        {/* 결과 언어 (approx 40%) */}
        <div className="lg:col-span-5 space-y-1.5 sm:space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-[#7C3AED] text-white text-[11px] font-bold flex items-center justify-center shrink-0">
              4
            </span>
            <label className="text-sm font-bold text-[#1F2937] tracking-tight">
              결과 언어
            </label>
          </div>

          {/* Segmented control matching reference */}
          <div className="grid grid-cols-2 gap-1 p-1 bg-stone-100 rounded-xl border border-[#E5E7EB] min-h-[38px] sm:min-h-[42px] max-w-xs">
            {RESULT_LANGUAGES.map((lang) => {
              const isSelected = resultLanguage === lang.value;
              return (
                <button
                  key={lang.value}
                  type="button"
                  onClick={() => setResultLanguage(lang.value)}
                  className={`py-1.5 px-3 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5 min-h-[30px] sm:min-h-[34px] ${
                    isSelected
                      ? 'bg-[#7C3AED] text-white shadow-2xs'
                      : 'text-[#6B7280] hover:text-[#1F2937]'
                  }`}
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>{lang.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 
        5. 어떤 내용으로 만들까요? (Numbered flow 5)
      */}
      <div className="space-y-1.5 sm:space-y-2">
        <div className="flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-[#7C3AED] text-white text-[11px] font-bold flex items-center justify-center shrink-0">
            5
          </span>
          <label className="text-sm font-bold text-[#1F2937] tracking-tight">
            어떤 내용으로 만들까요?
          </label>
        </div>

        {/* Prompt Composer Card */}
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-3.5 sm:p-5 focus-within:border-[#7C3AED] focus-within:ring-2 focus-within:ring-[#7C3AED]/15 transition-all shadow-[0_2px_12px_rgba(0,0,0,0.02)] relative">
          <textarea
            rows={4}
            value={userTopic}
            onChange={(e) => setUserTopic(e.target.value.slice(0, 2000))}
            onKeyDown={handleKeyDown}
            placeholder="어떤 결과물을 만들고 싶은지 편하게 설명해주세요."
            className="w-full bg-transparent border-0 focus:outline-none focus:ring-0 text-xs sm:text-base text-[#1F2937] placeholder:text-[#9CA3AF] min-h-[105px] sm:min-h-[125px] resize-y leading-relaxed"
          />

          {/* Character counter (0/2000) inside textarea container */}
          <div className="text-right text-[11px] sm:text-xs text-[#9CA3AF] font-mono select-none">
            {userTopic.length}/2000
          </div>
        </div>

        {/* Suggestions row: Subdued, gentle Peach background + Calm Coral text */}
        <div className="pt-0.5">
          {/* Mobile compact view: Max 2 examples + "다른 예시" button */}
          <div className="flex sm:hidden items-center gap-1.5 flex-wrap">
            <div className="flex items-center gap-1 text-[11px] font-semibold text-[#4B5563] shrink-0">
              <Lightbulb className="w-3.5 h-3.5 text-[#FB7185]" />
              <span>예시:</span>
            </div>
            {mobileVisibleSamples.map((sample, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setUserTopic(sample)}
                className="text-[11px] px-2.5 py-1 rounded-full bg-[#FFF9F6] hover:bg-[#FFF1F2] text-[#E11D48]/80 border border-[#FEE2E2] transition-colors cursor-pointer text-left truncate max-w-[210px]"
                title={sample}
              >
                "{sample}"
              </button>
            ))}
            {allSamples.length > 2 && (
              <button
                type="button"
                onClick={handleCycleExamples}
                className="inline-flex items-center gap-1 text-[10.5px] px-2 py-0.5 rounded-full bg-stone-100 hover:bg-stone-200/80 text-[#6B7280] font-medium border border-stone-200 transition-colors cursor-pointer"
                title="다른 예시 순환"
              >
                <RotateCw className="w-3 h-3 text-[#6B7280]" />
                <span>다른 예시</span>
              </button>
            )}
          </div>

          {/* Tablet & Desktop full view: 3 examples comfortably displayed */}
          <div className="hidden sm:flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1 text-xs font-semibold text-[#4B5563] shrink-0">
              <Lightbulb className="w-3.5 h-3.5 text-[#FB7185]" />
              <span>예시:</span>
            </div>
            <div className="flex flex-wrap gap-1.5 items-center">
              {allSamples.slice(0, 3).map((sample, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setUserTopic(sample)}
                  className="text-xs px-3 py-1 rounded-full bg-[#FFF9F6] hover:bg-[#FFF1F2] text-[#E11D48]/80 border border-[#FEE2E2] transition-colors cursor-pointer text-left break-all sm:break-normal max-w-full"
                >
                  "{sample}"
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 
        Primary CTA (✨ 프롬프트 만들기 →) - Refined high contrast disabled state!
      */}
      <div className="pt-1.5">
        <button
          type="submit"
          disabled={!userTopic.trim() || isLoading}
          className={`w-full py-3.5 sm:py-4 px-6 rounded-2xl font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition-all min-h-[48px] sm:min-h-[52px] ${
            !userTopic.trim() || isLoading
              ? 'bg-[#E5E7EB] text-[#4B5563] border border-[#D1D5DB] cursor-not-allowed opacity-90 shadow-none'
              : 'bg-[#7C3AED] hover:bg-[#6D28D9] text-white shadow-xs hover:shadow-md cursor-pointer active:scale-[0.99]'
          }`}
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>프롬프트 생성 중...</span>
            </>
          ) : (
            <>
              <Sparkles className={`w-4 h-4 sm:w-5 sm:h-5 ${!userTopic.trim() ? 'text-[#6B7280]' : 'text-white'}`} />
              <span>프롬프트 만들기</span>
              <span className="font-bold">→</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};
