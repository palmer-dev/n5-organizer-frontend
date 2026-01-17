import {Outlet, createFileRoute} from '@tanstack/react-router'
import type {CSSProperties} from "react";
import {AppSidebar} from "@/components/app-sidebar.tsx";
import {SidebarInset, SidebarProvider} from "@/components/ui/sidebar.tsx";
import {SiteHeader} from "@/components/site-header.tsx";
import {AuthLoading, RedirectToSignIn, SignedIn} from "@daveyplate/better-auth-ui";


export const Route = createFileRoute('/app')({
    preload: true,
    component: Page,
})

function Page() {

    return (
        <>
            <AuthLoading>
                <div>Auth loading...</div>
            </AuthLoading>

            <RedirectToSignIn/>

            <SignedIn>
                <SidebarProvider
                    style={
                        {
                            "--sidebar-width": "calc(var(--spacing) * 72)",
                            "--header-height": "calc(var(--spacing) * 12)",
                        } as CSSProperties
                    }
                >
                    <AppSidebar variant="inset"/>
                    <SidebarInset>
                        <SiteHeader/>
                        <div className="flex flex-1 flex-col">
                            <div className="@container/main flex flex-1 flex-col gap-2">
                                <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                                    <Outlet/>
                                </div>
                            </div>
                        </div>
                    </SidebarInset>
                </SidebarProvider>
            </SignedIn>
        </>
    )
}