interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  rotated?: boolean;
  className?: string;
}

export default function Logo({
  size = 'md',
  rotated = false,
  className = '',
}: LogoProps) {
  const sizeMap = {
    sm: 'text-xs',
    md: 'text-base',
    lg: 'text-2xl',
    xl: 'text-3xl',
  };

  return (
    <h1
      className={`${sizeMap[size]} ${className}`}
      style={
        rotated
          ? { writingMode: 'vertical-rl', transform: 'rotate(180deg)' }
          : {}
      }
    >
      The Chocolate Milk
    </h1>
  );
}
