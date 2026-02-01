/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import {
  EntityComponent,
  EntityEmpty,
  EntityItem,
  EntityList,
  EntitySearch,
  MenuAction,
} from "@/components/custom/entity-component";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import useEntitySearch from "@/components/custom/entity-search";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { KeyIcon, TrashIcon } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { UseCredentialsParams } from "../hooks/credentials-params";
import { CredentialModel } from "@/generated/prisma/models";
import {
  useCreateCredential,
  useRemoveCredential,
  useSuspenseCredential,
  useSuspensecredentials,
} from "../hooks/useCredentials";
import Image from "next/image";
import { CredentialTypes } from "@/generated/prisma/enums";
import CredentialForm from "./credentialForm";

interface CredentialPaginationProps {
  page: number;
  totalPages: number;
  hasNextpage: boolean;
  hasPrevPage: boolean;
  disabled?: boolean;
}

interface CredentialItemProps {
  credential: CredentialModel;
}

// const CredentialBreadCrumbInput = ({ CredentialId }: { CredentialId: string }) => {
//   const Credential = useSuspenseCredential({ CredentialId });
//   const [name, setName] = useState("");

//   const updateName = useUpdateCredentialName();
//   const { modal, prompt } = usePrompt();

//   useEffect(() => {
//     setName(Credential.data.name);

//     return () => {};
//   }, [Credential.data.name]);

//   function handleOnClick() {Credential
//     if (!name) return;
//     prompt({
//       async onUpdate(value) {
//         updateName.mutate(
//           {
//             name: value,
//             id: workflowId,
//           },
//           {
//             onSuccess(data) {
//               toast.success(`Successfully renamed workflow to ${data.name}`);
//               setName(data.name);
//             },
//             onError(error) {
//               toast.error(
//                 `Failed to rename workflow to ${value}, Error ${error.message}`,
//               );
//             },
//           },
//         );
//       },
//       title: "Update Workflow name",
//       defaultValue: name,
//     });
//   }

//   return (
//     <>
//       {modal}
//       <BreadcrumbItem
//         onClick={handleOnClick}
//         className={cn("relative", !updateName.isPending && "cursor-pointer")}
//       >
//         {updateName.isPending && (
//           <div className="absolute top-1/2 left-1/2 -translate-1/2">
//             <LoaderIcon className="size-5 animate-spin" />
//           </div>
//         )}
//         <p className={cn(updateName.isPending && "opacity-20")}>{name}</p>
//       </BreadcrumbItem>
//     </>
//   );
// };

// const WorkflowBreadCrumb = ({ workflowId }: { workflowId: string }) => {
//   return (
//     <div className="w-full px-2 h-full flex justify-between items-center">
//       <Breadcrumb>
//         <BreadcrumbList>
//           <BreadcrumbItem>
//             <BreadcrumbLink asChild>
//               <Link href="/workflows" prefetch>
//                 workflows
//               </Link>
//             </BreadcrumbLink>
//           </BreadcrumbItem>
//           <BreadcrumbSeparator />
//           <WorkflowBreadCrumbInput workflowId={workflowId} />
//         </BreadcrumbList>
//       </Breadcrumb>
//     </div>
//   );
// };

export const CredentialPageHeader = ({
  credentialId,
}: {
  credentialId: string;
}) => {
  return (
    <header className="w-full flex justify-center items-center border-b px-4 py-2">
      <SidebarTrigger />
    </header>
  );
};

export const CredentialsHeader = () => {
  const [params, setParams] = UseCredentialsParams();

  const { searchValue, setSearch } = useEntitySearch({ params, setParams });

  return (
    <>
      <EntityComponent
        title="Credentials"
        description="Create and manage credentials"
        onNewLabel="Create Credential"
        onNewHref="/credentials/new"
      />
      <EntitySearch
        value={searchValue}
        onChange={setSearch}
        placeholder="Search Workflow"
      />
    </>
  );
};

