"use client";

import { ReactNode, useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm, useWatch } from "react-hook-form";
import { z } from "zod";

import { RouterOutputs } from "@acme/api";
import { Button } from "@acme/ui/button";
import {
  Dialog,
  DialogContent,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@acme/ui/select";
import { Textarea } from "@acme/ui/textarea";
import { toast } from "@acme/ui/toast";

import HHMMStringSchema from "~/schemas/HHMMStringSchema";
import {
  convertHHMMToMinutes,
  convertMinutesToHHMM,
  getFullDay,
} from "~/utils";
import { api } from "../../../trpc/react";
import { useTimeContext } from "./timeContext.client";

type Props = {
  children: ReactNode;
} & (
  | {
      mode?: "create";
    }
  | {
      mode: "edit";
      entryId: RouterOutputs["timeEntries"]["getUserTimeEntries"][number]["id"];
      formValues: {
        projectId: string;
        notes: string;
        projectCategoryId: string;
        timeInMinutes: number;
      };
    }
);

const timeEntrySchema = z.object({
  projectId: z.string().min(1),
  projectCategoryId: z.string().min(1),
  timeInHHMM: HHMMStringSchema.transform(convertHHMMToMinutes),
  notes: z.string().optional(),
});

const TrackerDialog = ({
  mode = "create",
  children,
  formValues,
  entryId,
}: Props) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { selectedDate, weekBoundaries } = useTimeContext();

  const form = useForm<z.infer<typeof timeEntrySchema>>({
    resolver: zodResolver(timeEntrySchema),
    defaultValues: formValues
      ? {
          ...formValues,
          timeInHHMM: convertMinutesToHHMM(formValues.timeInMinutes),
        }
      : {
          projectId: "",
          notes: "",
          projectCategoryId: "",
          timeInHHMM: "",
        },
  });
  const selectedCategory = useWatch({
    control: form.control,
    name: "projectId",
  });

  const getUserEntriesCache = api.useUtils().timeEntries.getUserTimeEntries;
  const projectsQuery = api.timeEntries.getUserCategories.useQuery();
  const createTimeEntry = api.timeEntries.createTimeEntry.useMutation({
    onMutate: async (newEntry) => {
      console.log(newEntry);
    },
  });

  const updateTimeEntry = api.timeEntries.updateTimeEntry.useMutation({
    onMutate: async (updatedEntry) => {
      getUserEntriesCache.setData(weekBoundaries, (prev) => {
        let entryToUpdate:
          | RouterOutputs["timeEntries"]["getUserTimeEntries"][number]
          | undefined;
        if (prev)
          return prev.map((item) => {
            if (item.id === updatedEntry.id) {
              entryToUpdate = item;
              return {
                ...item,
                notes: updatedEntry.notes ?? "",
                timeInMinutes: updatedEntry.timeInMinutes,
                projectCategoryId: updatedEntry.projectCategoryId,
                projectCategory: {
                  ...item.projectCategory,
                  id: updatedEntry.projectCategoryId,
                  name:
                    categories?.find(
                      (item) => item.id === updatedEntry.projectCategoryId,
                    )?.name ?? "",
                },
              };
            }

            return item;
          });
      });
    },
    onError: (_err, _newTodo, context) => {
      getUserEntriesCache.setData(weekBoundaries, (prev) => {
        if (prev && context) return [...prev, context];
      });
      toast.error("Failed to update entry");
    },
    onSettled: () => {
      getUserEntriesCache.invalidate();
    },
  });

  const onSubmit: SubmitHandler<z.infer<typeof timeEntrySchema>> = async (
    values,
  ) => {
    setIsFormOpen(false);
    await (mode === "create" ? createTimeEntry : updateTimeEntry).mutateAsync({
      date: selectedDate.date,
      notes: values.notes,
      projectCategoryId: values.projectCategoryId,
      timeInMinutes: values.timeInHHMM,
      id: entryId,
    });
  };

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
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "New time entry for" : "Edit time entry for"}{" "}
            {getFullDay(selectedDate.date)}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)}>
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
                    <FormLabel className="text-right">Task</FormLabel>
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
                    <FormLabel className="text-right">Notes</FormLabel>
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
                name="timeInHHMM"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-4 items-center gap-4">
                    <FormLabel className="text-right">Time</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="col-span-3"
                        placeholder="00:00"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </Form>
          <DialogFooter>
            <Button type="submit">
              {mode === "create" && "Create"}
              {mode === "edit" && "Update"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TrackerDialog;
