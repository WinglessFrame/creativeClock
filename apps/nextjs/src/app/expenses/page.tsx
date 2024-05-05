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

import formatMoneyInput from "~/utils/formatMoneyInput";
import ExpensesDialog from "../_components/ExpensesDialog";
import Clip from "../_components/Icons/Clip";

const invoices = [
  {
    date: "Mon, 08 Apr",
    project: "CreativeIT",
    category: "Moving",
    amount: 250.1,
    notes: "Testtetsadsadasdas",
    receipt: "",
  },
  {
    date: "Mon, 08 Apr",
    project: "CreativeIT",
    category: "Moving",
    amount: 250.1,
    notes: "Testtetsadsadasdas",
    receipt: "test",
  },
  {
    date: "Mon, 08 Apr",
    project: "CreativeIT",
    category: "Moving",
    amount: 250.1,
    notes: "Testtetsadsadasdas",
    receipt: "",
  },
  {
    date: "Mon, 08 Apr",
    project: "CreativeIT",
    category: "Moving",
    amount: 250.1,
    notes: "Testtetsadsadasdas",
    receipt: "",
  },
];

const period = "08 – 14 Apr 2024";

export default function ExpensesPage() {
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
              {invoices.map((invoice) => (
                <TableRow key={invoice.date}>
                  <TableCell className="font-medium">{invoice.date}</TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <span className="font-bold">{invoice.project}</span>
                      <span className="text-sm">{invoice.category}</span>
                      <span className="text-xs">{invoice.notes}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    €{formatMoneyInput(invoice.amount)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-4">
                      {invoice.receipt && (
                        <Button>
                          <Clip className="w-4" />
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
                    invoices.reduce((prev, cur) => prev + cur.amount, 0),
                  )}
                </TableCell>
                <TableCell />
              </TableRow>
            </TableFooter>
          </Table>
        </li>
        <li>
          <Table>
            <TableHeader>
              <TableRow className="sticky top-0">
                <TableHead colSpan={5}>{period}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((invoice) => (
                <TableRow key={invoice.date}>
                  <TableCell className="font-medium">{invoice.date}</TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <span className="font-bold">{invoice.project}</span>
                      <span className="text-sm">{invoice.category}</span>
                      <span className="text-xs">{invoice.notes}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    €{formatMoneyInput(invoice.amount)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-4">
                      {invoice.receipt && (
                        <Button>
                          <Clip className="w-4" />
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
                    invoices.reduce((prev, cur) => prev + cur.amount, 0),
                  )}
                </TableCell>
                <TableCell />
              </TableRow>
            </TableFooter>
          </Table>
        </li>
        <li>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead colSpan={5}>{period}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((invoice) => (
                <TableRow key={invoice.date}>
                  <TableCell className="font-medium">{invoice.date}</TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <span className="font-bold">{invoice.project}</span>
                      <span className="text-sm">{invoice.category}</span>
                      <span className="text-xs">{invoice.notes}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    €{formatMoneyInput(invoice.amount)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-4">
                      {invoice.receipt && (
                        <Button>
                          <Clip className="w-4" />
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
                    invoices.reduce((prev, cur) => prev + cur.amount, 0),
                  )}
                </TableCell>
                <TableCell />
              </TableRow>
            </TableFooter>
          </Table>
        </li>
        <li>
          <Table>
            <TableHeader>
              <TableRow className="sticky top-0">
                <TableHead colSpan={5}>{period}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((invoice) => (
                <TableRow key={invoice.date}>
                  <TableCell className="font-medium">{invoice.date}</TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <span className="font-bold">{invoice.project}</span>
                      <span className="text-sm">{invoice.category}</span>
                      <span className="text-xs">{invoice.notes}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    €{formatMoneyInput(invoice.amount)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-4">
                      {invoice.receipt && (
                        <Button>
                          <Clip className="w-4" />
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
                    invoices.reduce((prev, cur) => prev + cur.amount, 0),
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
