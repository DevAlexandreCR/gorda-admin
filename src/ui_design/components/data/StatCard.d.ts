import React from 'react';

export interface StatCardProps {
  label: string;
  value: React.ReactNode;
  /** Font Awesome class for the icon chip. */
  icon?: string;
  /** Gradient color of the icon chip. @default 'dark' */
  color?: 'primary' | 'info' | 'success' | 'warning' | 'danger' | 'dark';
  /** Delta value, e.g. "12%". */
  delta?: string;
  /** @default true */
  deltaUp?: boolean;
  style?: React.CSSProperties;
}

/** Gorda stat card — KPI tile with gradient icon chip. */
export function StatCard(props: StatCardProps): JSX.Element;
