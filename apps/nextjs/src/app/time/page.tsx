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
import { Input } from "@acme/ui/input";
import { Label } from "@acme/ui/label";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@acme/ui/navigation-menu";
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

const formSchema = z.object({
  project: z.string(),
  task: z.string(),
  notes: z.string().optional(),
});

export default function HomePage() {
  const [curRecords, setCurRecords] = useState<
    z.infer<typeof formSchema>[] | null
  >(null);

  const [isFormOpen, setIsFormOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setCurRecords((cur) => (cur ? cur.concat(values) : [values]));
    closeForm();
  };

  const openForm = () => {
    setIsFormOpen(true);
  };
  const closeForm = () => {
    setIsFormOpen(false);
  };

  return (
    <>
      <header className="flex items-center justify-between py-4">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link href="/time" legacyBehavior passHref>
                <NavigationMenuLink
                  active
                  className={navigationMenuTriggerStyle()}
                >
                  Time
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/expenses" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Expenses
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        <div>
          <span className="h-10 w-10 rounded-full bg-slate-100" />
        </div>
      </header>
      <main className="container h-screen py-16">
        <Tabs defaultValue="Mon" className="relative mr-auto w-full">
          <div className="flex items-center justify-between pb-3">
            <TabsList className="w-full justify-start gap-6 rounded-none border-b bg-transparent p-0">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((item) => (
                <TabsTrigger
                  key={item}
                  value={item}
                  className="relative h-9 w-24 rounded-none border-b-2 border-b-transparent bg-transparent px-4 pb-7  pt-2 font-semibold text-muted-foreground shadow-none transition-none data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
                >
                  <div className="flex flex-col items-start gap-1">
                    <span>{item}</span>
                    <span className="text-xs">0:00</span>
                  </div>
                </TabsTrigger>
              ))}
              <TabsTrigger
                value="total"
                disabled
                className="relative ml-auto h-9 rounded-none border-b-2 border-b-transparent bg-transparent px-4 pb-7  pt-2 font-semibold text-muted-foreground shadow-none transition-none data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
              >
                <div className="flex flex-col items-start gap-1">
                  <span>{"Week total"}</span>
                  <span className="text-xs">0:00</span>
                </div>
              </TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value={"Mon"} className="relative rounded-md border">
            {curRecords ? (
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
            ) : (
              <div className="flex h-80 items-center justify-between ">
                <Dialog
                  modal={false}
                  open={isFormOpen}
                  onOpenChange={setIsFormOpen}
                >
                  <DialogTrigger asChild>
                    <Button
                      className="flex h-full w-full flex-col gap-4"
                      variant="outline"
                    >
                      <span className="text-3xl">No time tracked today</span>
                      <span>Click to add your first record</span>
                    </Button>
                  </DialogTrigger>

                  <DialogContent className="sm:max-w-[800px]">
                    <DialogHeader>
                      <DialogTitle>Track time</DialogTitle>
                      <DialogDescription>
                        Make changes to your profile here. Click save when
                        you're done.
                      </DialogDescription>
                    </DialogHeader>
                    <Form {...form}>
                      <form
                        id="form"
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="grid items-center gap-4 py-4"
                      >
                        <FormField
                          control={form.control}
                          name="project"
                          render={({ field }) => (
                            <FormItem className="grid grid-cols-4 items-center gap-4">
                              <FormLabel className="text-right">
                                Project
                              </FormLabel>
                              <FormControl>
                                <Select
                                  onValueChange={field.onChange}
                                  value={field.value}
                                >
                                  <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Select type of task" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectGroup className="px-2">
                                      <SelectLabel>CreativeIT</SelectLabel>
                                      {[
                                        "afsasdsadsa",
                                        "asfsadasd",
                                        "asfdsadasd",
                                      ].map((item) => (
                                        <SelectItem
                                          key={`0_${item}`}
                                          className="ml-2"
                                          value={item}
                                        >
                                          {item}
                                        </SelectItem>
                                      ))}
                                    </SelectGroup>
                                    <SelectGroup className="px-2">
                                      <SelectLabel>MyCoolProject</SelectLabel>
                                      {[
                                        "asdsad1",
                                        "asdasdsadsad",
                                        "adsadsadsa",
                                      ].map((item) => (
                                        <SelectItem
                                          key={item}
                                          className="ml-2"
                                          value={item}
                                        >
                                          {item}
                                        </SelectItem>
                                      ))}
                                    </SelectGroup>
                                  </SelectContent>
                                </Select>
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="task"
                          render={({ field }) => (
                            <FormItem className="grid grid-cols-4 items-center gap-4">
                              <Label className="text-right">Task</Label>
                              <FormControl>
                                <Select
                                  onValueChange={field.onChange}
                                  value={field.value}
                                >
                                  <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Select type of task" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectGroup className="px-2">
                                      <SelectLabel>Billable</SelectLabel>
                                      {[
                                        "asdasdsa",
                                        "hdfgsdfdg",
                                        "sdgdsfgfgsd",
                                      ].map((item) => (
                                        <SelectItem
                                          key={`0_${item}`}
                                          className="ml-2"
                                          value={item}
                                        >
                                          {item}
                                        </SelectItem>
                                      ))}
                                    </SelectGroup>
                                    <SelectGroup className="px-2">
                                      <SelectLabel>Non-billable</SelectLabel>
                                      {[
                                        "gdfdfgfdg",
                                        "sdfdfsdgfsd",
                                        "dsfdsgsgsd",
                                      ].map((item) => (
                                        <SelectItem
                                          key={`1_${item}`}
                                          className="ml-2"
                                          value={item}
                                        >
                                          {item}
                                        </SelectItem>
                                      ))}
                                    </SelectGroup>
                                  </SelectContent>
                                </Select>
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="notes"
                          render={({ field }) => (
                            <FormItem className="grid grid-cols-4 items-center gap-4">
                              <Label className="text-right">Notes</Label>
                              <FormControl>
                                <Textarea
                                  {...field}
                                  className="col-span-3"
                                  placeholder="Notes(optional)"
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </form>
                    </Form>
                    <DialogFooter>
                      <Button form="form" type="submit">
                        Save changes
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            )}
          </TabsContent>
          <TabsContent value={"Tue"}>
            <div className="flex flex-col space-y-4">
              <div className="w-full rounded-md [&_pre]:my-0 [&_pre]:max-h-[350px] [&_pre]:overflow-auto"></div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </>
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
