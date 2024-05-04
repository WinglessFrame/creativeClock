"use client";

import { forwardRef, useState } from "react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { z } from "zod";

// import { signIn } from "@acme/auth";
import { cn } from "@acme/ui";
import { Button } from "@acme/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@acme/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@acme/ui/form";
import { Label } from "@acme/ui/label";
import { NavigationMenuLink } from "@acme/ui/navigation-menu";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@acme/ui/select";
import { Separator } from "@acme/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@acme/ui/tabs";
import { Textarea } from "@acme/ui/textarea";

import TrackerDialog from "../_components/TrackerDialog";
import { api } from "../../trpc/react";

const formSchema = z.object({
  project: z.string(),
  task: z.string(),
  notes: z.string().optional(),
});

const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function HomePage() {
  const [curRecords, setCurRecords] = useState<
    z.infer<typeof formSchema>[] | null
  >(null);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentDay, setCurrentDay] = useState<(typeof daysOfWeek)[number]>(
    daysOfWeek[0]!,
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setCurRecords((cur) => (cur ? cur.concat(values) : [values]));
    closeForm();
  };

  const closeForm = () => {
    setIsFormOpen(false);
  };

  const projectsQuery = api.timeEntries.getUserCategories.useQuery();

  return (
    <Tabs
      defaultValue="Mon"
      onValueChange={setCurrentDay}
      className="relative mr-auto w-full"
    >
      <div className="flex items-center justify-between pb-3">
        <TabsList className="w-full justify-start gap-6 rounded-none border-b bg-transparent p-0">
          {daysOfWeek.map((item) => (
            <TabsTrigger
              key={item}
              value={item}
              className="relative mb-2 flex w-24 flex-col items-start rounded-none border-b-2 border-b-transparent bg-transparent px-0 font-semibold text-muted-foreground shadow-none transition-none data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
            >
              <span>{item}</span>
              <span className="text-xs">0:00</span>
            </TabsTrigger>
          ))}
          <TabsTrigger
            value="total"
            disabled
            className="relative mb-2 ml-auto flex w-24 flex-col items-end rounded-none border-b-2 border-b-transparent bg-transparent px-0 font-semibold text-muted-foreground shadow-none transition-none data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
          >
            <span>{"Week total"}</span>
            <span className="text-xs">0:00</span>
          </TabsTrigger>
        </TabsList>
      </div>
      <TabsContent value={currentDay} className="relative rounded-md border">
        {curRecords ? (
          <div className="flex flex-col gap-4">
            <ul className="flex flex-col gap-4">
              {curRecords.map((item) => (
                <li>
                  <div className="flex justify-between p-4">
                    <div className="flex flex-col gap-2">
                      <span>{item.project}</span>
                      <span>{item.task}</span>
                      <span>{item.notes}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span>0:00</span>
                      <Button>Edit</Button>
                    </div>
                  </div>
                  <Separator />
                </li>
              ))}
            </ul>
            <TrackerDialog setCurRecords={setCurRecords}>
              {
                <Button
                  className="flex h-80 w-full flex-col gap-4"
                  variant="outline"
                >
                  +
                </Button>
              }
            </TrackerDialog>
          </div>
        ) : (
          <TrackerDialog setCurRecords={setCurRecords}>
            {
              <Button
                className="flex h-80 w-full flex-col gap-4"
                variant="outline"
              >
                <span className="text-3xl">No time tracked today</span>
                <span>Click to add your first record</span>
              </Button>
            }
          </TrackerDialog>
        )}
      </TabsContent>
    </Tabs>
  );
}

const ListItem = forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className,
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
