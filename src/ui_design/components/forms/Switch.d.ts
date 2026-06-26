import React from 'react';

export interface SwitchProps {
  checked?: boolean;
  onChange?: (next: boolean) => void;
  /** Optional trailing label. */
  label?: string;
  disabled?: boolean;
  id?: string;
  style?: React.CSSProperties;
}

/** Gorda toggle switch — Soft UI form-switch, magenta when on. */
export function Switch(props: SwitchProps): JSX.Element;
