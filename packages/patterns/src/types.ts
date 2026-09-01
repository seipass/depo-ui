import type { ReactNode } from 'react';

export type PatternLifecycle = 'trial' | 'stable' | 'deprecated';

export type PatternDefinition = {
  id: string;
  title: string;
  userGoal: string;
  components: readonly string[];
  states: readonly string[];
  recovery: readonly string[];
  responsive: string;
  accessibility: readonly string[];
  lifecycle: PatternLifecycle;
};

export type PatternStatus =
  | 'idle'
  | 'editing'
  | 'loading'
  | 'results'
  | 'empty'
  | 'error'
  | 'submitting'
  | 'success'
  | 'confirm'
  | 'processing'
  | 'undo-window';

export type PatternAction = {
  label: ReactNode;
  onSelect: () => void;
};
