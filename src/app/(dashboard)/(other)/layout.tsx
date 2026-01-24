import {
  SidebarTrigger,
} from "@/components/ui/sidebar";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="flex flex-col h-screen">
      <header className="w-full border-b px-4 py-2">
        <SidebarTrigger />
      </header>
      <div className="flex-1">{children}</div>
    </main>
  );
};

export default Layout;
