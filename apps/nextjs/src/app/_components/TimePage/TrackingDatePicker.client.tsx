"use client";

import { useCallback } from "react";

import { pushDateHistoryState } from "~/utils";
import DatePicker from "../DatePicker.client";
import { useTimeContext } from "./timeContext.client";

const TrackingDayPicker = () => {
  const { selectedDate, setSelectedDate } = useTimeContext();

  const setDate = useCallback(
    (newDate: Date) => {
      pushDateHistoryState(newDate);
      setSelectedDate(newDate);
    },
    [setSelectedDate],
  );

  return (
    <DatePicker
      noText
      date={selectedDate.date}
      /* @ts-ignore */
      setDate={setDate}
    />
  );
};
export default TrackingDayPicker;
