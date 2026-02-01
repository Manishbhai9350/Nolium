"use client";

import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { UseCredentialsParams } from "./credentials-params";
import { CredentialTypes } from "@/generated/prisma/enums";

export const useCreateCredential = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.credentials.create.mutationOptions({
      onSuccess() {
        queryClient.invalidateQueries(trpc.credentials.getMany.queryOptions({}));
      },
    }),
  );
};
export const useUpdateCredential = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.credentials.update.mutationOptions({
      onSuccess() {
        queryClient.invalidateQueries(trpc.credentials.getMany.queryOptions({}));
      },
    }),
  );
};

export const useRemoveCredential = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.credentials.remove.mutationOptions({
      onSuccess() {
        queryClient.invalidateQueries(trpc.credentials.getMany.queryOptions({}));
      },
    }),
  );
};

export const useSuspensecredentials = () => {
  const trpc = useTRPC();

  const [params] = UseCredentialsParams()

  return useSuspenseQuery(trpc.credentials.getMany.queryOptions(params));
};

export const useSuspenseCredential = ({ credentialId }:{credentialId:string}) => {
  const trpc = useTRPC();
  return useSuspenseQuery(trpc.credentials.get.queryOptions({ id:credentialId }));
};

export const useCredentialsByType = ({ type }:{ type: CredentialTypes }) => {
  const trpc = useTRPC();
  return useQuery(trpc.credentials.getManyByType.queryOptions({ type }));
}