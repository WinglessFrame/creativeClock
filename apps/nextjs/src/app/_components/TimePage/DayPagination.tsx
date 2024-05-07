"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";

import { cn } from "@acme/ui";
import { Button, buttonVariants } from "@acme/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@acme/ui/pagination";

import {
  getDateSlug,
  getNextDay,
  getPrevDay,
  pushDateHistoryState,
} from "~/utils";
import { useTimeContext } from "./timeContext.client";

const DayPagination = () => {
  const { selectedDate } = useTimeContext();
  return (
    <Pagination className="m-0 w-fit">
      <PaginationContent>
        <PaginationItem>
          <Button
            className={cn(buttonVariants({ variant: "default" }), "p-2")}
            onClick={() => {
              pushDateHistoryState(getPrevDay(selectedDate.date));
            }}
          >
            <ChevronLeftIcon />
          </Button>
        </PaginationItem>
        <PaginationItem>
          <Button
            className={cn(buttonVariants({ variant: "default" }), "p-2")}
            onClick={() => {
              pushDateHistoryState(getNextDay(selectedDate.date));
            }}
          >
            <ChevronRightIcon />
          </Button>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default DayPagination;
