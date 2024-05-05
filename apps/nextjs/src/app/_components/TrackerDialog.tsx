"use client";

import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useMemo,
  useState,
} from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm, useWatch } from "react-hook-form";
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
import { Input } from "@acme/ui/input";
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

import { api } from "../../trpc/react";
import { useSelectedDateContext } from "../time/page";

const formSchema = z.object({
  projectId: z.string(),
  projectCategoryId: z.string(),
  timeInMinutes: z.coerce.number(),
  notes: z.string().optional(),
});

const TrackerDialog = ({ children }: { children: ReactNode }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      projectId: "",
      notes: "",
      projectCategoryId: "",
      timeInMinutes: 0,
    },
  });

  const createTimeEntry = api.timeEntries.createTimeEntry.useMutation();
  const timeEntriesQueryCache = api.useUtils().timeEntries.getUserTimeEntries;

  const closeForm = () => {
    setIsFormOpen(false);
  };
  const { weekBoundaries } = useSelectedDateContext();

  const onSubmit: SubmitHandler<z.infer<typeof formSchema>> = async (
    values,
  ) => {
    console.log(values);
    const result = await createTimeEntry.mutateAsync({
      date: new Date(),
      notes: values.notes,
      projectCategoryId: values.projectCategoryId,
      timeInMinutes: values.timeInMinutes,
    });
    // timeEntriesQueryCache.invalidate({
    //   from: weekBoundaries.startDate,
    //   to: weekBoundaries.endDate,
    // })
    closeForm();
  };

  const selectedCategory = useWatch({
    control: form.control,
    name: "projectId",
  });

  const projectsQuery = api.timeEntries.getUserCategories.useQuery();

  const categories = useMemo(() => {
    if (projectsQuery.isSuccess) {
      return projectsQuery.data.find(
        (project) => project.id === selectedCategory,
      )?.categories;
    }
    return null;
  }, [projectsQuery.isSuccess, projectsQuery.data, selectedCategory]);

  return (
    <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[800px]">
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Track time</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <div
              id="time-entry-dialog"
              className="grid items-center gap-4 py-4"
            >
              <FormField
                control={form.control}
                name="projectId"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-4 items-center gap-4">
                    <FormLabel className="text-right">Project</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Select type of task" />
                        </SelectTrigger>
                        <SelectContent>
                          {projectsQuery.data?.map((item) => (
                            <SelectItem
                              key={item.id}
                              className="ml-2"
                              value={item.id}
                            >
                              {item.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="projectCategoryId"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">Task</Label>
                    <FormControl>
                      <Select
                        disabled={!categories || !categories.length}
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Select type of task" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories?.map((item) => (
                            <SelectItem
                              key={item.id}
                              className="ml-2"
                              value={item.id}
                            >
                              {item.name}
                            </SelectItem>
                          ))}
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
              <FormField
                control={form.control}
                name="timeInMinutes"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">Time in minutes</Label>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        className="col-span-3"
                        placeholder="0"
                        step="1"
                        min="0"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </Form>
          <DialogFooter>
            <Button type="submit">Create</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TrackerDialog;
