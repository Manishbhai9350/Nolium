'use client';

import { PlusIcon } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";

type EntityProps = {
  title: string;
  description: string;
  disabled?: boolean;
  onNew?: () => void;
  onNewHref?: string;
  onNewLabel: string;
};

const EntityComponent = ({
  description,
  onNewLabel,
  title,
  onNew,
  onNewHref,
  disabled
}: EntityProps) => {
  return (
    <div className="w-full h-fit flex justify-between items-center">
      <div className="flex flex-col justify-between items-start">
        <h1 className="text-2xl max-sm:text-xl">{title}</h1>
        <p className="text-muted-foreground text-md max-sm:text-sm">
          {description}
        </p>
      </div>
      {onNew && !onNewHref && (
        <Button disabled={disabled} onClick={onNew}>
          <PlusIcon className="size-4" />
          {onNewLabel}
        </Button>
      )}
      {onNewHref && !onNew && (
        <Button asChild>
          <Link href={onNewHref}>
            <PlusIcon className="size-4" />
            {onNewLabel}
          </Link>
        </Button>
      )}
    </div>
  );
};

export default EntityComponent;
