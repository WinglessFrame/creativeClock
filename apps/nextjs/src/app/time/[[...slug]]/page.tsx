import { notFound } from "next/navigation";

import DayPagination from "~/app/_components/TimePage/DayPagination";
import DayTabs from "~/app/_components/TimePage/DayTabs";
import NavigationEvents from "~/app/_components/TimePage/NavigationEvents";
import TrackerViewModePicker from "~/app/_components/TimePage/TrackerViewModePicker";
import TrackingDayPicker from "~/app/_components/TimePage/TrackingDatePicker.client";
import { api } from "~/trpc/server";
import { getWeekBoundaries, parseDateFromParams } from "~/utils";
import { TimeContextProvider } from "../../_components/TimePage/timeContext.client";
import { CurrentDayLink } from "./currentDayLink.client";

export default async function TimePage({
  params,
}: {
  params: { slug: string[] | undefined };
}) {
  const parsedDate = parseDateFromParams(params.slug);
  if (!parsedDate) notFound();

  const currentWeekBoundaries = getWeekBoundaries(parsedDate);

  const currentWeekEntries = await api.timeEntries.getUserTimeEntries(
    currentWeekBoundaries,
  );

  return (
    <TimeContextProvider initialDate={parsedDate}>
      <div className="mb-10 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <DayPagination />
          <CurrentDayLink />
        </div>
        <div className="flex items-center gap-4">
          <TrackingDayPicker />
          <TrackerViewModePicker mode="days" />
        </div>
      </div>
      <DayTabs
        initialDate={parsedDate}
        initialWeekEntriesData={currentWeekEntries}
      />
      <NavigationEvents />
    </TimeContextProvider>
  );
}
