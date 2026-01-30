"use client";

import { createId } from "@paralleldrive/cuid2";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { NodeType } from "@/generated/prisma/enums";
import { GlobeIcon, type LucideIcon, MousePointerIcon } from "lucide-react";
import { Separator } from "../ui/separator";
import { useCallback } from "react";
import { useReactFlow } from "@xyflow/react";
import { toast } from "sonner";
import Image from "next/image";

interface AddNodeSheetProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  children?: React.ReactNode;
}

interface NodeTypeOptions {
  type: NodeType;
  label: string;
  description: string;
  icon: LucideIcon | string;
}

const triggerNodes: NodeTypeOptions[] = [
  {
    type: NodeType.MANUAL_TRIGGER,
    label: "Manual Trigger",
    description: "Manual trigger to start your workflow",
    icon: MousePointerIcon,
  },
  {
    type: NodeType.GOOGLE_FORM_TRIGGER,
    label: "Google Form Trigger",
    description: "Runs the flow when google form is submitted",
    icon: "/logos/google.svg",
  },
  {
    type: NodeType.STRIPE_TRIGGER,
    label: "Stripe Event",
    description: "Runs the flow when Stripe event captured",
    icon: "/logos/stripe.svg",
  },
];

const executionNodes: NodeTypeOptions[] = [
  {
    type: NodeType.HTTP_REQUEST,
    label: "HTTP Request",
    description: "Make an http request",
    icon: GlobeIcon,
  },
];

const NodeSelector = ({ children, onOpenChange, open }: AddNodeSheetProps) => {
  const { getNodes, setNodes, screenToFlowPosition } = useReactFlow();

  const HandleNodeSelect = useCallback(
    (selection: NodeTypeOptions) => {
      if (selection.type == NodeType.MANUAL_TRIGGER) {
        const existingManualTrigger = getNodes().some(
          (node) => node.type == NodeType.MANUAL_TRIGGER,
        );

        if (existingManualTrigger) {
          toast.error("A workflow can only contain only on Manual Trigger");
          return;
        }
      }

      setNodes((nodes) => {
        // Getting The Initial Placeholder Node
        const initialNode = nodes.some((node) => node.type == NodeType.INITIAL);

        const cx = innerWidth / 2;
        const cy = innerHeight / 2;

        const flowPos = screenToFlowPosition({
          x: cx + 100 * (Math.random() * 2 - 1),
          y: cy + 100 * (Math.random() * 2 - 1),
        });

        const newNode = {
          id: createId(),
          data: {},
          position: flowPos,
          type: selection.type,
        };

        if (initialNode) {
          return [newNode];
        }

        return [...nodes, newNode];
      });

      onOpenChange(false);
    },
    [getNodes, setNodes, screenToFlowPosition, onOpenChange],
  );

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger>{children}</SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>What triggers this workflow?</SheetTitle>
          <SheetDescription>
            A trigger is a step that will start your workflow.
          </SheetDescription>
        </SheetHeader>
        {triggerNodes.map((trigger) => {
          const { icon: Icon } = trigger;
          return (
            <div
              onClick={() => HandleNodeSelect(trigger)}
              key={trigger.label}
              className="w-full cursor-pointer hover:bg-slate-100 hover:border-l-2 border-l-primary  flex justify-start items-center py-4"
            >
              {typeof Icon == "string" ? (
                <div className="google-logo p-6">
                  <Image
                    width={23}
                    height={23}
                    alt={trigger.label}
                    src={Icon}
                  />
                </div>
              ) : (
                <div className="icon p-6">
                  <Icon />
                </div>
              )}
              <div className="texts flex flex-col justify-center items-start">
                <h1 className="text-sm font-medium">{trigger.label}</h1>
                <p className="text-sm text-muted-foreground">
                  {trigger.description}
                </p>
              </div>
            </div>
          );
        })}
        <Separator />
        {executionNodes.map((trigger) => {
          const { icon: Icon } = trigger;
          return (
            <div
              onClick={() => HandleNodeSelect(trigger)}
              key={trigger.label}
              className="w-full cursor-pointer hover:bg-slate-100 hover:border-l-2 border-l-primary  flex justify-start items-center py-4"
            >
              <div className="icon p-6">
                <Icon />
              </div>
              <div className="texts flex flex-col justify-center items-start">
                <h1 className="text-sm font-medium">{trigger.label}</h1>
                <p className="text-sm text-muted-foreground">
                  {trigger.description}
                </p>
              </div>
            </div>
          );
        })}
      </SheetContent>
    </Sheet>
  );
};

export default NodeSelector;
