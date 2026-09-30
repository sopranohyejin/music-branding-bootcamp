'use client';

interface ToastProps {
  message: string;
  visible: boolean;
  type?: 'success' | 'error';
}

export default function Toast({ message, visible, type = 'success' }: ToastProps) {
  const bg = type === 'success' ? 'bg-[#1F2937]' : 'bg-red-600';

  return (
    <div
      aria-live="polite"
      className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl shadow-xl text-white text-sm font-medium transition-all duration-300 ${bg} ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3 pointer-events-none'
      }`}
    >
      {message}
    </div>
  );
}
