import LayoutSidebar from "@/components/custom/layout-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"


const Layout = ({ children }:{ children: React.ReactNode }) => {
  return (
    <>
    <SidebarProvider>
        <LayoutSidebar />
        <SidebarInset>
            {children}
        </SidebarInset>
    </SidebarProvider>
    </>
  )
}

export default Layout