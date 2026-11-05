import { useEffect, useState } from 'react';
import { logger } from '../utils/logger';

interface PerformanceMetrics {
  fcp: number | null;
  lcp: number | null;
  fid: number | null;
  cls: number | null;
  ttfb: number | null;
}

interface LayoutShift extends PerformanceEntry {
  value: number;
  hadRecentInput: boolean;
}

interface PerformanceMonitorProps {
  enabled?: boolean;
  onMetricsUpdate?: (metrics: PerformanceMetrics) => void;
}

export function PerformanceMonitor({ enabled = true, onMetricsUpdate }: PerformanceMonitorProps) {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fcp: null,
    lcp: null,
    fid: null,
    cls: null,
    ttfb: null,
  });

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') {
      return;
    }

    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();

      entries.forEach((entry) => {
        if (entry.name === 'first-contentful-paint') {
          setMetrics((prev) => ({ ...prev, fcp: entry.startTime }));
        }

        if (entry.entryType === 'largest-contentful-paint') {
          setMetrics((prev) => ({ ...prev, lcp: entry.startTime }));
        }

        if (entry.entryType === 'first-input') {
          const firstInputEntry = entry as PerformanceEventTiming;
          setMetrics((prev) => ({
            ...prev,
            fid: firstInputEntry.processingStart - firstInputEntry.startTime,
          }));
        }

        if (entry.entryType === 'layout-shift') {
          const layoutShiftEntry = entry as LayoutShift;
          if (!layoutShiftEntry.hadRecentInput) {
            setMetrics((prev) => ({
              ...prev,
              cls: (prev.cls || 0) + layoutShiftEntry.value,
            }));
          }
        }

        if (entry.name === 'navigation') {
          const navEntry = entry as PerformanceNavigationTiming;
          setMetrics((prev) => ({
            ...prev,
            ttfb: navEntry.responseStart - navEntry.requestStart,
          }));
        }
      });
    });

    try {
      observer.observe({ type: 'paint', buffered: true });
      observer.observe({ type: 'largest-contentful-paint', buffered: true });
      observer.observe({ type: 'first-input', buffered: true });
      observer.observe({ type: 'layout-shift', buffered: true });
      observer.observe({ type: 'navigation', buffered: true });
    } catch {
      logger.warn('PerformanceObserver not fully supported');
    }

    return () => observer.disconnect();
  }, [enabled]);

  useEffect(() => {
    if (onMetricsUpdate && metrics.fcp !== null) {
      onMetricsUpdate(metrics);
    }
  }, [metrics, onMetricsUpdate]);

  if (!enabled || !isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 z-50 bg-blue-600 text-white p-2 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
        title="Show Performance Metrics"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      </button>
    );
  }

  const getScoreColor = (value: number | null, good: number, needsImprovement: number) => {
    if (value === null) {
      return 'text-gray-400';
    }
    if (value <= good) {
      return 'text-green-400';
    }
    if (value <= needsImprovement) {
      return 'text-yellow-400';
    }
    return 'text-red-400';
  };

  const formatValue = (value: number | null, unit: string = '') => {
    if (value === null) {
      return '--';
    }
    return `${value.toFixed(1)}${unit}`;
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-gray-900 text-white p-4 rounded-lg shadow-xl max-w-sm font-mono text-xs">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-bold text-sm">⚡ Performance</h3>
        <button onClick={() => setIsVisible(false)} className="text-gray-400 hover:text-white">
          ✕
        </button>
      </div>

      <div className="space-y-2">
        <MetricRow
          label="FCP"
          value={formatValue(metrics.fcp, 'ms')}
          color={getScoreColor(metrics.fcp, 1800, 3000)}
          target="≤1.8s"
        />

        <MetricRow
          label="LCP"
          value={formatValue(metrics.lcp, 'ms')}
          color={getScoreColor(metrics.lcp, 2500, 4000)}
          target="≤2.5s"
        />

        <MetricRow
          label="FID"
          value={formatValue(metrics.fid, 'ms')}
          color={getScoreColor(metrics.fid, 100, 300)}
          target="≤100ms"
        />

        <MetricRow
          label="CLS"
          value={formatValue(metrics.cls)}
          color={getScoreColor(metrics.cls, 0.1, 0.25)}
          target="≤0.1"
        />

        <MetricRow
          label="TTFB"
          value={formatValue(metrics.ttfb, 'ms')}
          color={getScoreColor(metrics.ttfb, 800, 1800)}
          target="≤800ms"
        />
      </div>

      <div className="mt-3 pt-3 border-t border-gray-700 text-gray-400 text-[10px]">
        Core Web Vitals (Dev)
      </div>
    </div>
  );
}

interface MetricRowProps {
  label: string;
  value: string;
  color: string;
  target: string;
}

function MetricRow({ label, value, color, target }: MetricRowProps) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-gray-300">{label}</span>
      <div className="flex items-center gap-2">
        <span className={`font-semibold ${color}`}>{value}</span>
        <span className="text-gray-500 text-[9px]">{target}</span>
      </div>
    </div>
  );
}
