"use client";

import { useCallback, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { PencilIcon } from "@heroicons/react/24/solid";
import { TrashIcon } from "@heroicons/react/24/solid";
import { RouterOutputs } from "@acme/api";
import { Button } from "@acme/ui/button";
import { Separator } from "@acme/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@acme/ui/tabs";

import {
  areSameDates,
  convertMinutesToHours,
  getDateSlug,
  getShortDay,
  getWeekBoundaries,
  getWeekDates,
  parseDateFromParams,
} from "~/utils";
import TrackerDialog from "../../_components/TimePage/TrackerDialog";
import { api } from "../../../trpc/react";
import { toast } from "@acme/ui/toast";

const DayTabs = ({
  currentWeekEntriesData,
  currentDayEntries,
  selectedDayIdx,
  selectedDay,
  currentWeekBoundaries,
}: {
  currentWeekEntriesData: RouterOutputs["timeEntries"]["getUserTimeEntries"];
  currentDayEntries: RouterOutputs["timeEntries"]["getUserTimeEntries"];
  currentWeekBoundaries: { startDate: Date; endDate: Date };
  selectedDayIdx: number;
  selectedDay: Date;
}) => {
  const router = useRouter();

  const params = useParams() as { slug: string[] };


  const currentWeekDates = useMemo(() => {
    const parsedDate = parseDateFromParams(params.slug);

    if (parsedDate) {
      const weekBoundaries = getWeekBoundaries(parsedDate);

      return getWeekDates(weekBoundaries.startDate, weekBoundaries.endDate);
    }
  }, [params]);

  const deleteTimeEntryMutation = api.timeEntries.deleteTimeEntry.useMutation();
  const getUserEntriesCache = api.useUtils().timeEntries.getUserTimeEntries;

  if (!currentWeekDates) return null;

  const onTabChange = (newDayIdx: string) => {
    const selectedDate = currentWeekDates[Number(newDayIdx)];
    if (!selectedDate) throw new Error("Invalid day index");
    router.push(`/time/${getDateSlug(selectedDate)}`);
  };

  const deleteEntry = async (item: RouterOutputs["timeEntries"]["getUserTimeEntries"][number]) => {
    try {

      deleteTimeEntryMutation.mutateAsync({ id: item.id })
      router.refresh()
      // getUserEntriesCache.setData({ from: currentWeekBoundaries.startDate, to: currentWeekBoundaries.endDate }, (prev) => {
      //   console.log({ prev })
      //   if (prev) {
      //     return prev.filter((entry) => entry.id !== item.id)
      //   }
      // })
    } catch {
      toast.error("Failed to delete entry")
    }
  }

  return (
    <Tabs
      onValueChange={onTabChange}
      value={selectedDayIdx.toString()}
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
        value={selectedDayIdx.toString()}
        className="relative rounded-md border"
      >
        {currentDayEntries?.length ? (
          <div className="flex flex-col gap-4">
            <ul className="flex flex-col">
              {currentDayEntries.map((item) => (
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
                      <Button size="icon"><PencilIcon className="size-4" /></Button>
                      <Button onClick={() => deleteEntry(item)} size="icon" variant="destructive"><TrashIcon className="size-4" /></Button>
                    </div>
                  </div>
                  <Separator />
                </li>
              ))}
            </ul>
            <TrackerDialog day={selectedDay}>
              <Button
                className="mx-auto mb-4 h-12 w-full max-w-44 text-3xl"
                variant="outline"
              >
                +
              </Button>
            </TrackerDialog>
          </div>
        ) : (
          <TrackerDialog day={selectedDay}>
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
  );
};

export default DayTabs;
