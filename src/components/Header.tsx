import React, { useState, useRef, useEffect } from 'react';
import {
  BookOpen,
  History,
  RotateCcw,
  Settings,
  LayoutTemplate,
  Menu,
  X,
} from 'lucide-react';
import { APP_ICON_PATH } from '../constants/assets';

interface HeaderProps {
  onOpenGuide: () => void;
  onOpenTemplates: () => void;
  onOpenHistory: () => void;
  onOpenSettings: () => void;
  onReset: () => void;
  historyCount: number;
  hasApiKey: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenGuide,
  onOpenTemplates,
  onOpenHistory,
  onOpenSettings,
  onReset,
  historyCount,
  hasApiKey,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };
    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  return (
    <header className="border-b border-[#E5E7EB] bg-white/95 backdrop-blur-md sticky top-0 z-30 transition-all">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-15 sm:h-16 flex items-center justify-between">
        {/* Brand */}
        <div
          className="flex items-center gap-2.5 cursor-pointer group select-none min-h-[44px]"
          onClick={() => {
            onReset();
            setIsMobileMenuOpen(false);
          }}
          title="처음으로 이동"
        >
          <div className="w-9 h-9 rounded-xl overflow-hidden shadow-2xs group-hover:scale-[1.03] transition-transform shrink-0 flex items-center justify-center">
            <img
              src={APP_ICON_PATH}
              alt="Prom_Maru 로고"
              className="w-full h-full object-contain"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-lg text-[#1F2937] tracking-tight">
              프롬마루
            </span>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#F5F3FF] text-[#7C3AED] border border-[#EDE9FE]">
              Prom_Maru
            </span>
          </div>
        </div>

        {/* Desktop Navigation (>= 768px) - Aligned with reference image */}
        <nav className="hidden md:flex items-center gap-2">
          {/* 추천 템플릿 - Coral Secondary Style */}
          <button
            type="button"
            onClick={onOpenTemplates}
            className="flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-semibold text-[#FB7185] hover:bg-[#FFF1F2] rounded-xl transition-colors cursor-pointer min-h-[40px]"
            title="8대 카테고리별 추천 템플릿"
          >
            <LayoutTemplate className="w-4 h-4 text-[#FB7185]" />
            <span>추천 템플릿</span>
          </button>

          {/* 5요소 가이드 */}
          <button
            type="button"
            onClick={onOpenGuide}
            className="flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium text-[#4B5563] hover:text-[#1F2937] hover:bg-stone-50 rounded-xl transition-colors cursor-pointer min-h-[40px]"
            title="5요소 가이드"
          >
            <BookOpen className="w-4 h-4 text-[#7C3AED]" />
            <span>5요소 가이드</span>
          </button>

          {/* 히스토리 */}
          <button
            type="button"
            onClick={onOpenHistory}
            className="flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium text-[#4B5563] hover:text-[#1F2937] hover:bg-stone-50 rounded-xl transition-colors cursor-pointer min-h-[40px]"
            title="저장된 프롬프트 히스토리"
          >
            <History className="w-4 h-4 text-[#6B7280]" />
            <span>히스토리</span>
            {historyCount > 0 && (
              <span className="inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold leading-none text-white bg-[#7C3AED] rounded-full ml-0.5">
                {historyCount}
              </span>
            )}
          </button>

          {/* 설정 */}
          <button
            type="button"
            onClick={onOpenSettings}
            className="flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium text-[#4B5563] hover:text-[#1F2937] hover:bg-stone-50 rounded-xl transition-colors cursor-pointer min-h-[40px]"
            title="Gemini API 설정"
          >
            <Settings className="w-4 h-4 text-[#6B7280]" />
            <span>설정</span>
            {hasApiKey && (
              <span className="w-2 h-2 rounded-full bg-emerald-500 ml-0.5" title="API Key 연결됨" />
            )}
          </button>

          {/* 새로 작성 */}
          <button
            type="button"
            onClick={onReset}
            className="p-2 text-[#9CA3AF] hover:text-[#4B5563] hover:bg-stone-100 rounded-xl transition-colors cursor-pointer ml-0.5 min-h-[40px] min-w-[40px] flex items-center justify-center"
            title="새로 작성하기"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </nav>

        {/* Mobile Navigation Controls (< 768px) */}
        <div className="flex md:hidden items-center gap-1" ref={menuRef}>
          {/* 설정 아이콘 */}
          <button
            type="button"
            onClick={onOpenSettings}
            className="relative p-2.5 text-[#4B5563] hover:text-[#1F2937] hover:bg-stone-100 rounded-xl transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
            title="Gemini API 설정"
            aria-label="설정"
          >
            <Settings className="w-5 h-5 text-[#6B7280]" />
            {hasApiKey && (
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white" />
            )}
          </button>

          {/* 모바일 햄버거 메뉴 버튼 */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2.5 text-[#1F2937] hover:bg-stone-100 rounded-xl transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
            title="메뉴 열기"
            aria-label="메뉴 열기"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* 모바일 더보기 드롭다운 */}
          {isMobileMenuOpen && (
            <div className="absolute right-3 top-14 w-56 bg-white border border-[#E5E7EB] rounded-2xl shadow-xl p-2 space-y-1 animate-in fade-in slide-in-from-top-2 duration-150 z-50">
              <button
                type="button"
                onClick={() => {
                  onOpenTemplates();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold text-[#FB7185] hover:bg-[#FFF1F2] transition-colors cursor-pointer min-h-[44px]"
              >
                <div className="flex items-center gap-2">
                  <LayoutTemplate className="w-4 h-4 text-[#FB7185]" />
                  <span>추천 템플릿</span>
                </div>
                <span className="text-[10px] font-bold text-[#FB7185] bg-[#FFE4E6] px-1.5 py-0.5 rounded-full">
                  32개
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onOpenGuide();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold text-[#4B5563] hover:text-[#1F2937] hover:bg-[#F5F3FF] transition-colors cursor-pointer min-h-[44px]"
              >
                <BookOpen className="w-4 h-4 text-[#7C3AED]" />
                <span>5요소 가이드</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onOpenHistory();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold text-[#4B5563] hover:text-[#1F2937] hover:bg-stone-50 transition-colors cursor-pointer min-h-[44px]"
              >
                <div className="flex items-center gap-2">
                  <History className="w-4 h-4 text-[#6B7280]" />
                  <span>히스토리</span>
                </div>
                {historyCount > 0 && (
                  <span className="text-[10px] font-bold text-white bg-[#7C3AED] px-1.5 py-0.5 rounded-full">
                    {historyCount}
                  </span>
                )}
              </button>

              <div className="pt-1 border-t border-[#E5E7EB]">
                <button
                  type="button"
                  onClick={() => {
                    onReset();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-medium text-[#6B7280] hover:text-[#1F2937] hover:bg-stone-50 transition-colors cursor-pointer min-h-[44px]"
                >
                  <RotateCcw className="w-4 h-4 text-[#9CA3AF]" />
                  <span>새로 작성하기</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
