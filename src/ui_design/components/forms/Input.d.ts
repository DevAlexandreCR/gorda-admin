import React from 'react';

export interface InputProps {
  /** Field label shown above the input. */
  label?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  /** @default 'text' */
  type?: string;
  /** Font Awesome class for a leading icon. */
  icon?: string;
  /** Error message — turns border red and shows text below. */
  error?: string;
  disabled?: boolean;
  id?: string;
  style?: React.CSSProperties;
}

/** Gorda text input — Soft UI field with magenta focus glow. */
export function Input(props: InputProps): JSX.Element;
