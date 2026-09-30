import React, { useState } from 'react';
import { AlertCircle, ArrowRight, Sparkles, Check } from 'lucide-react';
import { PromMaruResponse } from '../types/prompt';

interface QuestionViewProps {
  response: PromMaruResponse;
  onSubmitAnswers: (answersText: string) => void;
  onUseDefaults: () => void;
  isLoading: boolean;
}

export const QuestionView: React.FC<QuestionViewProps> = ({
  response,
  onSubmitAnswers,
  onUseDefaults,
  isLoading,
}) => {
  const [answers, setAnswers] = useState<{ [index: number]: string }>({});

  const handleSelectOption = (qIdx: number, option: string) => {
    setAnswers((prev) => ({
      ...prev,
      [qIdx]: option,
    }));
  };

  const handleTextChange = (qIdx: number, text: string) => {
    setAnswers((prev) => ({
      ...prev,
      [qIdx]: text,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formatted = response.questions
      .map((q, idx) => `질문: ${q}\n답변: ${answers[idx] || '자율적인 표준 기본값 적용 권장'}`)
      .join('\n\n');
    onSubmitAnswers(formatted);
  };

  const extractOptions = (qText: string): string[] => {
    const match = qText.match(/(?:예|선택|예시)\s*[:：]\s*(.+)$/i);
    if (!match) return [];
    const rawOptions = match[1];
    return rawOptions
      .split(/[/,·]/)
      .map((opt) => opt.replace(/[()]/g, '').trim())
      .filter((opt) => opt.length > 0 && opt.length < 30);
  };

  return (
    <div className="p-4 sm:p-7 rounded-2xl sm:rounded-3xl bg-white border border-stone-200 shadow-xs space-y-5 sm:space-y-6">
      {/* Friendly Banner with Soft Coral Accent */}
      <div className="flex items-start gap-3 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-[#FFF5F2] border border-[#FADBD3]">
        <AlertCircle className="w-5 h-5 text-[#E76F51] mt-0.5 shrink-0" />
        <div>
          <h3 className="font-bold text-stone-900 text-xs sm:text-base leading-snug">
            더 완성도 높은 프롬프트를 위해 몇 가지 확인이 필요합니다
          </h3>
          <p className="text-[11.5px] sm:text-xs text-stone-600 mt-1 leading-relaxed">
            {response.review || '원하시는 결과물의 형태와 조건을 더 정확히 반영하기 위한 짤막한 질문입니다.'}
          </p>
        </div>
      </div>

      {/* Questions Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {response.questions.map((question, idx) => {
          const options = extractOptions(question);
          const currentAnswer = answers[idx] || '';

          return (
            <div
              key={idx}
              className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-stone-50/80 border border-stone-200 space-y-2.5 sm:space-y-3"
            >
              <div className="flex items-start gap-2.5">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-violet-100 text-violet-700 text-xs font-bold shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <p className="text-xs sm:text-sm font-semibold text-stone-900 leading-snug break-words">
                  {question}
                </p>
              </div>

              {/* Clickable suggestion pills - Touch friendly */}
              {options.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pl-0 sm:pl-7">
                  {options.map((opt, optIdx) => {
                    const isSelected = currentAnswer === opt;
                    return (
                      <button
                        key={optIdx}
                        type="button"
                        onClick={() => handleSelectOption(idx, opt)}
                        className={`text-xs px-3 py-1.5 rounded-full border transition-all cursor-pointer flex items-center gap-1 min-h-[36px] ${
                          isSelected
                            ? 'bg-violet-600 text-white border-violet-600 shadow-2xs'
                            : 'bg-white text-stone-700 border-stone-200 hover:border-violet-300 hover:bg-violet-50/50 active:bg-stone-100'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5" />}
                        <span>{opt}</span>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Direct Text Answer */}
              <div className="pl-0 sm:pl-7">
                <input
                  type="text"
                  value={currentAnswer}
                  onChange={(e) => handleTextChange(idx, e.target.value)}
                  placeholder="직접 답변을 입력하거나 위 보기를 선택하세요"
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-stone-200 rounded-xl text-stone-800 placeholder:text-stone-400 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/20 min-h-[42px]"
                />
              </div>
            </div>
          );
        })}

        {/* Buttons - Mobile Responsive Stacking */}
        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3">
          <button
            type="button"
            onClick={onUseDefaults}
            disabled={isLoading}
            className="w-full sm:w-auto px-4 py-3 text-xs font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-xl transition-colors cursor-pointer text-center min-h-[44px] flex items-center justify-center"
          >
            잘 모르겠어요 (표준 기본값으로 즉시 초안 작성)
          </button>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto px-6 py-3.5 bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer min-h-[48px] active:scale-[0.99]"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>답변 반영하여 프롬프트 완성하기</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
