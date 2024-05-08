"use client";

import React, { useMemo } from "react";

import { useTimeContext } from "../../_components/TimePage/timeContext.client";
import { areSameDates, getFullDay, pushDateHistoryState } from "../../../utils";

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
