import React from 'react';
import { X, Star, Lightbulb, Compass } from 'lucide-react';

interface FrameworkGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ElementCardData {
  key: string;
  nameEn: string;
  nameKo: string;
  isCore: boolean;
  description: string;
  example: string;
}

const FIVE_ELEMENTS: ElementCardData[] = [
  {
    key: 'context',
    nameEn: 'Context',
    nameKo: '맥락',
    isCore: true,
    description: 'AI가 알아야 할 배경, 상황, 목적, 제약조건',
    example: '신제품 출시를 위한 여름 향수 광고',
  },
  {
    key: 'task',
    nameEn: 'Task',
    nameKo: '작업',
    isCore: true,
    description: 'AI가 실제로 수행해야 할 핵심 요청',
    example: '해변과 골든아워를 배경으로 향수 광고 이미지를 구성',
  },
  {
    key: 'role',
    nameEn: 'Role',
    nameKo: '역할',
    isCore: false,
    description: 'AI에게 부여할 전문가 역할',
    example: '럭셔리 브랜드 전문 광고 크리에이티브 디렉터',
  },
  {
    key: 'audience',
    nameEn: 'Audience',
    nameKo: '대상',
    isCore: false,
    description: '결과물을 사용할 사람 또는 보여줄 대상',
    example: '20~30대 여성 소비자',
  },
  {
    key: 'format',
    nameEn: 'Format',
    nameKo: '형식',
    isCore: false,
    description: '원하는 결과물의 구조, 스타일 또는 표현 방식',
    example: '고급 제품 광고 이미지, 세로형 SNS 비율',
  },
];

export const FrameworkGuideModal: React.FC<FrameworkGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white border border-stone-200 rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-stone-100 bg-stone-50/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-violet-50 text-violet-700">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-stone-900">5요소 가이드</h2>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-violet-50 text-violet-700 border border-violet-100">
                  도움말
                </span>
              </div>
              <p className="text-xs text-stone-500">
                좋은 프롬프트를 완성하는 5가지 핵심 구성 요소입니다.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-4 text-stone-700">
          {/* Elements Cards Grid */}
          <div className="space-y-2.5">
            {FIVE_ELEMENTS.map((elem) => (
              <div
                key={elem.key}
                className="p-3.5 sm:p-4 rounded-xl bg-white border border-stone-200 hover:border-violet-200 transition-all shadow-2xs"
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-sm sm:text-base font-bold text-stone-900">
                      {elem.nameEn}
                    </span>
                    <span className="text-xs text-stone-500 font-medium">
                      — {elem.nameKo}
                    </span>
                  </div>
                  {elem.isCore ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#FFF2EE] text-[#D45034] border border-[#FADBD3]">
                      <Star className="w-3 h-3 fill-[#E76F51] text-[#E76F51]" />
                      <span>가장 중요</span>
                    </span>
                  ) : (
                    <span className="text-[11px] text-stone-400">자동 추론 지원</span>
                  )}
                </div>

                {/* Description */}
                <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-normal">
                  {elem.description}
                </p>

                {/* Example */}
                <div className="mt-2 pt-2 border-t border-stone-100 flex items-start gap-1.5 text-xs">
                  <span className="text-stone-400 font-medium shrink-0">예:</span>
                  <span className="text-violet-700 font-medium">{elem.example}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Important Notice with Soft Coral / Warm Touch */}
          <div className="p-4 rounded-2xl bg-[#FFF9F6] border border-[#FADBD3] space-y-2">
            <div className="flex items-center gap-2 text-stone-900 font-bold text-xs sm:text-sm">
              <Lightbulb className="w-4 h-4 text-[#E76F51] shrink-0" />
              <span>안내: 5가지 요소를 다 외우실 필요가 없습니다</span>
            </div>
            <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-medium">
              5가지 요소를 모두 직접 작성할 필요는 없습니다. Prom_Maru가 입력 내용을 분석해 필요한 요소를 자동으로 추론하고, 중요한 정보가 부족할 때만 추가 질문합니다.
            </p>
            <p className="text-xs text-stone-500 leading-relaxed pt-1 border-t border-[#F5CEC5]">
              💡 특히 <strong className="text-stone-900 font-semibold">Context(맥락)</strong>와 <strong className="text-stone-900 font-semibold">Task(작업)</strong> 두 가지만 분명하게 적어주셔도, 나머지 요소(Role, Audience, Format)는 Prom_Maru가 상황에 맞춰 가장 이상적인 값으로 완성합니다.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 sm:px-6 py-3.5 border-t border-stone-100 bg-stone-50/60 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-violet-600 hover:bg-violet-700 rounded-xl transition-colors cursor-pointer"
          >
            확인했습니다
          </button>
        </div>
      </div>
    </div>
  );
};
