"use client";

import React, { useMemo } from "react";
import Link from "next/link";

import { useTimeContext } from "../../_components/TimePage/timeContext.client";
import {
  areSameDates,
  getDateSlug,
  pushDateHistoryState,
} from "../../../utils";

function getFullDay(date: Date) {
  const formatter = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
  return formatter.format(date);
}

export const CurrentDayLink = () => {
  const { selectedDate } = useTimeContext();
  const isSelectedACurrentDate = useMemo(
    () => areSameDates(selectedDate.date, new Date()),
    [selectedDate.date],
  );
  return (
    <>
      <h1 className={"text-3xl font-semibold"}>
        {isSelectedACurrentDate && (
          <span className="font-extrabold">Today: </span>
        )}
        {getFullDay(selectedDate.date)}
      </h1>
      {!isSelectedACurrentDate && (
        <span
          className="underline underline-offset-4"
          onClick={() => {
            pushDateHistoryState(new Date());
          }}
        >
          Return to today
        </span>
      )}
    </>
  );
};
