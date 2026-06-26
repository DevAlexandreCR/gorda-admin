import React from 'react';

export type ButtonColor =
  | 'primary' | 'secondary' | 'info' | 'success'
  | 'warning' | 'danger' | 'dark' | 'light';

export interface ButtonProps {
  /** Theme color. @default 'primary' */
  color?: ButtonColor;
  /** Fill style. @default 'gradient' */
  variant?: 'gradient' | 'solid' | 'outline';
  /** @default 'md' */
  size?: 'sm' | 'md' | 'lg';
  /** Pill (fully rounded) corners. @default false */
  rounded?: boolean;
  /** Stretch to container width. @default false */
  fullWidth?: boolean;
  /** Font Awesome class, e.g. "fas fa-plus". */
  icon?: string;
  /** @default 'left' */
  iconPosition?: 'left' | 'right';
  disabled?: boolean;
  children?: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  style?: React.CSSProperties;
}

/**
 * Gorda primary button — Soft UI Dashboard style.
 * @startingPoint section="Components" subtitle="Gradient buttons in every theme color" viewport="700x220"
 */
export function Button(props: ButtonProps): JSX.Element;
