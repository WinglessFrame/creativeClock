"use client";

import { useState } from "react";
import { z } from "zod";

import { Button } from "@acme/ui/button";
import { Separator } from "@acme/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@acme/ui/tabs";

import TrackerDialog from "../_components/TrackerDialog";

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

  const [currentDay, setCurrentDay] = useState<(typeof daysOfWeek)[number]>(
    daysOfWeek[0]!,
  );

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
            <ul className="flex flex-col">
              {curRecords.map((item) => (
                <li>
                  <div className="flex justify-between p-4">
                    <div className="flex flex-col gap-1">
                      <span className="font-bold">{item.project}</span>
                      <span className="text-sm">{item.task}</span>
                      <span className="text-xs">{item.notes}</span>
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
            <TrackerDialog >
              <Button
                className="mx-auto mb-4 h-12 w-full max-w-44 text-3xl"
                variant="outline"
              >
                +
              </Button>
            </TrackerDialog>
          </div>
        ) : (
          <TrackerDialog>
            <Button
              className="flex h-80 w-full flex-col gap-4"
              variant="outline"
            >
              <span className="text-3xl">No time tracked today</span>
              <span>Click to add your first record</span>
            </Button>
          </TrackerDialog>
        )}
      </TabsContent>
    </Tabs>
  );
}
