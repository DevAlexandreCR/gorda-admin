import React from 'react';

export type BadgeColor = 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'danger' | 'dark' | 'light';

export interface BadgeProps {
  /** @default 'primary' */
  color?: BadgeColor;
  /** Soft tint or full solid fill. @default 'soft' */
  variant?: 'soft' | 'solid';
  /** Pill corners. @default false */
  rounded?: boolean;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

/** Gorda badge — small uppercase pill in soft-tint or solid. */
export function Badge(props: BadgeProps): JSX.Element;
