import {
    IconDotsVertical,
    IconLogout,
    IconUserCircle,
} from "@tabler/icons-react"

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar"
import {type SessionUser} from "@/lib/auth-client.ts";
import {type MouseEventHandler, useCallback} from "react";
import {useNavigate} from "@tanstack/react-router";
import type {NavigateOptions} from "@tanstack/router-core";

export function NavUser({
                            user,
                        }: {
    user: SessionUser
}) {
    const {isMobile} = useSidebar()
    const navigate = useNavigate()

    const handleLogout: MouseEventHandler<HTMLDivElement> = useCallback(() => {
        void navigate({to: '/auth/$authView', params: {authView: "sign-out"}})
    }, [navigate]);

    const handleRedirect = useCallback((route: NavigateOptions) => () => {
        void navigate(route)
    }, [navigate]);

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                        >
                            <Avatar className="h-8 w-8 rounded-lg grayscale">
                                <AvatarImage alt={user.name}/>
                                <AvatarFallback
                                    className="rounded-lg">{user.lastname.substring(0, 1)}{user.firstname.substring(0, 1)}</AvatarFallback>
                            </Avatar>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-medium">{user.name}</span>
                                <span className="text-muted-foreground truncate text-xs">
                  {user.email}
                </span>
                            </div>
                            <IconDotsVertical className="ml-auto size-4"/>
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                        side={isMobile ? "bottom" : "right"}
                        align="end"
                        sideOffset={4}
                    >
                        <DropdownMenuLabel className="p-0 font-normal">
                            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                <Avatar className="h-8 w-8 rounded-lg">
                                    <AvatarImage alt={user.name}/>
                                    <AvatarFallback
                                        className="rounded-lg">{user.lastname.substring(0, 1)}{user.firstname.substring(0, 1)}</AvatarFallback>
                                </Avatar>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-medium">{user.firstname}</span>
                                    <span className="text-muted-foreground truncate text-xs">
                                        {user.email}
                                    </span>
                                </div>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator/>
                        <DropdownMenuGroup>
                            <DropdownMenuItem onClick={handleRedirect({
                                to: '/app/account/$accountView',
                                params: {'accountView': 'settings'}
                            })}>
                                <IconUserCircle/>
                                Account
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator/>
                        <DropdownMenuItem onClick={handleLogout}>
                            <IconLogout/>
                            Log out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}
