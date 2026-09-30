import React, { useState, useEffect } from 'react';
import {
  X,
  Settings,
  Eye,
  EyeOff,
  RotateCcw,
  Trash2,
  KeyRound,
  ShieldCheck,
} from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiKey: string;
  onSaveKey: (key: string) => void;
  onDeleteKey: () => void;
  isConnected: boolean;
  onTestConnection: (keyToTest: string) => Promise<{ connected: boolean; message: string }>;
}

type ConnectionStatusType = 'connected' | 'not_connected' | 'testing' | 'failed';

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  apiKey,
  onSaveKey,
  onDeleteKey,
  isConnected,
  onTestConnection,
}) => {
  const [inputKey, setInputKey] = useState<string>(apiKey || '');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [statusType, setStatusType] = useState<ConnectionStatusType>(
    isConnected ? 'connected' : 'not_connected'
  );

  useEffect(() => {
    if (isOpen) {
      setInputKey(apiKey || '');
      setStatusType(isConnected ? 'connected' : 'not_connected');
    }
  }, [isOpen, apiKey, isConnected]);

  if (!isOpen) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputKey(val);
    onSaveKey(val);
    if (!val.trim()) {
      setStatusType('not_connected');
    }
  };

  const handleRunTest = async () => {
    const trimmed = inputKey.trim();
    if (!trimmed) {
      setStatusType('failed');
      return;
    }

    setStatusType('testing');
    try {
      const res = await onTestConnection(trimmed);
      if (res.connected) {
        setStatusType('connected');
      } else {
        setStatusType('failed');
      }
    } catch {
      setStatusType('failed');
    }
  };

  const handleDelete = () => {
    setInputKey('');
    onDeleteKey();
    setStatusType('not_connected');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white border border-stone-200 rounded-2xl sm:rounded-3xl w-full max-w-lg max-h-[92vh] flex flex-col shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4 border-b border-stone-100 bg-stone-50/70">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-violet-50 text-violet-700">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-stone-900">Gemini API 설정</h2>
              <p className="text-[11px] sm:text-xs text-stone-500">개인별 Gemini API Key 직접 등록 및 연결 관리</p>
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

        {/* Body */}
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-5 text-xs sm:text-sm text-stone-700 overflow-y-auto">
          {/* API Key Input Section */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-violet-600" />
              <span>Gemini API Key</span>
            </label>

            <div className="relative flex items-center">
              <input
                type={showPassword ? 'text' : 'password'}
                value={inputKey}
                onChange={handleInputChange}
                placeholder="API Key를 입력하세요"
                className="w-full pl-3.5 pr-12 py-3 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 placeholder:text-stone-400 font-mono text-xs sm:text-sm focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/20"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 p-1.5 text-stone-400 hover:text-stone-700 rounded-lg transition-colors cursor-pointer"
                title={showPassword ? '숨기기' : '보기'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <p className="text-[11px] text-stone-500 pl-0.5 pt-0.5 leading-normal">
              API Key는 이 브라우저에만 안전하게 저장됩니다. 공용 기기에서는 사용 후 삭제하세요.
            </p>
          </div>

          {/* Action Row: [ 연결 확인 ] and [ API Key 삭제 ] */}
          <div className="flex flex-wrap items-center justify-between gap-2.5 pt-1">
            <button
              type="button"
              onClick={handleRunTest}
              disabled={statusType === 'testing' || !inputKey.trim()}
              className="px-4 py-2 text-xs sm:text-sm font-bold bg-violet-600 hover:bg-violet-700 text-white rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer disabled:bg-stone-200 disabled:text-stone-400"
            >
              {statusType === 'testing' ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>연결 확인 중...</span>
                </>
              ) : (
                <>
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>연결 확인</span>
                </>
              )}
            </button>

            {inputKey && (
              <button
                type="button"
                onClick={handleDelete}
                className="px-3 py-2 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 border border-rose-200 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>API Key 삭제</span>
              </button>
            )}
          </div>

          {/* Status Display */}
          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-stone-600">연결 상태:</span>

              {statusType === 'connected' && (
                <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Gemini 연결됨</span>
                </span>
              )}

              {statusType === 'not_connected' && (
                <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-medium bg-stone-200/70 text-stone-600">
                  <span className="w-2 h-2 rounded-full bg-stone-400" />
                  <span>연결되지 않음</span>
                </span>
              )}

              {statusType === 'testing' && (
                <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-semibold bg-violet-50 text-violet-700 border border-violet-200">
                  <div className="w-2 h-2 border-2 border-violet-600 border-t-transparent rounded-full animate-spin" />
                  <span>연결 확인 중...</span>
                </span>
              )}

              {statusType === 'failed' && (
                <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  <span>API Key를 확인해주세요.</span>
                </span>
              )}
            </div>
          </div>

          {/* Privacy & Principles Note */}
          <div className="p-3.5 rounded-xl bg-[#FFFBF8] border border-stone-200 text-stone-600 space-y-1.5 text-[11px] leading-relaxed">
            <div className="flex items-center gap-1.5 font-bold text-stone-900 text-xs">
              <ShieldCheck className="w-4 h-4 text-violet-600" />
              <span>보안 및 보관 원칙</span>
            </div>
            <p className="text-[10.5px]">
              • 입력하신 키는 서버나 외부 DB에 영구 저장되지 않으며, 다른 사용자와 공유되지 않습니다.
            </p>
            <p className="text-[10.5px]">
              • 공용 API Key가 아닌 사용자 본인의 Gemini API Key로 모델을 안전하게 호출합니다.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-stone-100 bg-stone-50/50 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 transition-colors cursor-pointer"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
