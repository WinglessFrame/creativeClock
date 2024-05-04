"use client";

import { Dispatch, ReactNode, SetStateAction, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@acme/ui/select";
import { Textarea } from "@acme/ui/textarea";

const formSchema = z.object({
  project: z.string(),
  task: z.string(),
  notes: z.string().optional(),
});

const TrackerDialog = ({
  children,
  setCurRecords,
}: {
  children: ReactNode;
  setCurRecords: Dispatch<SetStateAction<z.infer<typeof formSchema>[] | null>>;
}) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const closeForm = () => {
    setIsFormOpen(false);
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setCurRecords((cur) => (cur ? cur.concat(values) : [values]));
    closeForm();
  };
  return (
    <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Track time</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
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
                  <FormLabel className="text-right">Project</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select type of task" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup className="px-2">
                          <SelectLabel>CreativeIT</SelectLabel>
                          {["afsasdsadsa", "asfsadasd", "asfdsadasd"].map(
                            (item) => (
                              <SelectItem
                                key={`0_${item}`}
                                className="ml-2"
                                value={item}
                              >
                                {item}
                              </SelectItem>
                            ),
                          )}
                        </SelectGroup>
                        <SelectGroup className="px-2">
                          <SelectLabel>MyCoolProject</SelectLabel>
                          {["asdsad1", "asdasdsadsad", "adsadsadsa"].map(
                            (item) => (
                              <SelectItem
                                key={item}
                                className="ml-2"
                                value={item}
                              >
                                {item}
                              </SelectItem>
                            ),
                          )}
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
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select type of task" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup className="px-2">
                          <SelectLabel>Billable</SelectLabel>
                          {["asdasdsa", "hdfgsdfdg", "sdgdsfgfgsd"].map(
                            (item) => (
                              <SelectItem
                                key={`0_${item}`}
                                className="ml-2"
                                value={item}
                              >
                                {item}
                              </SelectItem>
                            ),
                          )}
                        </SelectGroup>
                        <SelectGroup className="px-2">
                          <SelectLabel>Non-billable</SelectLabel>
                          {["gdfdfgfdg", "sdfdfsdgfsd", "dsfdsgsgsd"].map(
                            (item) => (
                              <SelectItem
                                key={`1_${item}`}
                                className="ml-2"
                                value={item}
                              >
                                {item}
                              </SelectItem>
                            ),
                          )}
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
  );
};

export default TrackerDialog;
