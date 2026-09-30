import React from 'react';
import { PromptElements, EditTarget } from '../types/prompt';
import { Layers, Edit3 } from 'lucide-react';

interface ElementsBreakdownProps {
  elements: PromptElements;
  onEditElement: (target: EditTarget, currentValue: string) => void;
}

export const ElementsBreakdown: React.FC<ElementsBreakdownProps> = ({
  elements,
  onEditElement,
}) => {
  const elementCards: {
    key: EditTarget;
    titleKo: string;
    titleEn: string;
    icon: string;
    value: string;
    description: string;
  }[] = [
    {
      key: 'Context',
      titleKo: '배경 및 맥락',
      titleEn: 'Context',
      icon: '🏛️',
      value: elements.context,
      description: '배경, 목적, 상황 및 제약 조건',
    },
    {
      key: 'Role',
      titleKo: '역할 및 페르소나',
      titleEn: 'Role',
      icon: '👤',
      value: elements.role,
      description: 'AI가 취해야 할 전문 관점과 역할',
    },
    {
      key: 'Audience',
      titleKo: '대상 독자/사용자',
      titleEn: 'Audience',
      icon: '🎯',
      value: elements.audience,
      description: '결과물을 소비하거나 전달받을 대상',
    },
    {
      key: 'Format',
      titleKo: '형식 및 구조',
      titleEn: 'Format',
      icon: '📐',
      value: elements.format,
      description: '매체 특성, 레이아웃, 스타일 규격',
    },
    {
      key: 'Task',
      titleKo: '핵심 과업',
      titleEn: 'Task',
      icon: '⚡',
      value: elements.task,
      description: 'AI가 수행해야 할 구체적 작업 지침',
    },
  ];

  return (
    <div className="space-y-3.5">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
          <Layers className="w-4 h-4 text-violet-600" />
          <span>5대 프레임워크 요소 분석 (C-R-A-F-T)</span>
        </h4>
        <span className="text-[11px] text-stone-500">
          원하는 항목만 [부분 수정]으로 정밀 교정 가능
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {elementCards.map((card) => (
          <div
            key={card.key}
            className="p-3.5 rounded-xl bg-white border border-stone-200 hover:border-violet-300 transition-all flex flex-col justify-between group shadow-xs"
          >
            <div>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm">{card.icon}</span>
                  <span className="text-xs font-bold text-stone-800">{card.titleKo}</span>
                  <span className="text-[10.5px] text-stone-400 font-mono">({card.titleEn})</span>
                </div>
                <button
                  type="button"
                  onClick={() => onEditElement(card.key, card.value)}
                  className="px-2 py-0.5 text-[11px] font-medium text-violet-700 bg-violet-50 hover:bg-violet-100 border border-violet-200 rounded-md transition-colors flex items-center gap-1 cursor-pointer"
                  title={`${card.titleEn} 요소 부분 수정`}
                >
                  <Edit3 className="w-3 h-3" />
                  <span>수정</span>
                </button>
              </div>

              <p className="text-[11px] text-stone-500 mb-2">{card.description}</p>

              <div className="text-xs text-stone-800 bg-stone-50 p-2.5 rounded-lg border border-stone-200/80 leading-relaxed font-mono whitespace-pre-wrap max-h-36 overflow-y-auto">
                {card.value || <span className="text-stone-400 italic">(자동 추론되어 내장됨)</span>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
