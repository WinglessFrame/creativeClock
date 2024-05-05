import { Button } from "@acme/ui/button";
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

const invoices = [
  {
    invoice: "INV001",
    paymentStatus: "Paid",
    amount: 250.1,
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV002",
    paymentStatus: "Pending",
    amount: 250.1,
    paymentMethod: "PayPal",
  },
  {
    invoice: "INV003",
    paymentStatus: "Unpaid",
    amount: 250.1,
    paymentMethod: "Bank Transfer",
  },
  {
    invoice: "INV004",
    paymentStatus: "Paid",
    amount: 250.1,
    paymentMethod: "Credit Card",
  },
];

export default function ExpensesPage() {
  return (
    <div className=" flex flex-col gap-10">
      <ExpensesDialog>
        <Button className="w-fit">+ Track expenses</Button>
      </ExpensesDialog>

      <ul>
        <li>
          <Table>
            <TableHeader>
              <TableRow className="sticky top-0">
                <TableHead colSpan={5}>08 – 14 Apr 2024</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((invoice) => (
                <TableRow key={invoice.invoice}>
                  <TableCell className="font-medium">
                    {invoice.invoice}
                  </TableCell>
                  <TableCell>{invoice.paymentStatus}</TableCell>
                  <TableCell>{invoice.paymentMethod}</TableCell>
                  <TableCell className="text-right">
                    €{formatMoneyInput(invoice.amount)}
                  </TableCell>
                  <TableCell className="text-right">
                    <ExpensesDialog>
                      <Button>Edit</Button>
                    </ExpensesDialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={3}>Total</TableCell>
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
