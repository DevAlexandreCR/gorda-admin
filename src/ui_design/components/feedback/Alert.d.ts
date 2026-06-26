import React from 'react';

export interface AlertProps {
  /** @default 'info' */
  color?: 'primary' | 'info' | 'success' | 'warning' | 'danger' | 'dark';
  title?: string;
  children?: React.ReactNode;
  /** Override the default Font Awesome icon. */
  icon?: string;
  /** Show a dismiss × when provided. */
  onClose?: () => void;
  style?: React.CSSProperties;
}

/** Gorda alert banner — gradient fill, optional dismiss. */
export function Alert(props: AlertProps): JSX.Element;
