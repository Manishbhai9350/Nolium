import { SetStateAction } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { Button } from "../ui/button";
import { authClient } from "@/lib/auth-client";

interface UpgradeProps {
  open: boolean;
  setOpen: React.Dispatch<SetStateAction<boolean>>;
}

const UpgradeDialog = ({ open, setOpen }: UpgradeProps) => {
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Upgrade To Pro</AlertDialogTitle>
            <AlertDialogDescription>
              An active subscription required to use this feature. Upgrade to
              Pro to unlock all Pro features.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button onClick={() => authClient.checkout({ slug: "pro" })}>
              Upgrade
            </Button>
          </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default UpgradeDialog;
