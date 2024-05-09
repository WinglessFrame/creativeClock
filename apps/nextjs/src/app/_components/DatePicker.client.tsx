"use client";

import { Dispatch, SetStateAction } from "react";
import { CalendarIcon } from "@heroicons/react/24/solid";
import { format } from "date-fns";

import { cn } from "@acme/ui";
import { Button } from "@acme/ui/button";
import { Calendar } from "@acme/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@acme/ui/popover";

const DatePicker = ({
  date,
  setDate,
  className,
  noText,
}: {
  date: Date | undefined;
  setDate: Dispatch<SetStateAction<Date | undefined>>;
  className?: string;
  noText?: boolean;
}) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-fit justify-start gap-2 text-left font-normal",
            noText && "p-2",
            !date && "text-muted-foreground",
            className,
          )}
        >
          <CalendarIcon className="size-4" />
          {!noText ? date ? format(date, "P") : <span>Pick a date</span> : null}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
};

export default DatePicker;
