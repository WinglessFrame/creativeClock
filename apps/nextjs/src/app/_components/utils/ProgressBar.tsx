"use client";

import { useEffect, useState } from "react";

import { Progress } from "@acme/ui/progress";

const ProgressBar = ({ className }: { className?: string }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setProgress((cur) => cur + 5), 100);
    return () => clearInterval(timer);
  }, []);

  return <Progress value={progress} className={className} />;
};

export default ProgressBar;
