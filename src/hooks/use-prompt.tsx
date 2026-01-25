"use client";

import { useState, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type PromptOptions = {
  title: string;
  defaultValue?: string;
  onUpdate: (value: string) => void;
};

export const usePrompt = () => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [value, setValue] = useState("");
  const [onUpdate, setOnUpdate] = useState<(value: string) => void>(
    () => () => {},
  );

  const prompt = useCallback((options: PromptOptions) => {
    setTitle(options.title);
    setValue(options.defaultValue ?? "");
    setOnUpdate(() => options.onUpdate);
    setOpen(true);
  }, []);

  const close = () => setOpen(false);

  const handleUpdate = () => {
    onUpdate(value);
    close();
  };

  const Prompt = (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          autoFocus
        />

        <DialogFooter className="flex gap-2">
          <Button variant="secondary" onClick={close}>
            Cancel
          </Button>
          <Button onClick={handleUpdate}>Update</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  return { modal: Prompt, prompt };
};
