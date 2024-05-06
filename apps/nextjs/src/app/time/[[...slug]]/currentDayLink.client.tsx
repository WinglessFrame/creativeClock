"use client"

import Link from 'next/link'
import React, { useMemo } from 'react'
import { areSameDates, getDateSlug } from '../../../utils'
import { useTimeContext } from '../../_components/TimePage/timeContext.client'

function getFullDay(date: Date) {
  const formatter = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
  return formatter.format(date);
}

export const CurrentDayLink = () => {
  const { selectedDate } = useTimeContext()
  const isSelectedACurrentDate = useMemo(() => areSameDates(selectedDate.date, new Date()), [selectedDate.date]);
  return (
    <>
      <h1 className={"text-3xl font-semibold"}>
        {isSelectedACurrentDate && (
          <span className="font-extrabold">Today: </span>
        )}
        {getFullDay(selectedDate.date)}
      </h1>
      {!isSelectedACurrentDate && (
        <Link
          className="underline underline-offset-4"
          href={`/time/${getDateSlug(new Date())}`}
        >
          Return to today
        </Link>
      )}
    </>
  )
}
