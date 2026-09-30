'use client';

import { ReactNode } from 'react';

interface MissionCardProps {
  title: string;
  subtitle?: string;
  guide?: string;
  locked?: boolean;
  children?: ReactNode;
}

export default function MissionCard({
  title,
  subtitle,
  guide,
  locked = false,
  children,
}: MissionCardProps) {
  if (locked) {
    return (
      <div
        className="rounded-2xl bg-white opacity-50 p-6"
        style={{ border: '1px solid #E5E7EB' }}
      >
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[#9CA3AF]">🔒</span>
          <h3 className="font-bold text-[#9CA3AF]">{title}</h3>
        </div>
        {subtitle && <p className="text-xs text-[#9CA3AF]">{subtitle}</p>}
        <p className="text-sm text-[#9CA3AF] mt-4">월요일 공개 예정</p>
      </div>
    );
  }

  return (
    <div
      className="rounded-2xl bg-white p-6"
      style={{ border: '1px solid #EFE4B0', boxShadow: '0 1px 4px rgba(7,21,47,0.06)' }}
    >
      <h3 className="font-bold text-base mb-1" style={{ color: '#07152F' }}>{title}</h3>
      {subtitle && <p className="text-sm text-[#6B7280] mb-1">{subtitle}</p>}
      {guide && (
        <div
          className="rounded-xl px-4 py-3 mb-5 mt-3"
          style={{ background: '#FFFBEA', border: '1px solid #EFE4B0' }}
        >
          <p className="text-xs leading-relaxed whitespace-pre-line" style={{ color: '#07152F' }}>{guide}</p>
        </div>
      )}
      {children}
    </div>
  );
}

// Reusable textarea field
interface FieldProps {
  label: string;
  hint?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
  disabled?: boolean;
}

export function TextareaField({
  label,
  hint,
  value,
  onChange,
  placeholder = '입력하세요...',
  rows = 3,
  disabled = false,
}: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5 mb-4">
      <label className="text-sm font-semibold" style={{ color: '#374151' }}>{label}</label>
      {hint && <p className="text-xs text-[#9CA3AF]">{hint}</p>}
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        disabled={disabled}
        className="w-full rounded-xl px-4 py-3 text-sm transition-colors"
        style={{
          border: '1px solid #E5E7EB',
          color: '#07152F',
          background: disabled ? '#F9FAFB' : '#FCFCFD',
        }}
      />
    </div>
  );
}

// Reusable input field
interface InputFieldProps {
  label: string;
  hint?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function InputField({
  label,
  hint,
  value,
  onChange,
  placeholder = '입력하세요...',
  disabled = false,
}: InputFieldProps) {
  return (
    <div className="flex flex-col gap-1.5 mb-4">
      <label className="text-sm font-semibold" style={{ color: '#374151' }}>{label}</label>
      {hint && <p className="text-xs text-[#9CA3AF]">{hint}</p>}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full rounded-xl px-4 py-3 text-sm transition-colors"
        style={{
          border: '1px solid #E5E7EB',
          color: '#07152F',
          background: disabled ? '#F9FAFB' : '#FCFCFD',
        }}
      />
    </div>
  );
}
