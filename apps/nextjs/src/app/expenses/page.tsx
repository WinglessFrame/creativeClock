import { Button } from "@acme/ui/button";

export default function ExpensesPage() {
  return (
    <div className="flex flex-col gap-10">
      <Button className="w-fit">+ Track expenses</Button>
      <ul>
        <li>
          <table className="w-full">
            <tbody>
              <tr className="sticky top-[73px] h-12 border-y border-white bg-secondary  text-black">
                <th className="px-4">08 – 14 Apr 2024</th>
                <th />
                <th />
                <th />
                <th />
              </tr>
              <tr className="grid grid-cols-[200px_1fr_100px_150px_auto] items-center border-b-2 [&>td:first-of-type]:pl-4 [&>td]:py-4">
                <td>Mon, 8, 2024</td>
                <td>Random text</td>
                <td>total</td>
                <td>-50</td>
                <td>
                  <Button>Edit</Button>
                </td>
              </tr>
            </tbody>
          </table>
        </li>
      </ul>
    </div>
  );
}
