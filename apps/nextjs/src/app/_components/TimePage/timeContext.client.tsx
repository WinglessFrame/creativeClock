"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { TimeBoundaries } from "@acme/api";

import { api } from "~/trpc/react";
import {
  getDayIndex,
  getNextDay,
  getPrevDay,
  getWeekBoundaries,
  getWeekDates,
  isFirstWeekDay,
  isLastWeekDay,
} from "../../../utils";

type TimeContextType = {
  selectedDate: { date: Date; idxWithinTheWeek: number };
  setSelectedDate: React.Dispatch<React.SetStateAction<Date>>;
  weekBoundaries: TimeBoundaries;
  weekDates: Date[];
};
const timeContext = createContext<TimeContextType | null>(null);

export const useTimeContext = () => {
  const context = useContext(timeContext);
  if (!context) {
    throw new Error("useTimeContext must be used within a TimeContextProvider");
  }
  return context;
};

export const getDayInTheWeekEntry = (date: Date) => {
  const weekBoundaries = getWeekBoundaries(date);
  const weekDates = getWeekDates(weekBoundaries.from, weekBoundaries.to);
  const idxWithinTheWeek = getDayIndex(weekDates, date);
  return idxWithinTheWeek;
};

export const TimeContextProvider = ({
  children,
  initialDate,
}: {
  children: React.ReactNode;
  initialDate: Date;
}) => {
  const [selectedDate, _setSelectedDate] = useState<
    TimeContextType["selectedDate"]
  >({
    date: initialDate,
    idxWithinTheWeek: getDayInTheWeekEntry(initialDate),
  });

  const getUserEntriesCache = api.useUtils().timeEntries.getUserTimeEntries;

  useEffect(() => {
    if (isFirstWeekDay(selectedDate.idxWithinTheWeek)) {
      const prevDay = getPrevDay(selectedDate.date);
      getUserEntriesCache.prefetch(getWeekBoundaries(prevDay));
    }
    if (isLastWeekDay(selectedDate.idxWithinTheWeek)) {
      const nextDay = getNextDay(selectedDate.date);
      getUserEntriesCache.prefetch(getWeekBoundaries(nextDay));
    }
  }, [selectedDate.idxWithinTheWeek]);

  const { currentWeekDates, weekBoundaries } = useMemo(() => {
    const weekBoundaries = getWeekBoundaries(selectedDate.date);
    const currentWeekDates = getWeekDates(
      weekBoundaries.from,
      weekBoundaries.to,
    );
    return {
      weekBoundaries,
      currentWeekDates,
    };
  }, [selectedDate.date]);

  const setSelectedDate = useCallback<TimeContextType["setSelectedDate"]>(
    (updater) => {
      _setSelectedDate((prev) => {
        const newDate =
          typeof updater === "function" ? updater(prev.date) : updater;
        const newWeekIdx = getDayInTheWeekEntry(newDate);
        return {
          date: newDate,
          idxWithinTheWeek: newWeekIdx,
        };
      });
    },
    [],
  );

  const value = useMemo<TimeContextType>(
    () => ({
      selectedDate,
      setSelectedDate,
      weekBoundaries,
      weekDates: currentWeekDates,
    }),
    [selectedDate, weekBoundaries, currentWeekDates],
  );

  return <timeContext.Provider value={value}>{children}</timeContext.Provider>;
};
