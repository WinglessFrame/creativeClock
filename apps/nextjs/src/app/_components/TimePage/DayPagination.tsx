import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@acme/ui/pagination";

import { getDateSlug, getNextDay, getPrevDay } from "~/utils";

const DayPagination = ({ selectedDate }: { selectedDate: Date }) => {
  return (
    <Pagination className="m-0 w-fit">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            className="p-2"
            href={`/time/${getDateSlug(getPrevDay(selectedDate))}`}
          />
        </PaginationItem>
        <PaginationItem>
          <PaginationNext
            className="p-2"
            href={`/time/${getDateSlug(getNextDay(selectedDate))}`}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default DayPagination;
