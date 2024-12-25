import { createContext } from 'react';

export interface IContext {
  instituteId: string
  setInstituteId: (newValue: string) => void
}

export type ProviderProps = {
  children: React.ReactNode;
};

export const AppContext = createContext<IContext | null>(null);