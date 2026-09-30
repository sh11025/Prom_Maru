import React, { useState } from 'react';
import {
  X,
  LayoutTemplate,
  Search,
  Sparkles,
  ArrowRight,
  FileText,
  Image as ImageIcon,
  Video,
  Volume2,
  Code,
  BarChart3,
} from 'lucide-react';
import { PromptTemplate, TEMPLATES } from '../constants/templates';
import { CATEGORIES } from '../constants/presets';
import { ResultCategory } from '../types/prompt';

interface TemplatesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (template: PromptTemplate) => void;
}

export const TemplatesModal: React.FC<TemplatesModalProps> = ({
  isOpen,
  onClose,
  onSelectTemplate,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  if (!isOpen) return null;

  const filteredTemplates = TEMPLATES.filter((tmpl) => {
    const matchesCategory = selectedCategory === 'all' || tmpl.category === selectedCategory;
    const matchesSearch =
      !searchQuery.trim() ||
      tmpl.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tmpl.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tmpl.starterTopic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tmpl.resultType.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCategoryIcon = (catId: ResultCategory) => {
    switch (catId) {
      case 'document':
        return <FileText className="w-3.5 h-3.5 text-stone-600" />;
      case 'image':
        return <ImageIcon className="w-3.5 h-3.5 text-stone-600" />;
      case 'presentation':
        return <LayoutTemplate className="w-3.5 h-3.5 text-stone-600" />;
      case 'video':
        return <Video className="w-3.5 h-3.5 text-stone-600" />;
      case 'audio':
        return <Volume2 className="w-3.5 h-3.5 text-stone-600" />;
      case 'code':
        return <Code className="w-3.5 h-3.5 text-stone-600" />;
      case 'data':
        return <BarChart3 className="w-3.5 h-3.5 text-stone-600" />;
      case 'other':
      default:
        return <Sparkles className="w-3.5 h-3.5 text-stone-600" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white border border-stone-200 rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-stone-100 bg-stone-50/70">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#FFF2EE] text-[#E76F51]">
              <LayoutTemplate className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-stone-900">추천 템플릿</h2>
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-[#FFF2EE] text-[#D45034] border border-[#FADBD3]">
                  {TEMPLATES.length}개
                </span>
              </div>
              <p className="text-xs text-stone-500">
                원하는 목적에 맞는 템플릿을 선택하면 입력값이 자동으로 채워집니다.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-xl transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="p-4 sm:p-5 border-b border-stone-100 bg-white space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="템플릿 제목, 용도 또는 키워드로 검색..."
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-xl text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/20"
            />
          </div>

          {/* 8 Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            <button
              type="button"
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-violet-600 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200/70 hover:text-stone-900'
              }`}
            >
              전체 ({TEMPLATES.length})
            </button>
            {CATEGORIES.map((cat) => {
              const count = TEMPLATES.filter((t) => t.category === cat.id).length;
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-violet-600 text-white shadow-xs'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200/70 hover:text-stone-900'
                  }`}
                >
                  <span className={isSelected ? 'text-white' : ''}>{getCategoryIcon(cat.id)}</span>
                  <span>{cat.nameKo.split(' / ')[0]}</span>
                  <span className="text-[10px] opacity-75">({count})</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Templates Grid */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-stone-50/50">
          {filteredTemplates.length === 0 ? (
            <div className="py-20 text-center text-stone-400 text-xs sm:text-sm space-y-1">
              <p className="font-semibold text-stone-600">조건에 맞는 템플릿이 없습니다.</p>
              <p className="text-xs text-stone-400">다른 키워드로 검색하거나 전체 탭을 확인해 보세요.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {filteredTemplates.map((template) => {
                const categoryMeta = CATEGORIES.find((c) => c.id === template.category);
                return (
                  <div
                    key={template.id}
                    onClick={() => onSelectTemplate(template)}
                    className="p-4 rounded-2xl bg-white border border-stone-200 hover:border-violet-300 hover:shadow-sm transition-all cursor-pointer flex flex-col justify-between group space-y-2.5"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-stone-100 text-stone-700 border border-stone-200">
                            {getCategoryIcon(template.category)}
                            <span>{categoryMeta?.nameKo.split(' / ')[0]}</span>
                          </span>
                          <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-violet-50 text-violet-700 border border-violet-100">
                            {template.resultType}
                          </span>
                        </div>
                        <span className="text-[10.5px] font-semibold text-stone-500 px-1.5 py-0.5 rounded bg-stone-100 border border-stone-200">
                          {template.targetAi.toUpperCase()}
                        </span>
                      </div>

                      <div>
                        <h3 className="font-bold text-stone-900 text-sm group-hover:text-violet-700 transition-colors">
                          {template.title}
                        </h3>
                        <p className="text-xs text-stone-500 mt-0.5 leading-relaxed">
                          {template.description}
                        </p>
                      </div>

                      <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200/80 text-[11.5px] text-stone-700 line-clamp-2 leading-relaxed font-sans">
                        <span className="text-violet-700 font-semibold mr-1">시작 문구:</span>
                        {template.starterTopic}
                      </div>
                    </div>

                    <div className="flex items-center justify-end text-xs font-semibold text-violet-600 group-hover:text-violet-700 pt-1">
                      <span className="flex items-center gap-1">
                        <span>이 템플릿 사용</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-stone-100 bg-white flex items-center justify-between text-xs text-stone-500">
          <p className="text-[11px] text-stone-400 hidden sm:block">
            템플릿을 선택하면 입력창에 자동 반영되며, 자유롭게 수정한 후 프롬프트를 생성할 수 있습니다.
          </p>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold transition-colors cursor-pointer ml-auto"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
