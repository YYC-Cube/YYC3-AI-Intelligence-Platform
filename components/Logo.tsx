/**
 * @fileoverview YYC3 · Logo（大尺寸展示用）
 * @description 统一引用 public/yyc3-icons 官方图标，不再使用外部/虚拟资源。
 */
const BRAND_ICON = '/yyc3-icons/pwa/icon-512x512.png';

interface LogoProps {
  size?: 'sm' | 'default' | 'lg' | 'xl' | 'hero' | 'mega' | 'ultra';
  className?: string;
}

export function Logo({ size = 'default', className = '' }: LogoProps) {
  const sizeConfig = {
    sm: { height: 'h-6' },
    default: { height: 'h-8' },
    lg: { height: 'h-12' },
    xl: { height: 'h-20' },
    hero: { height: 'h-32' },
    mega: { height: 'h-40' },
    ultra: { height: 'h-60' },
  };

  const config = sizeConfig[size];

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <img
        src={BRAND_ICON}
        alt="YYC3"
        className={`${config.height} w-auto object-contain bg-transparent`}
      />
    </div>
  );
}
