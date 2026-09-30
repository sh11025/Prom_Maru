import React, { useState, useEffect } from 'react';
import { X, Play, Copy, Check, RotateCcw, AlertCircle, Sparkles } from 'lucide-react';

interface SimulationModalProps {
  isOpen: boolean;
  onClose: () => void;
  promptEn: string;
  targetAiName: string;
  apiKey?: string;
}

export const SimulationModal: React.FC<SimulationModalProps> = ({
  isOpen,
  onClose,
  promptEn,
  targetAiName,
  apiKey,
}) => {
  const [result, setResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const runSimulation = async () => {
    if (!apiKey || !apiKey.trim()) {
      setError('Gemini API Key가 설정되지 않았습니다. 우측 상단 설정에서 API Key를 먼저 입력해주세요.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setResult('');
    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (apiKey) {
        headers['x-gemini-api-key'] = apiKey;
      }

      const response = await fetch('/api/prom-maru/simulate', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          prompt_en: promptEn,
          target_ai: targetAiName,
          apiKey,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '시뮬레이션 실행에 실패했습니다.');
      }

      const data = await response.json();
      setResult(data.result || '결과가 비어 있습니다.');
    } catch (err: any) {
      console.error('Simulation error:', err);
      setError(err.message || '시뮬레이션 도중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && promptEn) {
      runSimulation();
    }
  }, [isOpen, promptEn]);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white border border-stone-200 rounded-2xl sm:rounded-3xl w-full max-w-3xl max-h-[85vh] flex flex-col shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4 border-b border-stone-100 bg-stone-50/70">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-xl bg-violet-50 text-violet-700">
              <Play className="w-4 h-4 fill-violet-700 text-violet-700" />
            </div>
            <div>
              <h3 className="font-bold text-stone-900 text-sm sm:text-base">
                AI 실행 결과 미리보기
              </h3>
              <p className="text-[11px] text-stone-500">
                작성된 영문 프롬프트를 실제로 AI에 전달했을 때 도출되는 샘플 응답입니다
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

        {/* Body */}
        <div className="p-4 sm:p-6 flex-1 overflow-y-auto space-y-4">
          {isLoading && (
            <div className="py-16 flex flex-col items-center justify-center gap-3 text-center">
              <div className="w-8 h-8 border-3 border-violet-200 border-t-violet-600 rounded-full animate-spin" />
              <p className="text-sm font-medium text-stone-800">
                프롬프트를 실행하여 AI 결과물을 생성하고 있습니다...
              </p>
              <p className="text-xs text-stone-400">
                (타깃 AI의 예상 결과 품질을 미리 확인할 수 있습니다)
              </p>
            </div>
          )}

          {error && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-bold">시뮬레이션 오류:</p>
                <p>{error}</p>
                <button
                  type="button"
                  onClick={runSimulation}
                  className="mt-2 px-3 py-1 bg-rose-600 text-white rounded-lg text-[11px] font-semibold transition-colors cursor-pointer inline-flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>다시 시도하기</span>
                </button>
              </div>
            </div>
          )}

          {!isLoading && !error && result && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-stone-500 pb-1">
                <span className="flex items-center gap-1.5 text-emerald-700 font-semibold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>생성 완료된 AI 샘플 결과</span>
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={runSimulation}
                    className="p-1 text-stone-400 hover:text-stone-700 transition-colors cursor-pointer"
                    title="다시 생성하기"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? '복사됨' : '결과 복사'}</span>
                  </button>
                </div>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-stone-50 border border-stone-200 text-xs sm:text-sm text-stone-800 whitespace-pre-wrap leading-relaxed max-h-[450px] overflow-y-auto font-sans select-text">
                {result}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-stone-100 bg-stone-50/50 flex items-center justify-between">
          <p className="text-[11px] text-stone-500">
            결과물이 마음에 들면 메인 화면에서 [영문 복사] 후 {targetAiName}에 붙여넣으세요!
          </p>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors cursor-pointer"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
