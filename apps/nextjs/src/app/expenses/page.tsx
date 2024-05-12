import { PaperClipIcon } from "@heroicons/react/24/solid";

import { Button } from "@acme/ui/button";
import { Separator } from "@acme/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@acme/ui/table";

import { api } from "~/trpc/server";
import { getFullDay, getWeekBoundaries } from "~/utils";
import formatMoneyInput from "~/utils/formatMoneyInput";
import ExpensesDialog from "../_components/ExpensesPage/ExpensesDialog";

const period = "08 – 14 Apr 2024";

export default async function ExpensesPage() {
  const userExpenses = await api.expenses.getUserExpenses();

  return (
    <div className=" flex flex-col gap-10">
      <ExpensesDialog>
        <Button className="w-fit">+ Track expenses</Button>
      </ExpensesDialog>
      <ul className="flex flex-col gap-20">
        <li>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead colSpan={5}>{period}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {userExpenses.map((expense) => (
                <TableRow key={expense.id}>
                  <TableCell className="font-medium">
                    {getFullDay(expense.date)}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <span className="font-bold">
                        {expense.projectExpenseCategory.project.name}
                      </span>
                      <span className="text-sm">
                        {expense.projectExpenseCategory.name}
                      </span>
                      <span className="text-xs">{expense.notes}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    €{formatMoneyInput(expense.amount)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-4">
                      {expense.receipt && (
                        <Button>
                          <PaperClipIcon className="w-4" />
                        </Button>
                      )}
                      <ExpensesDialog>
                        <Button>Edit</Button>
                      </ExpensesDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={2}>Total</TableCell>
                <TableCell className="text-right">
                  €
                  {formatMoneyInput(
                    userExpenses.reduce((prev, cur) => prev + cur.amount, 0),
                  )}
                </TableCell>
                <TableCell />
              </TableRow>
            </TableFooter>
          </Table>
        </li>
      </ul>
    </div>
  );
}
