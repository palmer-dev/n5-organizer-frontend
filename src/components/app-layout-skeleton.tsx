import {Skeleton} from "@/components/ui/skeleton.tsx";

export function AppLayoutSkeleton() {
    return (
        <div className="flex min-h-screen">
            {/* Sidebar */}
            <aside className="hidden md:flex w-72 border-r px-4 py-6 space-y-4">
                <Skeleton className="h-8 w-32"/>
                <div className="space-y-2">
                    {Array.from({length: 6}).map((_, i) => (
                        <Skeleton key={i} className="h-8 w-full"/>
                    ))}
                </div>
            </aside>

            {/* Main */}
            <div className="flex flex-1 flex-col">
                {/* Header */}
                <header className="h-12 border-b px-6 flex items-center">
                    <Skeleton className="h-6 w-40"/>
                </header>

                {/* Content */}
                <main className="flex-1 px-6 py-6 space-y-6">
                    <Skeleton className="h-8 w-48"/>
                    <Skeleton className="h-64 w-full rounded-lg"/>
                </main>
            </div>
        </div>
    );
}