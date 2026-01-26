import * as React from "react"
import {
    IconDashboard,
    IconInnerShadowTop,
    IconListDetails,
} from "@tabler/icons-react"

import {type MenuItem, NavMain} from "@/components/nav-main"
import {NavUser} from "@/components/nav-user"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import {authClient} from "@/lib/auth-client.ts";

type DataType = {
    user: {
        name: string,
        email: string,
        avatar: string,
    },
    navMain: MenuItem[]
}

const data: DataType = {
    user: {
        name: "shadcn",
        email: "m@example.com",
        avatar: "/avatars/shadcn.jpg",
    },
    navMain: [
        {
            title: "Dashboard",
            url: "/app/dashboard",
            icon: IconDashboard,
        },
        {
            title: "Calendrier",
            url: "/app/calendar",
            icon: IconListDetails,
        },
    ]
}

export function AppSidebar({...props}: React.ComponentProps<typeof Sidebar>) {
    const {data: session} = authClient.useSession()

    return (
        <Sidebar collapsible="offcanvas" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            asChild
                            className="data-[slot=sidebar-menu-button]:!p-1.5"
                        >
                            <a href="/">
                                <IconInnerShadowTop className="!size-5"/>
                                <span className="text-base font-semibold">Planner</span>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={data.navMain}/>
            </SidebarContent>
            <SidebarFooter>
                {session &&
                    <NavUser user={session?.user}/>
                }
            </SidebarFooter>
        </Sidebar>
    )
}
