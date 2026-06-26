import React from 'react';

export interface SelectOption { value: string; label: string; }

export interface SelectProps {
  label?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  /** Array of strings or {value,label} objects. */
  options?: Array<string | SelectOption>;
  placeholder?: string;
  disabled?: boolean;
  id?: string;
  style?: React.CSSProperties;
}

/** Gorda select — Soft UI styled native dropdown with label. */
export function Select(props: SelectProps): JSX.Element;
