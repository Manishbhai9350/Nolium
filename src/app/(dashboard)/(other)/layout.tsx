import LayoutSidebar from "@/components/custom/layout-sidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return <>
        <header className="w-full border-b px-4 py-2">
            <SidebarTrigger className="size-4" />
        </header>
        <main className="flex-1">
            {children}
        </main>
    </>;
};

export default Layout;
