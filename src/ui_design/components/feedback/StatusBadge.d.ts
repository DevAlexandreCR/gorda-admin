import React from 'react';

export type ServiceStatus = 'pending' | 'in_progress' | 'terminated' | 'completed' | 'canceled';

export interface StatusBadgeProps {
  /** Service lifecycle status. @default 'pending' */
  status?: ServiceStatus;
  /** Override the auto label. */
  label?: string;
  style?: React.CSSProperties;
}

/** Service lifecycle badge — maps a status to its Gorda color & label with a status dot. */
export function StatusBadge(props: StatusBadgeProps): JSX.Element;
