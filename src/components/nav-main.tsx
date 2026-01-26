import {type Icon} from "@tabler/icons-react"

import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import {type ToOptions, useNavigate} from "@tanstack/react-router";
import {useCallback} from "react";

export type MenuItem = {
    title: string,
    url: ToOptions['to'],
    icon: Icon,
}

export function NavMain({
                            items,
                        }: {
    items: {
        title: string
        url: ToOptions['to']
        icon?: Icon
    }[]
}) {
    const navigate = useNavigate();

    const handleNavigation = useCallback((url: ToOptions['to']) => {
        return () => navigate({to: url});
    }, [navigate]);

    return (
        <SidebarGroup>
            <SidebarGroupContent className="flex flex-col gap-2">
                <SidebarMenu>
                    {items.map((item) => (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton className={"cursor-pointer"} tooltip={item.title} onClick={handleNavigation(item.url)}>
                                {item.icon && <item.icon/>}
                                {item.title}
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    )
}
