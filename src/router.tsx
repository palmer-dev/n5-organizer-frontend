import {createRouter} from '@tanstack/react-router'
import {setupRouterSsrQueryIntegration} from '@tanstack/react-router-ssr-query'
import {routeTree} from './routeTree.gen'
import {DefaultCatchBoundary} from './components/default-catch-boundary'
import {NotFound} from './components/not-found'
import {queryClient} from "@/lib/query-client.ts";


export function getRouter() {
    const router = createRouter({
        routeTree,
        scrollRestoration: true,
        context: {queryClient},
        defaultPreload: 'intent',
        defaultErrorComponent: DefaultCatchBoundary,
        defaultNotFoundComponent: () => <NotFound/>,
    })

    setupRouterSsrQueryIntegration({
        router,
        queryClient,
    })

    return router
}

declare module '@tanstack/react-router' {
    interface Register {
        router: ReturnType<typeof getRouter>
    }
}