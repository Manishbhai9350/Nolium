"use client";

import { PlusIcon, SearchIcon } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";
import { Input } from "../ui/input";

type EntityProps = {
  title: string;
  description: string;
  disabled?: boolean;
  onNew?: () => void;
  onNewHref?: string;
  onNewLabel: string;
};

type EntitySearchProps = {
  value: string;
  onChange: (val:string) => void;
  placeholder?: string;
};

const EntityComponent = ({
  description,
  onNewLabel,
  title,
  onNew,
  onNewHref,
  disabled,
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

export const EntitySearch = ({
  onChange,
  placeholder = 'Search',
  value
}: EntitySearchProps) => {

  return (
    <div className="w-full relative my-4">
      <SearchIcon className="size-4 absolute left-2 top-1/2 -translate-y-1/2" />
      <Input 
        value={value} 
        onChange={e => onChange(e.target.value)} 
        placeholder={placeholder} 
        className="w-full pl-8"
      />
    </div>
  )
};

export default EntityComponent;
