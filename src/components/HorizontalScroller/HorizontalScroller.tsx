import React from 'react';
import styled from 'styled-components';

export interface HorizontalScrollerProps {
  children: React.ReactNode;
  /** Gap between items in px. */
  gap?: number;
  className?: string;
}

const Track = styled.div<{ $gap: number }>`
  display: flex;
  align-items: stretch;
  gap: ${({ $gap }) => $gap}px;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scroll-snap-type: x proximity;
  padding-bottom: 4px;

  /* hide scrollbar but keep scrollability */
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }

  & > * {
    scroll-snap-align: start;
    flex: 0 0 auto;
  }
`;

/** Horizontally scrollable row of tiles/cards (the apps' `HorizontalTileSlider`). */
export function HorizontalScroller({
  children,
  gap = 12,
  className,
}: HorizontalScrollerProps) {
  return (
    <Track $gap={gap} className={className}>
      {children}
    </Track>
  );
}
