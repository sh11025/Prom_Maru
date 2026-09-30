import React, { useState } from 'react';
import {
  Copy,
  Check,
  Sparkles,
  Play,
  CheckCircle2,
  AlertTriangle,
  Info,
  Download,
  RotateCcw,
  Edit3,
  CheckCircle,
} from 'lucide-react';
import { PromMaruResponse, EditTarget, TargetAIOption } from '../types/prompt';
import { TARGET_AIS } from '../constants/presets';
import { ElementsBreakdown } from './ElementsBreakdown';

interface DraftResultViewProps {
  response: PromMaruResponse;
  targetAiId: string;
  resultCategory: string;
  resultLanguage: string;
  onRefine: () => void;
  onPartialEdit: (target?: EditTarget, currentValue?: string) => void;
  onNewPrompt: () => void;
  onSaveToHistory: () => void;
  onSimulate?: () => void;
  isSaved?: boolean;
}

export const DraftResultView: React.FC<DraftResultViewProps> = ({
  response,
  targetAiId,
  resultCategory,
  resultLanguage,
  onRefine,
  onPartialEdit,
  onNewPrompt,
  onSaveToHistory,
  onSimulate,
  isSaved = false,
}) => {
  const [copiedEn, setCopiedEn] = useState<boolean>(false);
  const [copiedKo, setCopiedKo] = useState<boolean>(false);
  const [isConfirmed, setIsConfirmed] = useState<boolean>(false);

  const targetAiMeta: TargetAIOption = TARGET_AIS.find((ai) => ai.id === targetAiId) || {
    id: targetAiId,
    name: targetAiId === 'custom' ? '기타 / 직접 지정' : targetAiId.toUpperCase(),
    category: 'all',
    description: '',
  };

  const handleCopyEn = () => {
    navigator.clipboard.writeText(response.prompt_en);
    setCopiedEn(true);
    setTimeout(() => setCopiedEn(false), 2500);
  };

  const handleCopyKo = () => {
    navigator.clipboard.writeText(response.prompt_ko);
    setCopiedKo(true);
    setTimeout(() => setCopiedKo(false), 2500);
  };

  const handleDownloadTxt = () => {
    const reviewStatusText =
      response.review_status === 'good'
        ? '충분함'
        : response.review_status === 'could_improve'
        ? '보완하면 좋음'
        : '보완 필요';

    const txtContent = `=====================================================
[ English Prompt ]
실제로 복사해서 대상 AI에 사용할 최종 영문 프롬프트
=====================================================
${response.prompt_en}

=====================================================
[ 한국어 번역 ]
영문 프롬프트 전체에 대응하는 충실한 한국어 번역
=====================================================
${response.prompt_ko}

=====================================================
[ 완성도 평가: ${reviewStatusText} ]
${response.review || ''}
=====================================================

[ 5대 핵심 요소 (Context, Role, Audience, Format, Task) ]
• Context (배경 및 맥락):
  ${response.elements.context || '-'}

• Role (역할 및 페르소나):
  ${response.elements.role || '-'}

• Audience (대상 및 독자):
  ${response.elements.audience || '-'}

• Format (형식 및 미디어 특성):
  ${response.elements.format || '-'}

• Task (핵심 수행 과업):
  ${response.elements.task || '-'}
`;
    const blob = new Blob([txtContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `prom-maru-prompt-${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleUseAsIs = () => {
    navigator.clipboard.writeText(response.prompt_en);
    setCopiedEn(true);
    setIsConfirmed(true);
    onSaveToHistory();
    setTimeout(() => {
      setCopiedEn(false);
    }, 2500);
  };

  const getReviewBadge = () => {
    switch (response.review_status) {
      case 'good':
        return {
          icon: <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />,
          label: '충분함',
          subLabel: 'good',
          bg: 'bg-emerald-50/70 border-emerald-200 text-emerald-800',
        };
      case 'could_improve':
        return {
          icon: <Info className="w-4 h-4 text-amber-600 shrink-0" />,
          label: '보완하면 좋음',
          subLabel: 'could_improve',
          bg: 'bg-amber-50/70 border-amber-200 text-amber-800',
        };
      case 'needs_improvement':
      default:
        return {
          icon: <AlertTriangle className="w-4 h-4 text-[#FB7185] shrink-0" />,
          label: '보완 필요',
          subLabel: 'needs_improvement',
          bg: 'bg-[#FFF1F2] border-[#FECDD3] text-[#E11D48]',
        };
    }
  };

  const reviewBadge = getReviewBadge();

  const charCountEn = response.prompt_en.length;
  const wordCountEn = response.prompt_en.trim().split(/\s+/).filter(Boolean).length;
  const tokenEstimate = Math.round(charCountEn / 4);

  return (
    <div className="space-y-6 animate-in fade-in duration-300 w-full max-w-full overflow-hidden">
      {/* Confirmation feedback alert when [이대로 사용] is pressed */}
      {isConfirmed && (
        <div className="p-3.5 sm:p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center gap-2.5 text-xs sm:text-sm text-emerald-900 animate-in fade-in duration-200 shadow-2xs">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>
            영문 프롬프트가 클립보드에 복사되었고 히스토리에 저장되었습니다. 대상 AI에 바로 붙여넣어 실행하세요!
          </span>
        </div>
      )}

      {/* 
        1. English Prompt (Top Priority Card)
      */}
      <section className="w-full flex flex-col rounded-3xl bg-white border-2 border-[#7C3AED]/70 shadow-xs overflow-hidden">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 sm:px-6 py-3.5 bg-[#F5F3FF] border-b border-[#EDE9FE]">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2 py-0.5 rounded-full text-[10.5px] font-bold uppercase tracking-wider bg-[#7C3AED] text-white">
                최종 결과물
              </span>
              <h3 className="font-extrabold text-[#1F2937] text-sm sm:text-base">
                [ English Prompt ]
              </h3>
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-white text-[#7C3AED] border border-[#DDD6FE]">
                {targetAiMeta.name}
              </span>
            </div>
            <p className="text-xs text-[#6B7280] mt-0.5">
              실제로 대상 AI({targetAiMeta.name})에 복사해서 붙여넣을 완성본입니다.
            </p>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-2.5 self-stretch sm:self-center shrink-0">
            {copiedEn && (
              <span className="text-xs font-bold text-emerald-700 flex items-center gap-1 animate-in fade-in duration-150">
                <span>✓ 복사되었습니다</span>
              </span>
            )}

            {/* Primary Copy Button: Violet */}
            <button
              type="button"
              onClick={handleCopyEn}
              className={`w-full sm:w-auto px-4 py-2.5 sm:py-2 rounded-2xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer min-h-[44px] sm:min-h-[38px] ${
                copiedEn
                  ? 'bg-emerald-600 text-white'
                  : 'bg-[#7C3AED] hover:bg-[#6D28D9] text-white shadow-xs active:scale-[0.99]'
              }`}
              title="영문 프롬프트만 클립보드에 복사"
            >
              {copiedEn ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>[ 영문 프롬프트 복사 ]</span>
            </button>
          </div>
        </div>

        {/* Text Body */}
        <div className="p-4 sm:p-6 bg-white overflow-hidden">
          <div className="font-mono text-xs sm:text-[14px] lg:text-[14.5px] text-[#1F2937] whitespace-pre-wrap break-words leading-relaxed sm:leading-7 select-all">
            {response.prompt_en}
          </div>
        </div>

        {/* Footer info */}
        <div className="px-4 sm:px-6 py-2.5 bg-stone-50 border-t border-[#F3F4F6] text-xs text-[#6B7280] flex flex-wrap items-center justify-between gap-2">
          <span>✓ 대상 AI에 붙여넣어 즉시 최적의 결과를 생성할 수 있습니다.</span>
          <div className="flex items-center gap-2 text-[#9CA3AF] text-[11.5px]">
            <span>~{tokenEstimate} 토큰</span>
            <span>•</span>
            <span>{wordCountEn} 단어</span>
            <span>•</span>
            <span>{charCountEn} 글자</span>
          </div>
        </div>
      </section>

      {/* 
        2. 한국어 번역
      */}
      <section className="w-full flex flex-col rounded-3xl bg-white border border-[#E5E7EB] shadow-2xs overflow-hidden">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 px-4 sm:px-6 py-3.5 bg-stone-50/80 border-b border-[#E5E7EB]">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full text-[10.5px] font-bold uppercase tracking-wider bg-stone-200 text-[#4B5563]">
                한국어 완역
              </span>
              <h3 className="font-bold text-[#1F2937] text-sm sm:text-base">
                [ 한국어 번역 ]
              </h3>
            </div>
            <p className="text-xs text-[#6B7280] mt-0.5">
              영문 프롬프트 전체 내용에 대응하는 한국어 번역본입니다.
            </p>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-2.5 self-stretch sm:self-center shrink-0">
            {copiedKo && (
              <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1 animate-in fade-in duration-150">
                <span>✓ 복사되었습니다</span>
              </span>
            )}

            <button
              type="button"
              onClick={handleCopyKo}
              className={`w-full sm:w-auto px-3.5 py-2 sm:py-1.5 rounded-2xl text-xs font-medium transition-all flex items-center justify-center gap-1.5 cursor-pointer border min-h-[40px] sm:min-h-[34px] ${
                copiedKo
                  ? 'bg-emerald-600 text-white border-emerald-500'
                  : 'bg-white hover:bg-stone-50 text-[#4B5563] border-[#E5E7EB]'
              }`}
              title="한국어 번역본 복사"
            >
              {copiedKo ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5 text-[#9CA3AF]" />}
              <span>한국어 복사</span>
            </button>
          </div>
        </div>

        {/* Text Body */}
        <div className="p-4 sm:p-6 bg-white overflow-hidden">
          <div className="font-sans text-xs sm:text-[14px] lg:text-[14.5px] text-[#374151] whitespace-pre-wrap break-words leading-relaxed sm:leading-7 select-text">
            {response.prompt_ko}
          </div>
        </div>

        {/* Footer info */}
        <div className="px-4 sm:px-6 py-2.5 bg-stone-50 border-t border-[#F3F4F6] text-xs text-[#9CA3AF] flex items-center justify-between">
          <span>영문의 지시사항 및 제약조건이 충실히 포함되어 있습니다.</span>
          <span className="text-[11.5px]">{response.prompt_ko.length} 글자</span>
        </div>
      </section>

      {/* 
        3. 완성도 평가
      */}
      <section className={`p-4 sm:p-5 rounded-3xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3.5 shadow-2xs ${reviewBadge.bg}`}>
        <div className="flex items-start gap-3 w-full sm:w-auto">
          <div className="mt-0.5">{reviewBadge.icon}</div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold uppercase tracking-wider text-[#6B7280]">
                완성도 평가:
              </span>
              <span className="font-bold text-sm sm:text-base tracking-tight text-[#1F2937]">
                {reviewBadge.label}
              </span>
              <span className="text-[11px] px-1.5 py-0.5 rounded bg-white/80 font-mono text-[#4B5563] border border-[#E5E7EB]">
                {reviewBadge.subLabel}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#374151] leading-relaxed font-medium">
              💡 {response.review || '사용자의 의도를 충실히 반영하여 균형 잡힌 프롬프트로 완성되었습니다.'}
            </p>
          </div>
        </div>

        <div className="w-full sm:w-auto self-end sm:self-center shrink-0">
          {/* Secondary Button: Coral */}
          <button
            type="button"
            onClick={onRefine}
            className="w-full sm:w-auto px-4 py-2.5 sm:py-2 rounded-2xl text-xs font-semibold bg-[#FFF9F6] hover:bg-[#FFF1F2] text-[#FB7185] border border-[#FECDD3] shadow-2xs flex items-center justify-center gap-1.5 transition-all cursor-pointer min-h-[40px] sm:min-h-[36px]"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#FB7185]" />
            <span>더 다듬기</span>
          </button>
        </div>
      </section>

      {/* 
        4. 5요소 분석
      */}
      <section className="p-4 sm:p-6 rounded-3xl bg-white border border-[#E5E7EB] shadow-2xs">
        <ElementsBreakdown
          elements={response.elements}
          onEditElement={(target, currentValue) => onPartialEdit(target, currentValue)}
        />
      </section>

      {/* 
        5 & 6. 하단 액션 툴바
      */}
      <div className="p-4 sm:p-6 rounded-3xl bg-white border border-[#E5E7EB] shadow-xs space-y-4">
        {/* Major Primary Actions */}
        <div>
          <span className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wider block mb-2.5">
            주요 작업
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {/* 1. [ 이대로 사용 ] - Primary Solid Violet */}
            <button
              type="button"
              onClick={handleUseAsIs}
              className={`w-full py-3.5 px-4 rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer min-h-[48px] ${
                isConfirmed
                  ? 'bg-emerald-50 border-2 border-emerald-500 text-emerald-800'
                  : 'bg-[#7C3AED] hover:bg-[#6D28D9] text-white shadow-xs active:scale-[0.99]'
              }`}
              title="영문 프롬프트를 복사하고 히스토리에 보관"
            >
              <CheckCircle className={`w-4 h-4 ${isConfirmed ? 'text-emerald-700' : 'text-white'}`} />
              <span>[ 이대로 사용 ]</span>
            </button>

            {/* 2. [ 더 다듬기 ] - Secondary Coral */}
            <button
              type="button"
              onClick={onRefine}
              className="w-full py-3.5 px-4 rounded-2xl text-xs sm:text-sm font-bold bg-[#FFF9F6] hover:bg-[#FFF1F2] text-[#FB7185] border border-[#FECDD3] flex items-center justify-center gap-2 transition-all cursor-pointer min-h-[48px] shadow-2xs active:scale-[0.99]"
              title="추가 질문을 통해 프롬프트를 고도화합니다"
            >
              <Sparkles className="w-4 h-4 text-[#FB7185]" />
              <span>[ 더 다듬기 ]</span>
            </button>

            {/* 3. [ 부분 수정 ] - Ghost with Gray Border */}
            <button
              type="button"
              onClick={() => onPartialEdit('Context')}
              className="w-full py-3.5 px-4 rounded-2xl text-xs sm:text-sm font-bold bg-white hover:bg-stone-50 text-[#4B5563] border border-[#E5E7EB] flex items-center justify-center gap-2 transition-all cursor-pointer min-h-[48px] shadow-2xs active:scale-[0.99]"
              title="Context, Role, Audience, Format, Task 중 원하는 요소만 수정"
            >
              <Edit3 className="w-4 h-4 text-[#7C3AED]" />
              <span>[ 부분 수정 ]</span>
            </button>
          </div>
        </div>

        {/* Secondary Actions */}
        <div className="pt-2 border-t border-[#F3F4F6]">
          <span className="text-[11px] font-medium text-[#9CA3AF] uppercase tracking-wider block mb-2">
            보조 작업
          </span>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
            <div className="grid grid-cols-2 sm:flex sm:items-center gap-2">
              <button
                type="button"
                onClick={handleCopyEn}
                className="py-2.5 px-3.5 rounded-2xl text-xs sm:text-sm font-semibold bg-white hover:bg-stone-50 text-[#4B5563] border border-[#E5E7EB] flex items-center justify-center gap-1.5 transition-colors cursor-pointer min-h-[44px]"
                title="영문 프롬프트 복사"
              >
                {copiedEn ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-[#6B7280]" />}
                <span>[ 복사 ]</span>
              </button>

              <button
                type="button"
                onClick={handleDownloadTxt}
                className="py-2.5 px-3.5 rounded-2xl text-xs sm:text-sm font-semibold bg-white hover:bg-stone-50 text-[#4B5563] border border-[#E5E7EB] flex items-center justify-center gap-1.5 transition-colors cursor-pointer min-h-[44px]"
                title="TXT 파일로 저장"
              >
                <Download className="w-4 h-4 text-[#6B7280]" />
                <span>[ TXT 저장 ]</span>
              </button>

              <button
                type="button"
                onClick={onNewPrompt}
                className="col-span-2 sm:col-span-1 py-2.5 px-3.5 rounded-2xl text-xs sm:text-sm font-semibold bg-white hover:bg-stone-50 text-[#4B5563] border border-[#E5E7EB] flex items-center justify-center gap-1.5 transition-colors cursor-pointer min-h-[44px]"
                title="새 프롬프트 작성"
              >
                <RotateCcw className="w-4 h-4 text-[#6B7280]" />
                <span>[ 새 프롬프트 ]</span>
              </button>
            </div>

            {onSimulate && (
              <button
                type="button"
                onClick={onSimulate}
                className="w-full sm:w-auto py-2.5 px-3.5 rounded-2xl text-xs font-semibold bg-white hover:bg-[#F5F3FF] text-[#4B5563] hover:text-[#7C3AED] border border-[#E5E7EB] flex items-center justify-center gap-1.5 transition-colors cursor-pointer min-h-[44px]"
                title="프롬프트 실행 결과 미리 시뮬레이션"
              >
                <Play className="w-3.5 h-3.5 text-[#7C3AED]" />
                <span>AI 시뮬레이션</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
