"use client"
import { cn } from "@acme/ui";
import { buttonVariants } from "@acme/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@acme/ui/pagination";

import { getDateSlug, getNextDay, getPrevDay } from "~/utils";
import { useTimeContext } from "./timeContext.client";

const DayPagination = () => {
  const { selectedDate } = useTimeContext()
  return (
    <Pagination className="m-0 w-fit">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            className={cn(buttonVariants({ variant: "outline" }), "p-2")}
            href={`/time/${getDateSlug(getPrevDay(selectedDate.date))}`}
          />
        </PaginationItem>
        <PaginationItem>
          <PaginationNext
            className={cn(buttonVariants({ variant: "outline" }), "p-2")}
            href={`/time/${getDateSlug(getNextDay(selectedDate.date))}`}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default DayPagination;
