"use client";

import { createContext, useContext, useMemo, useState } from "react";
import Link from "next/link";

import { Button } from "@acme/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@acme/ui/pagination";
import { Separator } from "@acme/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@acme/ui/tabs";

import TrackerDialog from "../../_components/TrackerDialog";
import { api } from "../../../trpc/react";

function getWeekBoundaries(date: Date) {
  // Calculate start date of the week (Monday)
  let startDate = new Date(date);
  startDate.setDate(date.getDate() - ((date.getDay() + 6) % 7));

  // Set hours, minutes, seconds, and milliseconds to 0
  startDate.setHours(0);
  startDate.setMinutes(0);
  startDate.setSeconds(0);
  startDate.setMilliseconds(0);

  // Calculate end date of the week (Sunday)
  let endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 6);

  // Set hours to 23, minutes to 59, seconds to 59
  endDate.setHours(23);
  endDate.setMinutes(59);
  endDate.setSeconds(59);

  return { startDate, endDate };
}

function areSameDates(date1: Date, date2: Date) {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

function getWeekDates(startDate: Date, endDate: Date) {
  let dates = [];
  let currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
}

function getDayIndex(weekDates: Date[], currentDate: Date) {
  const currentDay = currentDate.getDay();
  const dayIndex = weekDates.findIndex((date) => date.getDay() === currentDay);
  return dayIndex;
}

function getShortDay(date: Date) {
  const formatter = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
  });
  return formatter.format(date);
}

function getFullDay(date: Date) {
  const formatter = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
  return formatter.format(date);
}

type SelectedDateContextValue = {
  selectedDate: Date;
  weekBoundaries: { startDate: Date; endDate: Date };
};
const selectedDateContext = createContext<SelectedDateContextValue | null>(
  null,
);

export const useSelectedDateContext = () => {
  const context = useContext(selectedDateContext);
  if (!context) {
    throw new Error(
      "useSelectedDateContext must be used within a SelectedDateProvider",
    );
  }
  return context;
};

export default function TimePage() {
  const currentWeekBoundaries = useMemo(() => {
    const currentDate = new Date();
    return getWeekBoundaries(currentDate);
  }, []);

  const currentWeekDates = useMemo(() => {
    return getWeekDates(
      currentWeekBoundaries.startDate,
      currentWeekBoundaries.endDate,
    );
  }, []);

  const currentWeekEntriesQuery = api.timeEntries.getUserTimeEntries.useQuery({
    from: currentWeekBoundaries.startDate,
    to: currentWeekBoundaries.endDate,
  });

  const [selectedDay, setSelectedDay] = useState<{ date: Date; idx: number }>(
    () => {
      const today = new Date();
      return {
        date: today,
        idx: getDayIndex(currentWeekDates, today),
      };
    },
  );

  const currentDayEntries = useMemo(() => {
    const entries = currentWeekEntriesQuery.data?.filter(
      (entry) => entry.date.getDay() === selectedDay.date.getDay(),
    );
    return entries;
  }, [selectedDay.date, currentWeekEntriesQuery]);

  const currentDayIndex = useMemo(() => {
    return getDayIndex(currentWeekDates, new Date());
  }, []);

  const onTabChange = (newDayIdx: string) => {
    const selectedDate = currentWeekDates[Number(newDayIdx)];
    if (!selectedDate) {
      throw new Error("Invalid day index");
    }
    setSelectedDay({ date: selectedDate, idx: Number(newDayIdx) });
  };

  return (
    <selectedDateContext.Provider
      value={{
        selectedDate: selectedDay.date,
        weekBoundaries: currentWeekBoundaries,
      }}
    >
      <div className="mb-10 flex items-center gap-4">
        <Pagination className="m-0 w-fit">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious className="p-2" href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext className="p-2" href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
        <h1 className="text-3xl font-semibold">
          {getFullDay(selectedDay.date)}
        </h1>
        {!areSameDates(selectedDay.date, new Date()) && (
          <Link className="underline underline-offset-4" href={"#"}>
            Return to today
          </Link>
        )}
      </div>
      <Tabs
        defaultValue={currentDayIndex.toString()}
        onValueChange={onTabChange}
        value={selectedDay.idx.toString()}
        className="relative mr-auto w-full"
      >
        <div className="flex items-center justify-between pb-3">
          <TabsList className="w-full justify-start gap-6 rounded-none border-b bg-transparent p-0">
            {currentWeekDates.map((day, idx) => (
              <TabsTrigger
                key={idx}
                value={idx.toString()}
                className="relative mb-2 flex w-24 flex-col items-start rounded-none border-b-2 border-b-transparent bg-transparent px-0 font-semibold text-muted-foreground shadow-none transition-none data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
              >
                <span>{getShortDay(day)}</span>
                <span className="text-xs">0:00</span>
              </TabsTrigger>
            ))}
            <TabsTrigger
              value="total"
              disabled
              className="relative mb-2 ml-auto flex w-24 flex-col items-end rounded-none border-b-2 border-b-transparent bg-transparent px-0 font-semibold text-muted-foreground shadow-none transition-none data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
            >
              <span>{"Week total"}</span>
              <span className="text-xs">0:00</span>
            </TabsTrigger>
          </TabsList>
        </div>
        <TabsContent
          value={selectedDay.idx.toString()}
          className="relative rounded-md border"
        >
          {currentDayEntries?.length ? (
            <div className="flex flex-col gap-4">
              <ul className="flex flex-col">
                {currentDayEntries.map((item) => (
                  <li>
                    <div className="flex justify-between p-4">
                      <div className="flex flex-col gap-1">
                        <span className="font-bold">
                          {item.projectCategory.name}
                        </span>
                        <span className="text-sm">
                          {item.projectCategory.project.name}
                        </span>
                        <span className="text-xs">{item.notes}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span>0:00</span>
                        <Button>Edit</Button>
                      </div>
                    </div>
                    <Separator />
                  </li>
                ))}
              </ul>
              <TrackerDialog>
                <Button
                  className="mx-auto mb-4 h-12 w-full max-w-44 text-3xl"
                  variant="outline"
                >
                  +
                </Button>
              </TrackerDialog>
            </div>
          ) : (
            <TrackerDialog>
              <Button
                className="flex h-80 w-full flex-col gap-4"
                variant="outline"
              >
                <span className="text-3xl">No time tracked today</span>
                <span>Click to add your first record</span>
              </Button>
            </TrackerDialog>
          )}
        </TabsContent>
      </Tabs>
    </selectedDateContext.Provider>
  );
}
