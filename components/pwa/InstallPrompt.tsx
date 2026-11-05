import { useEffect, useState } from 'react';
import { logger } from '../../utils/logger';

interface InstallPromptProps {
  className?: string;
}

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function InstallPrompt({ className = '' }: InstallPromptProps) {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      return;
    }

    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      logger.info('User accepted the install prompt');
    } else {
      logger.info('User dismissed the install prompt');
    }

    setDeferredPrompt(null);
    setIsInstallable(false);
  };

  if (!isInstallable || isInstalled) {
    return null;
  }

  return (
    <div
      className={`fixed bottom-20 right-4 z-50 flex items-center gap-3 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-3 text-white shadow-xl ${className}`}
    >
      <div className="flex flex-col">
        <span className="text-sm font-bold">Install YYC3 · AI App</span>
        <span className="text-xs opacity-90">Get offline access & faster experience</span>
      </div>
      <button
        onClick={handleInstallClick}
        className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-blue-600 transition-all hover:bg-blue-50 hover:shadow-md"
      >
        Install
      </button>
      <button
        onClick={() => setIsInstallable(false)}
        className="ml-1 rounded-full p-1 text-white/80 transition-colors hover:bg-white/20 hover:text-white"
        aria-label="Dismiss install prompt"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>
  );
}

export default InstallPrompt;
