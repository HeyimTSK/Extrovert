
interface LoadingSpinnerProps {
  white?: boolean;
  size?: 'sm' | 'md';
}

export default function LoadingSpinner({ white = false, size = 'md' }: LoadingSpinnerProps) {
  const sizeClass = size === 'sm' ? 'w-4 h-4' : 'w-[18px] h-[18px]';
  return (
    <span
      className={`${sizeClass} rounded-full inline-block border-2 ${
        white
          ? 'border-white/20 border-t-white'
          : 'border-black/20 border-t-black'
      } animate-spin`}
      role="status"
      aria-label="Loading"
    />
  );
}
