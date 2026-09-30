import React, { useState, useEffect } from 'react';
import { X, Edit3, ArrowRight, Sparkles, Lightbulb } from 'lucide-react';
import { EditTarget, PromptElements } from '../types/prompt';

interface PartialEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  target: EditTarget;
  elements: PromptElements;
  onConfirmEdit: (target: EditTarget, instruction: string) => void;
  isLoading: boolean;
}

export const PartialEditModal: React.FC<PartialEditModalProps> = ({
  isOpen,
  onClose,
  target: initialTarget,
  elements,
  onConfirmEdit,
  isLoading,
}) => {
  const [selectedTarget, setSelectedTarget] = useState<EditTarget>(initialTarget || 'Context');
  const [instruction, setInstruction] = useState('');

  useEffect(() => {
    if (initialTarget && initialTarget !== 'none') {
      setSelectedTarget(initialTarget);
    } else {
      setSelectedTarget('Context');
    }
    setInstruction('');
  }, [initialTarget, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!instruction.trim() || isLoading) return;
    onConfirmEdit(selectedTarget, instruction.trim());
  };

  const getElementValue = (tgt: EditTarget): string => {
    switch (tgt) {
      case 'Context':
        return elements.context;
      case 'Role':
        return elements.role;
      case 'Audience':
        return elements.audience;
      case 'Format':
        return elements.format;
      case 'Task':
        return elements.task;
      default:
        return '';
    }
  };

  const targetList: { id: EditTarget; label: string; desc: string }[] = [
    { id: 'Context', label: 'Context', desc: '맥락' },
    { id: 'Role', label: 'Role', desc: '역할' },
    { id: 'Audience', label: 'Audience', desc: '대상' },
    { id: 'Format', label: 'Format', desc: '형식' },
    { id: 'Task', label: 'Task', desc: '작업' },
  ];

  const getPlaceholder = () => {
    switch (selectedTarget) {
      case 'Role':
        return '예: 글로벌 테크 기업의 10년 차 시니어 브랜드 마케터 톤으로 변경해줘';
      case 'Audience':
        return '예: AI를 처음 접하는 일반인을 대상으로 쉽게 이해할 수 있도록 조정해줘';
      case 'Format':
        return '예: 5단계 마크다운 불릿 포인트 및 비교 분석 표 구조로 레이아웃을 바꿔줘';
      case 'Task':
        return '예: 단순히 요약하는 것에 그치지 않고, 3가지 실천 전략을 도출하도록 확장해줘';
      case 'Context':
      default:
        return '예: 상반기 전략 워크숍 발표를 위한 상황 조건을 추가해줘';
    }
  };

  const sampleSuggestions = {
    Role: [
      '수석 프로덕트 디자이너 페르소나 적용',
      '친절하고 명쾌한 15년 차 시니어 개발자 톤',
      '날카롭고 간결한 금융 투자 분석가 관점',
    ],
    Audience: [
      '비전문가를 위한 친숙하고 쉬운 설명',
      '초기 창업팀 및 투자 심사역 대상',
      '실무 개발진 및 엔지니어링 리드 타깃',
    ],
    Format: [
      '한눈에 들어오는 3단 요약 카드 형태',
      'JSON 구조화 데이터 포맷 명시',
      '16:9 와이드 비율 및 고화질 시네마틱 규격',
    ],
    Task: [
      '핵심 기능 3가지와 차별화 포인트 비교 항목 추가',
      '단계별 실행 로드맵 및 예상 위험 요소 명시',
      '실행 가능한 예제 코드 스니펫 2개 포함',
    ],
    Context: [
      '예산이 제한된 초기 1인 창업가의 긴급한 론칭 상황',
      '글로벌 해외 시장 진출을 염두에 둔 규제 환경 추가',
    ],
  };

  const suggestions = sampleSuggestions[selectedTarget as keyof typeof sampleSuggestions] || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white border border-stone-200 rounded-2xl sm:rounded-3xl w-full max-w-xl max-h-[92vh] flex flex-col shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4 border-b border-stone-100 bg-stone-50/70">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-xl bg-violet-50 text-violet-700">
              <Edit3 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-stone-900 text-sm sm:text-base">부분 수정</h3>
              <p className="text-[11px] text-stone-500">수정할 요소를 선택하고 변경할 내용을 한국어로 입력하세요</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-xl transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 overflow-y-auto">
          {/* Target Element Selector */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-2">
              수정할 요소 선택:
            </label>
            <div className="grid grid-cols-5 gap-1.5">
              {targetList.map((t) => {
                const isSelected = selectedTarget === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setSelectedTarget(t.id)}
                    className={`py-2 px-1 text-center rounded-xl border text-xs font-semibold transition-all cursor-pointer flex flex-col items-center justify-center gap-0.5 ${
                      isSelected
                        ? 'bg-violet-600 border-violet-600 text-white shadow-xs'
                        : 'bg-white border-stone-200 text-stone-600 hover:border-violet-200 hover:bg-violet-50/40'
                    }`}
                  >
                    <span>{t.label}</span>
                    <span className="text-[10px] opacity-80 hidden sm:inline">{t.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Current Value */}
          <div>
            <label className="block text-xs font-medium text-stone-500 mb-1">
              현재 [{selectedTarget}] 내용:
            </label>
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-800 font-mono max-h-24 overflow-y-auto leading-relaxed">
              {getElementValue(selectedTarget) || '(설정되지 않음)'}
            </div>
          </div>

          {/* Instruction */}
          <div>
            <label className="block text-xs font-bold text-stone-800 mb-1.5 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#E76F51]" />
              <span>[{selectedTarget}] 수정 내용 입력:</span>
            </label>
            <textarea
              rows={3}
              value={instruction}
              onChange={(e) => setInstruction(e.target.value)}
              placeholder={getPlaceholder()}
              className="w-full p-3 text-xs sm:text-sm bg-white border border-stone-300 rounded-xl text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/20"
            />
          </div>

          {/* Quick Suggestions - Soft Coral touch */}
          {suggestions.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 text-[11px] text-stone-500 mb-1.5">
                <Lightbulb className="w-3.5 h-3.5 text-[#E76F51]" />
                <span>추천 변경 예시:</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {suggestions.map((sug, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setInstruction(sug)}
                    className="text-[11px] px-2.5 py-1 rounded-md bg-[#FFF7F4] hover:bg-[#FFEBE5] text-[#D45034] border border-[#FAD8CF] transition-colors cursor-pointer text-left"
                  >
                    + {sug}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="text-[11px] text-stone-500 bg-stone-50 p-2.5 rounded-xl border border-stone-200">
            ℹ️ 선택한 요소를 중심으로 수정하며, 기존의 다른 요구사항은 최대한 유지하면서 전체 영문 프롬프트와 한국어 번역본이 자동 재구성됩니다.
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
              disabled={!instruction.trim() || isLoading}
              className="px-5 py-2 text-xs sm:text-sm font-bold bg-violet-600 hover:bg-violet-700 disabled:bg-stone-200 disabled:text-stone-400 text-white rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>수정 반영 중...</span>
                </>
              ) : (
                <>
                  <span>수정 반영하기</span>
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
