"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid";

import { RouterOutputs } from "@acme/api";
import { Button } from "@acme/ui/button";
import { Separator } from "@acme/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@acme/ui/tabs";
import { toast } from "@acme/ui/toast";

import {
  areSameDates,
  convertMinutesToHours,
  getShortDay,
  pushDateHistoryState,
} from "~/utils";
import TrackerDialog from "../../_components/TimePage/TrackerDialog";
import { api } from "../../../trpc/react";
import ProgressBar from "../utils/ProgressBar";
import { useTimeContext } from "./timeContext.client";

const DayTabs = ({
  initialWeekEntriesData: currentWeekEntriesData,
  initialDate,
}: {
  initialWeekEntriesData: RouterOutputs["timeEntries"]["getUserTimeEntries"];
  initialDate: Date;
}) => {
  const router = useRouter();

  const { selectedDate, weekBoundaries, weekDates } = useTimeContext();

  const currentWeekEntriesQuery = api.timeEntries.getUserTimeEntries.useQuery(
    weekBoundaries,
    {
      initialData: () =>
        weekDates.find((date) => areSameDates(date, initialDate)) &&
        currentWeekEntriesData,
    },
  );

  const currentDayTimeEntries = useMemo(
    () =>
      currentWeekEntriesQuery.data?.filter(
        (entry) => entry.date.getDate() === selectedDate.date.getDate(),
      ),
    [currentWeekEntriesQuery.data, selectedDate.date],
  );

  const deleteTimeEntryMutation = api.timeEntries.deleteTimeEntry.useMutation();
  const getUserEntriesCache = api.useUtils().timeEntries.getUserTimeEntries;

  const onTabChange = (newDayIdx: string) => {
    const selectedDate = weekDates[Number(newDayIdx)];
    if (!selectedDate) throw new Error("Invalid day index");
    pushDateHistoryState(selectedDate);
  };

  const deleteEntry = async (
    item: RouterOutputs["timeEntries"]["getUserTimeEntries"][number],
  ) => {
    try {
      await deleteTimeEntryMutation.mutateAsync({ id: item.id });
      getUserEntriesCache.setData(weekBoundaries, (prev) => {
        if (prev) return prev.filter((entry) => entry.id !== item.id);
      });
    } catch {
      toast.error("Failed to delete entry");
    }
  };

  return (
    <Tabs
      onValueChange={onTabChange}
      value={selectedDate.idxWithinTheWeek.toString()}
      className="relative mr-auto w-full"
    >
      <div className="flex items-center justify-between pb-3">
        <TabsList className="w-full justify-start gap-6 rounded-none border-b bg-transparent p-0">
          {weekDates.map((day, idx) => (
            <TabsTrigger
              key={idx}
              value={idx.toString()}
              className="relative mb-2 flex w-24 flex-col items-start rounded-none border-b-2 border-b-transparent bg-transparent px-0 font-semibold text-muted-foreground shadow-none transition-none data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
            >
              <span>{getShortDay(day)}</span>
              <span className="text-xs">
                {currentWeekEntriesQuery.data &&
                currentWeekEntriesQuery.data?.find((item) =>
                  areSameDates(item.date, day),
                )?.timeInMinutes
                  ? convertMinutesToHours(
                      currentWeekEntriesQuery.data?.find?.((item) =>
                        areSameDates(item.date, day),
                      )?.timeInMinutes ?? 0,
                    )
                  : "00:00"}
              </span>
            </TabsTrigger>
          ))}
          <TabsTrigger
            value="total"
            disabled
            className="relative mb-2 ml-auto flex w-24 flex-col items-end rounded-none border-b-2 border-b-transparent bg-transparent px-0 font-semibold text-muted-foreground shadow-none transition-none data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
          >
            <span>{"Week total"}</span>
            <span className="text-xs">
              {currentWeekEntriesData
                ? convertMinutesToHours(
                    currentWeekEntriesData
                      .map((item) => item.timeInMinutes)
                      .reduce((prev, cur) => prev + cur, 0),
                  )
                : "00:00"}
            </span>
          </TabsTrigger>
        </TabsList>
      </div>
      <TabsContent
        value={selectedDate.idxWithinTheWeek.toString()}
        className="relative rounded-md border"
      >
        {currentWeekEntriesQuery.isLoading ? (
          <div className="flex h-80 w-full items-center justify-center">
            <ProgressBar className="h-2 w-1/2" />
          </div>
        ) : currentDayTimeEntries?.length ? (
          <div className="flex flex-col gap-4">
            <ul className="flex flex-col">
              {currentDayTimeEntries.map((item) => (
                <li key={item.id}>
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
                      <span>{convertMinutesToHours(item.timeInMinutes)}</span>
                      <TrackerDialog mode="edit" formValues={item}>
                        <Button size="icon">
                          <PencilIcon className="size-4" />
                        </Button>
                      </TrackerDialog>
                      <Button
                        onClick={() => deleteEntry(item)}
                        size="icon"
                        variant="destructive"
                      >
                        <TrashIcon className="size-4" />
                      </Button>
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
              <span className="text-3xl">No time tracked</span>
              <span>Click to add your first record</span>
            </Button>
          </TrackerDialog>
        )}
      </TabsContent>
    </Tabs>
  );
};

export default DayTabs;
