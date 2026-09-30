import React, { useState } from 'react';
import { X, Sparkles, ArrowRight, Wand2 } from 'lucide-react';

interface RefineModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmRefine: (refineInstruction: string) => void;
  isLoading: boolean;
  currentReview: string;
}

export const RefineModal: React.FC<RefineModalProps> = ({
  isOpen,
  onClose,
  onConfirmRefine,
  isLoading,
  currentReview,
}) => {
  const [instruction, setInstruction] = useState('');

  if (!isOpen) return null;

  const quickRefineOptions = [
    '톤앤매너를 더욱 설득력 있고 전문적인 시니어 관점으로 끌어올려줘',
    'AI가 임의로 내용을 창작하지 못하도록 구체적인 제약조건을 보강해줘',
    '출력 형식을 3~4개의 명확한 단계별 소제목 및 핵심 요약 표로 정밀 구조화해줘',
    '실제 적용 시 바로 활용할 수 있는 구체적인 실무 예시와 가이드라인을 포함해줘',
    '결과물의 길이를 더 압축적이고 군더더기 없는 핵심 중심으로 다듬어줘',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!instruction.trim() && !isLoading) {
      onConfirmRefine('전체적인 디테일과 제약조건을 고도화하여 최상위 완성도(good) 등급으로 다듬어줘');
      return;
    }
    onConfirmRefine(instruction.trim());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white border border-stone-200 rounded-3xl w-full max-w-xl flex flex-col shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100 bg-stone-50/70">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-xl bg-[#FFF2EE] text-[#E76F51]">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-stone-900 text-sm sm:text-base">더 다듬기</h3>
              <p className="text-[11px] text-stone-500">원하는 보완 방향을 한국어로 지시해주세요</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Current Review note */}
          {currentReview && (
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-700 leading-relaxed">
              <span className="font-semibold text-stone-900">현재 평가:</span> {currentReview}
            </div>
          )}

          {/* Quick Option Pills */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-2">
              자주 쓰는 고도화 옵션:
            </label>
            <div className="flex flex-col gap-1.5">
              {quickRefineOptions.map((opt, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setInstruction(opt)}
                  className="text-left text-xs p-2.5 rounded-xl bg-stone-50 hover:bg-violet-50 text-stone-700 hover:text-violet-800 border border-stone-200 hover:border-violet-200 transition-colors cursor-pointer"
                >
                  + {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Direct Input */}
          <div>
            <label className="block text-xs font-bold text-stone-800 mb-1">
              직접 추가 지시 입력 (선택 사항):
            </label>
            <textarea
              rows={3}
              value={instruction}
              onChange={(e) => setInstruction(e.target.value)}
              placeholder="예: 예시 코드를 2개 이상 포함하고, 초보자도 이해할 수 있도록 용어 설명을 덧붙여줘"
              className="w-full p-3 text-xs sm:text-sm bg-white border border-stone-300 rounded-xl text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/20"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 text-xs font-medium text-stone-500 hover:text-stone-800 hover:bg-stone-100 rounded-xl transition-colors cursor-pointer"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-5 py-2.5 text-xs sm:text-sm font-bold bg-violet-600 hover:bg-violet-700 text-white rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>다듬는 중...</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4" />
                  <span>더 다듬기 실행</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
