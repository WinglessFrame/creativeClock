import { createContext, useContext } from "react";

type SelectedDateContextValue = {
  selectedDate: Date;
  idx: number;
};
export const SelectedDateContext =
  createContext<SelectedDateContextValue | null>(null);

export const useSelectedDateContext = () => {
  const context = useContext(SelectedDateContext);
  if (!context) {
    throw new Error(
      "useSelectedDateContext must be used within a SelectedDateProvider",
    );
  }
  return context;
};
