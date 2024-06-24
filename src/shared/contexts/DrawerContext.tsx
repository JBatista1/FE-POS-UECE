import { createContext, useCallback, useContext, useState } from 'react';

interface IDrawerOptions{
  to: string;
  icon: string;
  label: string;
}

interface IDrawerContextData {
  isDrawerOpen: boolean;
  drawerOptions: IDrawerOptions[];
  setDrawerOptions: (newDrawnoptions: IDrawerOptions[])=> void;
  toggleDrawerOpen: () => void;
}

const DrawerContext = createContext({} as IDrawerContextData);

export const useDrawerContext = () => {
  return useContext(DrawerContext);
};
interface IDrawerProviderProps{
  children: React.ReactNode
}
// eslint-disable-next-line react/prop-types
export const DrawerProvider: React.FC<IDrawerProviderProps> = ({ children }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerOptions, setdrawerOptions] = useState<IDrawerOptions[]>([]);

  const handleSetDrawerOptions = useCallback((newDrawnoptions: IDrawerOptions[]) => {
    setdrawerOptions(newDrawnoptions);
  }, []);
  const toggleDrawerOpen = useCallback(() => {
    setIsDrawerOpen(oldDrawerOpen => !oldDrawerOpen);
  }, []);

  return (
    <DrawerContext.Provider value={{ isDrawerOpen, drawerOptions, toggleDrawerOpen, setDrawerOptions: handleSetDrawerOptions }}>
      {children}
    </DrawerContext.Provider>
  );
};