export const CredentialPagination = ({
  hasNextpage,
  hasPrevPage,
  page,
  totalPages,
  disabled,
}: CredentialPaginationProps) => {
  const [params, setParams] = UseCredentialsParams();

  function onNext() {
    if (!hasNextpage) return;
    setParams({
      ...params,
      page: page + 1,
    });
  }

  function onPrevious() {
    if (!hasPrevPage) return;
    setParams({
      ...params,
      page: page - 1,
    });
  }

  return (
    <div className="w-full !my-4 h-fit flex justify-between items-center">
      <p className="text-md text-muted-foreground">
        Page {page} of {totalPages}
      </p>
      <div className="pagination-buttons flex gap-6">
        <Button
          variant="outline"
          disabled={disabled || !hasPrevPage}
          onClick={onPrevious}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          disabled={disabled || !hasNextpage}
          onClick={onNext}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export const CredentialsEmpty = () => {
  const [params] = UseCredentialsParams();
  const create = useCreateCredential();
  const router = useRouter();

  const handleCreate = () => {
    router.push(`/credentials/new`);
  };

  const emptyText = params.search
    ? `No Credentials exist for "${params.search}". Click Add Item to create a Credential.`
    : "You haven't created any Credentials yet. Click Add Item to create one.";

  return (
    <>
      <EntityEmpty
        disabled={create.isPending}
        onNew={handleCreate}
        message={emptyText}
      />
    </>
  );
};

export const CredentialsList = () => {
  const credentials = useSuspensecredentials();

  return (
    <>
      <div className="flex-1">
        <EntityList
          items={credentials.data.items}
          renderItem={(credential) => (
            <CredentialItem credential={credential} />
          )}
          getkey={(credential) => credential.id}
          emptyView={<CredentialsEmpty />}
        />
      </div>
      <CredentialPagination
        hasNextpage={credentials.data.hasNextPage}
        hasPrevPage={credentials.data.hasPrevPage}
        page={credentials.data.page}
        totalPages={credentials.data.totalPages}
        disabled={credentials.isPending || credentials.data.items.length == 0}
      />
    </>
  );
};

const CredentialTypeLogos: Record<CredentialTypes, string> = {
  [CredentialTypes.ANTHROPIC]: "/logos/anthropic.svg",
  [CredentialTypes.GEMINI]: "/logos/gemini.svg",
  [CredentialTypes.GPT]: "/logos/openai.svg",
};

export const CredentialItem = ({ credential }: CredentialItemProps) => {
  const remove = useRemoveCredential();

  function handleRemove(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    e.preventDefault();
    e.stopPropagation();
    remove.mutate(
      { id: credential.id },
      {
        onSuccess() {
          toast.success(`Removed "${credential.name}" successfully`);
        },
        onError(error) {
          toast.success(
            `Failed to remove "${credential.name}, Error: ${error.message}"`,
          );
        },
      },
    );
  }

  const actions: MenuAction[] = [
    {
      action: handleRemove,
      icon: <TrashIcon />,
      label: "Delete",
      variant: "destructive",
    },
  ];

  return (
    <EntityItem
      disabled={remove.isPending}
      href={`/credentials/${credential.id}`}
      actions={actions}
      description={`
        Created ${formatDistanceToNow(credential.createdAt, { addSuffix: true })}
        Updated ${formatDistanceToNow(credential.updatedAt || credential.createdAt, { addSuffix: true })}
        `}
      image={
        <Image
          src={CredentialTypeLogos[credential.type]}
          alt={credential.name}
          width={22}
          height={22}
        />
      }
      title={credential.name}
    />
  );
};

export const CredentialView = ({ credentialId }: { credentialId: string }) => {
  const { data: credential, isPending } = useSuspenseCredential({
    credentialId,
  });

  return <div className="w-full h-full p-4">
    <CredentialForm initialData={credential} />
  </div>
};
