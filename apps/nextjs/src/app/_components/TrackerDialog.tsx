"use client";

import { Dispatch, ReactNode, SetStateAction, useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
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
import { api } from "../../trpc/react";

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


  const selectedCategory = useWatch({ control: form.control, name: 'project' })

  const projectsQuery = api.timeEntries.getUserCategories.useQuery();
  const createEntryMutation = api.timeEntries.createTimeEntry.useMutation()

  const categories = useMemo(() => {
    if (projectsQuery.isSuccess) {
      return projectsQuery.data.find(project => project.id === selectedCategory)?.categories
    }
    return null
  }, [projectsQuery.isSuccess, projectsQuery.data, selectedCategory])


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
                        {projectsQuery.data?.map(
                          (item) => (
                            <SelectItem
                              key={item.id}
                              className="ml-2"
                              value={item.id}
                            >
                              {item.name}
                            </SelectItem>
                          ),
                        )}
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
                    <Select disabled={!categories || !categories.length} onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select type of task" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories?.map(
                          (item) => (
                            <SelectItem
                              key={item.id}
                              className="ml-2"
                              value={item.id}
                            >
                              {item.name}
                            </SelectItem>
                          ),
                        )}
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
