import React from 'react';

export interface CardProps {
  /** Optional header — a string renders as an h6, or pass your own node. */
  header?: React.ReactNode;
  footer?: React.ReactNode;
  /** Body padding. @default '1.5rem' */
  padding?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  bodyStyle?: React.CSSProperties;
}

/**
 * Gorda card — white rounded surface with the signature soft shadow.
 * @startingPoint section="Components" subtitle="The base surface for every panel" viewport="700x240"
 */
export function Card(props: CardProps): JSX.Element;
