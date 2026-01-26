import { PlusIcon } from "lucide-react";
import { Button } from "../ui/button";
import { memo } from "react";

export const AddNodeButton = memo(({ onClick }:{onClick:() => void}) => {
  return (
    <Button onClick={onClick} variant="outline" size="icon" className="bg-background">
      <PlusIcon className="size-4" />
    </Button>
  );
});


AddNodeButton.displayName = 'AddNodeButton';