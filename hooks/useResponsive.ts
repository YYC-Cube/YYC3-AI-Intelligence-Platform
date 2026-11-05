/**
 * @fileoverview YYC3 useResponsive Hook
 * @description Shared responsive breakpoint detection hook replacing duplicate resize listeners
 * @audit-fix [C3-FIX] — Extracted duplicated resize logic from HomeMode and YYCEnterpriseLayout
 * @audit-phase P1
 * @audit-date 2026-04-21
 * @version 1.0.0
 * @author YYC3 Team
 */
import { useEffect, useState } from 'react';

export function useResponsive(breakpoint = 1024): boolean {
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth < breakpoint : false
  );

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < breakpoint);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [breakpoint]);

  return isMobile;
}
