import { Suspense, useMemo } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";

import DayPagination from "~/app/_components/TimePage/DayPagination";
import DayTabs from "~/app/_components/TimePage/DayTabs";
import { api } from "~/trpc/server";
import {
  areSameDates,
  getDateSlug,
  getWeekBoundaries,
  getWeekDates,
  parseDateFromParams,
} from "~/utils";

function getDayIndex(weekDates: Date[], currentDate: Date) {
  const currentDay = currentDate.getDay();
  const dayIndex = weekDates.findIndex((date) => date.getDay() === currentDay);
  return dayIndex;
}

function getFullDay(date: Date) {
  const formatter = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
  return formatter.format(date);
}

export default async function TimePage({
  params,
}: {
  params: { slug: string[] | undefined };
}) {
  const parsedDate = parseDateFromParams(params.slug);
  if (!parsedDate) notFound();

  const currentWeekBoundaries = getWeekBoundaries(parsedDate);

  const currentWeekDates = getWeekDates(
    currentWeekBoundaries.startDate,
    currentWeekBoundaries.endDate,
  );

  const currentWeekEntries = await api.timeEntries.getUserTimeEntries({
    from: currentWeekBoundaries.startDate,
    to: currentWeekBoundaries.endDate,
  });

  const selectedDay = {
    date: parsedDate,
    idx: getDayIndex(currentWeekDates, parsedDate),
  };

  const currentDayEntries = currentWeekEntries.filter((entry) =>
    areSameDates(entry.date, selectedDay.date),
  );
  const isSelectedACurrentDate = areSameDates(selectedDay.date, new Date());

  return (
    <>
      <div className="mb-10 flex items-center gap-4">
        <DayPagination selectedDate={selectedDay.date} />
        <h1 className={"text-3xl font-semibold"}>
          {isSelectedACurrentDate && (
            <span className="font-extrabold">Today: </span>
          )}
          {getFullDay(selectedDay.date)}
        </h1>
        {!isSelectedACurrentDate && (
          <Link
            className="underline underline-offset-4"
            href={`/time/${getDateSlug(new Date())}`}
          >
            Return to today
          </Link>
        )}
      </div>
      <DayTabs
        currentWeekEntriesData={currentWeekEntries}
        currentDayEntries={currentDayEntries}
        selectedDayIdx={selectedDay.idx}
      />
    </>
  );
}
