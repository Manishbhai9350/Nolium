"use client";

import {
  LoaderIcon,
  LucidePackageOpen,
  MoreVerticalIcon,
  PackageOpenIcon,
  PlusIcon,
  SearchIcon,
  TriangleAlertIcon,
} from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";
import { Input } from "../ui/input";
import { Empty, EmptyContent, EmptyHeader, EmptyTitle } from "../ui/empty";
import React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardTitle } from "../ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

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
  onChange: (val: string) => void;
  placeholder?: string;
};

type EmptyEntityProps = {
  disabled?: boolean;
  message?: string;
  onNew?: () => void;
  onNewLabel?: string;
};

type EntityLoadingProps = {
  lable?: string;
};

type EntityErrorProps = {
  error?: string;
};

type EntityListProps<T> = {
  items: T[];
  getkey?: (item: T, index: number) => string | number;
  renderItem: (item: T, index: number) => React.ReactNode;
  emptyView?: React.ReactNode;
  className?: string;
};

export type MenuAction = {
  action: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  label: string;
  icon: React.ReactNode;
  variant?: 'default' | 'destructive' 
};

type EntitiyItemProps = {
  href: string;
  disabled?: boolean;
  image: React.ReactNode;
  title: string;
  description: string;
  actions: MenuAction[];
};

export const EntityComponent = ({
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
  placeholder = "Search",
  value,
}: EntitySearchProps) => {
  return (
    <div className="w-full relative my-4">
      <SearchIcon className="size-4 absolute left-2 top-1/2 -translate-y-1/2" />
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="w-full pl-8"
      />
    </div>
  );
};

export const EntityEmpty = ({
  message,
  onNew,
  onNewLabel = "Add Item",
  disabled,
}: EmptyEntityProps) => {
  return (
    <div className="h-full bg-white rounded-sm border-2 border-dashed flex justify-center items-center">
      <Empty>
        <EmptyHeader>
          <EmptyTitle>
            <PackageOpenIcon className="size-12 mx-auto" />
          </EmptyTitle>
        </EmptyHeader>
        <EmptyContent>
          {!!onNew && (
            <>
              {message ? message : "No item's here"}
              <Button disabled={disabled} onClick={onNew}>
                <PlusIcon />
                {onNewLabel}
              </Button>
            </>
          )}
        </EmptyContent>
      </Empty>
    </div>
  );
};

export const EntityLoading = ({ lable }: EntityLoadingProps) => {
  return (
    <div className="h-full flex flex-col justify-center items-center">
      <LoaderIcon className="size-8 animate-spin" />
      <p>{lable}...</p>
    </div>
  );
};

export const EntityError = ({ error }: EntityErrorProps) => {
  return (
    <div className="h-full flex flex-col justify-center items-center">
      <TriangleAlertIcon className="size-8" />
      <p>{error}</p>
    </div>
  );
};

export function EntityList<T>({
  items,
  className,
  emptyView,
  getkey,
  renderItem,
}: EntityListProps<T>) {
  if (items.length == 0 && emptyView) {
    return (
      <div className="h-full flex-1 flex justify-center items-center">
        <div className="max-w-md h-full max-h-80 mx-auto">{emptyView}</div>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {items.map((item, index) => (
        <div key={getkey ? getkey(item, index) : index}>
          {renderItem(item, index)}
        </div>
      ))}
    </div>
  );
}

export const EntityItem = ({
  image,
  description,
  title,
  actions,
  disabled = false,
  href
}: EntitiyItemProps) => {
  return <Link href={href}>
    <Card>
      <CardContent className={
        cn(
          "flex justify-between items-center",
          disabled && 'opacity-50'
        )
      }>
        <div className="flex justify-center items-center h-full aspect-square">
          {image}
        </div>
        <div className="px-4 flex flex-1 flex-col justify-center items-start gap-1">
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <MoreVerticalIcon />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {actions.map(({ action, icon, label, variant = 'default' }) => (
              <DropdownMenuItem 
                key={label}
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  if(disabled) return;
                  action(e);
                }}
                className="cursor-pointer"
                variant={variant}
              >
                  {icon}
                  <span>{label}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </CardContent>
    </Card>
  </Link>
};
