// src/routes/__root.tsx
/// <reference types="vite/client" />
import type {ReactNode} from 'react'
import {
    Outlet,
    createRootRoute,
    HeadContent,
    Scripts,
} from '@tanstack/react-router'
import {ReactQueryDevtools} from '@tanstack/react-query-devtools'
import {TanStackRouterDevtools} from '@tanstack/react-router-devtools'

import appCss from '../index.css?url'
import {Toaster} from "@/components/ui/sonner.tsx";
import {Providers} from "@/providers.tsx";

export const Route = createRootRoute({
    head: () => ({
        meta: [
            {
                charSet: 'utf-8',
            },
            {
                name: 'viewport',
                content: 'width=device-width, initial-scale=1',
            },
            {
                title: 'OURA',
            },
        ],
        links: [{rel: 'stylesheet', href: appCss}],
    }),
    component: RootComponent,
})

function RootComponent() {
    return (
        <RootDocument>
            <Outlet/>
        </RootDocument>
    )
}

function RootDocument({children}: Readonly<{ children: ReactNode }>) {
    return (
        <html>
        <head>
            <HeadContent/>
        </head>
        <body>
        <Providers>
            {children}
            <ReactQueryDevtools buttonPosition="top-right"/>
        </Providers>
        <TanStackRouterDevtools position="bottom-right"/>
        <Scripts/>
        <Toaster/>
        </body>
        </html>
    )
}