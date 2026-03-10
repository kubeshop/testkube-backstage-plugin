import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  type ReactNode,
} from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const STORAGE_KEY = 'testkube.orgEnv';

type OrgEnvState = {
  orgIndex: number | null;
  envSlug: string | null;
};

type OrgEnvContextValue = OrgEnvState & {
  setOrgIndex: (index: number | null) => void;
  setEnvSlug: (slug: string | null) => void;
  clear: () => void;
};

const defaultState: OrgEnvState = {
  orgIndex: null,
  envSlug: null,
};

const OrgEnvContext = createContext<OrgEnvContextValue | null>(null);

type OrgEnvProviderProps = {
  children: ReactNode;
};

export const OrgEnvProvider = ({ children }: OrgEnvProviderProps) => {
  const { load, save } = useLocalStorage<OrgEnvState>({
    key: STORAGE_KEY,
    defaultState,
  });

  const [state, setState] = useState<OrgEnvState>(load);

  useEffect(() => {
    save(state);
  }, [save, state]);

  const setOrgIndex = useCallback((index: number | null) => {
    setState(prev => ({
      ...prev,
      orgIndex: index,
      envSlug: null,
    }));
  }, []);

  const setEnvSlug = useCallback((slug: string | null) => {
    setState(prev => ({
      ...prev,
      envSlug: slug,
    }));
  }, []);

  const clear = useCallback(() => {
    setState(defaultState);
  }, []);

  const value = useMemo<OrgEnvContextValue>(
    () => ({
      ...state,
      setOrgIndex,
      setEnvSlug,
      clear,
    }),
    [state, setOrgIndex, setEnvSlug, clear],
  );

  return (
    <OrgEnvContext.Provider value={value}>{children}</OrgEnvContext.Provider>
  );
};

export const useOrgEnv = (): OrgEnvContextValue => {
  const context = useContext(OrgEnvContext);
  if (!context) {
    throw new Error('useOrgEnv must be used within an OrgEnvProvider');
  }
  return context;
};
