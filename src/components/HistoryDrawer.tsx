import React, { useState } from 'react';
import {
  X,
  History,
  Trash2,
  Copy,
  Check,
  Search,
  ArrowUpRight,
} from 'lucide-react';
import { PromptHistoryItem } from '../types/prompt';
import { CATEGORIES } from '../constants/presets';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  history: PromptHistoryItem[];
  onLoadItem: (item: PromptHistoryItem) => void;
  onDeleteItem: (id: string) => void;
  onClearAll: () => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  history,
  onLoadItem,
  onDeleteItem,
  onClearAll,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCat, setSelectedCat] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [confirmClearAll, setConfirmClearAll] = useState<boolean>(false);

  if (!isOpen) return null;

  const filteredHistory = history.filter((item) => {
    const matchesCat = selectedCat === 'all' || item.category === selectedCat;
    const itemResultType = item.resultType || '';
    const itemTopic = item.topic || '';
    const itemKo = item.promptKo || '';
    const itemEn = item.promptEn || '';
    const matchesSearch =
      !searchQuery.trim() ||
      itemTopic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      itemKo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      itemEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      itemResultType.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleCopyEn = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatDate = (timestamp: number) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${month}월 ${day}일 ${hours}:${minutes}`;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-stone-900/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div className="w-screen max-w-lg bg-white border-l border-stone-200 shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-stone-100 bg-stone-50/70 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-violet-50 text-violet-700">
                <History className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-stone-900 text-sm sm:text-base">
                    히스토리
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-violet-50 text-violet-700 border border-violet-100">
                    {history.length}
                  </span>
                </div>
                <p className="text-[11px] text-stone-500 mt-0.5">
                  히스토리는 이 브라우저에만 안전하게 저장됩니다.
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-xl transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search & Category Filter */}
          {history.length > 0 && (
            <div className="p-3.5 border-b border-stone-100 space-y-2 bg-stone-50/40">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="주제 또는 프롬프트 검색..."
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-stone-200 rounded-lg text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-violet-500"
                />
              </div>

              <div className="flex items-center gap-1 overflow-x-auto pb-0.5 text-xs">
                <button
                  type="button"
                  onClick={() => setSelectedCat('all')}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                    selectedCat === 'all'
                      ? 'bg-violet-600 text-white'
                      : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  전체
                </button>
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCat(cat.id)}
                    className={`px-2.5 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                      selectedCat === cat.id
                        ? 'bg-violet-600 text-white'
                        : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-100'
                    }`}
                  >
                    {cat.nameKo.split(' / ')[0]}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* List of Saved Items */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-stone-50/50">
            {filteredHistory.length === 0 ? (
              <div className="py-24 text-center space-y-2 text-stone-400 text-xs px-4">
                <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center mx-auto text-stone-400">
                  <History className="w-5 h-5" />
                </div>
                <p className="font-semibold text-stone-600">
                  {history.length === 0
                    ? '아직 저장된 히스토리가 없습니다.'
                    : '검색 조건에 맞는 히스토리가 없습니다.'}
                </p>
                {history.length === 0 && (
                  <p className="text-[11px] text-stone-400 leading-relaxed">
                    프롬프트가 완성된 후 [ 이대로 사용 ]을 누르면<br />
                    이 브라우저의 히스토리에 보관됩니다.
                  </p>
                )}
              </div>
            ) : (
              filteredHistory.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl bg-white border border-stone-200 hover:border-violet-200 transition-all space-y-2.5 shadow-2xs"
                >
                  {/* Metadata */}
                  <div className="flex items-center justify-between gap-2 flex-wrap text-[11px]">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {item.resultType && (
                        <span className="px-2 py-0.5 rounded-full font-bold bg-violet-50 text-violet-700 border border-violet-100">
                          {item.resultType}
                        </span>
                      )}
                      <span className="px-2 py-0.5 rounded-full font-semibold bg-stone-100 text-stone-600 border border-stone-200">
                        {item.targetAi?.toUpperCase()}
                      </span>
                    </div>
                    <span className="text-[10.5px] text-stone-400 font-mono">
                      {formatDate(item.createdAt)}
                    </span>
                  </div>

                  {/* Title */}
                  <h4 className="text-xs sm:text-sm font-bold text-stone-900 line-clamp-1">
                    {item.topic || '프롬프트'}
                  </h4>

                  {/* Preview */}
                  <p className="text-[11px] text-stone-600 line-clamp-2 leading-relaxed bg-stone-50 p-2.5 rounded-xl border border-stone-100 font-sans">
                    {item.promptKo || item.promptEn}
                  </p>

                  {/* Action Buttons */}
                  <div className="pt-1 flex items-center justify-between gap-2 border-t border-stone-100">
                    <button
                      type="button"
                      onClick={() => {
                        onLoadItem(item);
                        onClose();
                      }}
                      className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-violet-50 hover:bg-violet-100 text-violet-700 flex items-center gap-1 transition-colors cursor-pointer"
                      title="불러오기"
                    >
                      <ArrowUpRight className="w-3.5 h-3.5" />
                      <span>[ 열기 ]</span>
                    </button>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleCopyEn(item.id, item.promptEn)}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer border ${
                          copiedId === item.id
                            ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                            : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200'
                        }`}
                        title="영문 프롬프트 복사"
                      >
                        {copiedId === item.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span>복사됨!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 text-stone-400" />
                            <span>[ 영문 복사 ]</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => onDeleteItem(item.id)}
                        className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 border border-rose-200 transition-colors flex items-center gap-1 cursor-pointer"
                        title="삭제"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>[ 삭제 ]</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {history.length > 0 && (
            <div className="p-3.5 sm:p-4 border-t border-stone-100 bg-white flex items-center justify-between text-xs">
              {confirmClearAll ? (
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-rose-600 font-medium">전체 삭제하시겠습니까?</span>
                  <button
                    type="button"
                    onClick={() => {
                      onClearAll();
                      setConfirmClearAll(false);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold cursor-pointer"
                  >
                    삭제
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmClearAll(false)}
                    className="px-2 py-1 rounded-lg bg-stone-100 text-stone-600 hover:text-stone-900 cursor-pointer"
                  >
                    취소
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmClearAll(true)}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 border border-rose-200 transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>[ 전체 삭제 ]</span>
                </button>
              )}

              <button
                type="button"
                onClick={onClose}
                className="px-4 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold transition-colors cursor-pointer"
              >
                닫기
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
