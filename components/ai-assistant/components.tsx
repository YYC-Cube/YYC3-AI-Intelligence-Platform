/**
 * @fileoverview YYC3 AI Assistant - UI 子组件 + 自定义 Hooks
 * @description Adapted from docs/AI-Dev/AIAssistant/components.tsx — v3.0
 * @version 1.0.0
 * @author YYC3 Team
 */
import { useCallback, useEffect, useRef, useState } from 'react';

// ============================================================
// YYCLogo - 统一引用 public/yyc3-icons 官方图标
// ============================================================

export function YYCLogo({ size = 28, className = '' }: { size?: number; className?: string }) {
  return (
    <div
      className={`flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      <img
        src="/yyc3-icons/pwa/icon-192x192.png"
        alt="YYC3"
        width={size}
        height={size}
        className="rounded-md object-contain"
        loading="eager"
        decoding="async"
      />
    </div>
  );
}

// ============================================================
// EmotionRipple - 情感涟漪动画
// ============================================================

export function EmotionRipple({ color, active }: { color: string; active: boolean }) {
  if (!active) {
    return null;
  }
  return (
    <span className="absolute -inset-1 rounded-2xl pointer-events-none" style={{ zIndex: 0 }}>
      <span
        className="absolute inset-0 rounded-2xl animate-ping opacity-30"
        style={{ background: color, animationDuration: '2s' }}
      />
      <span
        className="absolute inset-0 rounded-2xl animate-ping opacity-15"
        style={{ background: color, animationDuration: '2.5s', animationDelay: '0.3s' }}
      />
    </span>
  );
}

// ============================================================
// useSpeechRecognition - Web Speech API 语音识别 Hook
// ============================================================

// Minimal Web Speech API type declarations
interface SpeechRecognitionEvent {
  results: { [index: number]: { [index: number]: { transcript: string } } };
}

interface SpeechRecognitionConstructor {
  new (): SpeechRecognitionInstance;
}

interface SpeechRecognitionInstance {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: () => void;
  onend: () => void;
  start: () => void;
  stop: () => void;
  abort: () => void;
}

export function useSpeechRecognition() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [supported] = useState(
    () =>
      typeof window !== 'undefined' &&
      ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)
  );
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);

  const startListening = useCallback(() => {
    if (!supported) {
      return;
    }
    const Recognition =
      (window as unknown as { webkitSpeechRecognition?: SpeechRecognitionConstructor })
        .webkitSpeechRecognition ||
      (window as unknown as { SpeechRecognition?: SpeechRecognitionConstructor }).SpeechRecognition;
    if (!Recognition) {
      return;
    }
    const recog = new Recognition();
    recog.lang = 'zh-CN';
    recog.continuous = false;
    recog.interimResults = false;
    recog.onresult = (event: SpeechRecognitionEvent) => {
      setTranscript(event.results[0][0].transcript);
      setIsListening(false);
    };
    recog.onerror = () => setIsListening(false);
    recog.onend = () => setIsListening(false);
    recog.start();
    recognitionRef.current = recog;
    setIsListening(true);
  }, [supported]);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setIsListening(false);
  }, []);

  useEffect(() => {
    return () => {
      recognitionRef.current?.abort();
    };
  }, []);

  return { isListening, transcript, supported, startListening, stopListening };
}
