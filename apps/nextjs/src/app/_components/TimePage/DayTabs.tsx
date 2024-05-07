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
}: {
  initialWeekEntriesData: RouterOutputs["timeEntries"]["getUserTimeEntries"];
}) => {
  const router = useRouter();

  const { selectedDate, weekBoundaries, weekDates } = useTimeContext();

  const currentWeekEntriesQuery = api.timeEntries.getUserTimeEntries.useQuery(
    weekBoundaries,
    {
      initialData: currentWeekEntriesData,
    },
  );

  const initialLoadRef = useRef(true);

  /* Currently working solution. Skipping first load refetch.
  On every week change it refetches week entries. i would like to
  avoid that if possible and only fetch new weeks
  
  P.S. i shows progress bar on initial render only cuz we're in strict mode*/
  useEffect(() => {
    if (!initialLoadRef.current) currentWeekEntriesQuery.refetch();
    else initialLoadRef.current = false;
  }, [weekBoundaries.from.getDate()]);

  const currentDayTimeEntries = useMemo(
    () =>
      currentWeekEntriesQuery.data.filter(
        (entry) => entry.date.getDate() === selectedDate.date.getDate(),
      ),
    [currentWeekEntriesQuery.data, selectedDate.date],
  );

  //TODO check if it is possible to query only if there is no key in cache.
  // I tried this, but the key was already in cache, despite there is no data
  // This is why somehow it does not initially fetch the query. it thinks it
  // is already fetch and the only option for now is refetch as i did above

  // We need to investigate why we're getting empty data in initial fetch

  /*  useEffect(() => {
    const queryKeyInputs = queryClient
      .getQueryCache()
      .getAll()
      .map((cache) => {
        const inputKey = cache.queryKey[1] as undefined | { input: unknown };
        if (inputKey?.input) return inputKey.input;
      })
      .filter(Boolean);

    console.log(queryKeyInputs, weekBoundaries);

    if (
      !queryKeyInputs.some(
        (item) => item.from.getTime() === weekBoundaries.from.getTime(),
      )
    ) {
      currentWeekEntriesQuery.refetch();
    }
  }, [weekBoundaries.from.getDate()]); */

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
      deleteTimeEntryMutation.mutateAsync({ id: item.id });
      router.refresh();
      // getUserEntriesCache.setData({ from: currentWeekBoundaries.startDate, to: currentWeekBoundaries.endDate }, (prev) => {
      //   console.log({ prev })
      //   if (prev) {
      //     return prev.filter((entry) => entry.id !== item.id)
      //   }
      // })
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
                {currentWeekEntriesData.find((item) =>
                  areSameDates(item.date, day),
                )?.timeInMinutes
                  ? convertMinutesToHours(
                      currentWeekEntriesData.find((item) =>
                        areSameDates(item.date, day),
                      )!.timeInMinutes!,
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
        {currentWeekEntriesQuery.isRefetching ? (
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
                      <Button size="icon">
                        <PencilIcon className="size-4" />
                      </Button>
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
