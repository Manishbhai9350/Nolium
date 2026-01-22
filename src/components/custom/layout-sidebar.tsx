"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../ui/sidebar";
import { SidebarData } from "@/lib/sidebar-data";
import Link from "next/link";
import Image from "next/image";
import { CreditCardIcon, GemIcon, Loader2Icon, LoaderIcon, LogOutIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useHasActiveSubscription } from "@/features/billing/subscriptions-hook";
import { useQueryClient } from "@tanstack/react-query";

const LayoutSidebar = () => {
  const router = useRouter();
  const pathname = usePathname();

  const queryClient = useQueryClient()

  const { hasActiveSubscription, subscription, isLoading } =
    useHasActiveSubscription();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenuItem>
          <SidebarMenuButton asChild>
            <Link href="/" prefetch>
              <Image width={20} height={20} src="/logos/logo.svg" alt="logo" />
              <h1 className="text-xl font-semibold">Nolium</h1>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarHeader>
      <SidebarContent>
        {SidebarData.map((SideItem) => (
          <SidebarGroup key={SideItem.title}>
            <SidebarGroupContent>
              <SidebarMenu>
                {SideItem.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      tooltip={item.title}
                      asChild
                      isActive={
                        pathname === "/"
                          ? item.path === "/"
                          : pathname.startsWith(item.path)
                      }
                    >
                      <Link href={item.path} prefetch>
                        <item.icon className="size-24" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            {
              isLoading && (
                <div className="w-full flex justify-center items-center">
                  <Loader2Icon className="loader animate-spin size-6" />
                </div>
              )
            }
            {!hasActiveSubscription && !isLoading && (
              <SidebarMenuButton onClick={() => authClient.checkout({ slug:'pro' })} tooltip="Upgrade To Pro">
                <GemIcon className="size-4" />
                <span>Upgrade To Pro</span>
              </SidebarMenuButton>
            )}
            <SidebarMenuButton onClick={() => authClient.customer.portal()} tooltip="Billing Portal">
              <CreditCardIcon className="size-4" />
              <span>Payments & Billings</span>
            </SidebarMenuButton>
            <SidebarMenuButton
              onClick={() => {
                authClient.signOut({
                  fetchOptions: {
                    onSuccess() {

                      // Uncaching Active Subscription Query
                      queryClient.invalidateQueries({
                        queryKey:['active-subscription']
                      })
                      toast.success("Logged Out");
                      router.push("/login");
                    },
                    onError(context) {
                      toast.error(
                        "Failed To Log Out: " + context.error.message,
                      );
                    },
                  },
                });
              }}
              tooltip="Log Out"
            >
              <LogOutIcon className="size-4" />
              <span>Sign Out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default LayoutSidebar;
