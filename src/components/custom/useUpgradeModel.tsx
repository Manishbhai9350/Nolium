import { TRPCClientError } from "@trpc/client";
import React, { useState } from "react";
import UpgradeDialog from "./upgradeDialog";

const UseUpdrageModel = () => {
  const [open, setOpen] = useState(false);

  const handleError = (error: unknown) => {
    if (error instanceof TRPCClientError) {
      if (error.data?.code === "FORBIDDEN") {
        setOpen(true);
        return true;
      }
      return false;
    }
  };

  const modal = <UpgradeDialog open={open} setOpen={setOpen} />;

  return {
    handleError,
    modal,
  };
};

export default UseUpdrageModel;
