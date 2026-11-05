/**
 * @fileoverview YYC3 · 品牌标识组件
 * @description 全站唯一 Logo 来源：统一引用 public/yyc3-icons 下的官方图标资产，
 *              品牌全称固定为 YanYuCloudCube，产品前缀固定为 "YYC3 ·"。
 */
const BRAND_ICON = '/yyc3-icons/pwa/icon-192x192.png';

interface YYCLogoProps {
  variant?: 'full' | 'short' | 'icon';
  size?: 'small' | 'medium' | 'large' | 'xl';
  className?: string;
  showTagline?: boolean;
}

export function YYCLogo({
  variant = 'full',
  size = 'medium',
  className = '',
  showTagline = false,
}: YYCLogoProps) {
  const textSize = {
    small: 'text-xs',
    medium: 'text-sm',
    large: 'text-base',
    xl: 'text-xl',
  };

  const iconSizes = {
    small: 20,
    medium: 28,
    large: 36,
    xl: 52,
  };

  const iconSize = iconSizes[size];

  return (
    <div className={`flex items-center gap-2 select-none ${className}`}>
      <img
        src={BRAND_ICON}
        alt="YYC3"
        width={iconSize}
        height={iconSize}
        className="rounded-md object-contain"
        loading="eager"
        decoding="async"
      />

      {variant !== 'icon' && (
        <div className="flex flex-col justify-center leading-none">
          <span
            className={`font-bold tracking-tight text-slate-800 dark:text-white ${textSize[size]}`}
          >
            YYC3 ·
          </span>
          {(showTagline || variant === 'full') && size !== 'small' && (
            <span className="text-[0.65em] font-medium text-slate-400 dark:text-slate-500 tracking-widest">
              YanYuCloudCube
            </span>
          )}
        </div>
      )}
    </div>
  );
}
