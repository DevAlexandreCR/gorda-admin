import React from 'react';

export interface AvatarProps {
  /** Image URL. Falls back to initials from `name` when absent. */
  src?: string;
  name?: string;
  /** Named size or px number. @default 'md' */
  size?: 'sm' | 'md' | 'lg' | 'xl' | number;
  /** @default 'circle' */
  rounded?: 'circle' | 'lg' | 'md';
  /** Connection-status dot. */
  status?: 'online' | 'busy' | 'offline' | 'danger';
  style?: React.CSSProperties;
}

/** Gorda avatar — rounded image or initials, optional status dot. */
export function Avatar(props: AvatarProps): JSX.Element;
