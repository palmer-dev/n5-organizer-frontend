import {Card, CardContent, CardFooter, CardHeader} from "@/components/ui/card";
import {Skeleton} from "@/components/ui/skeleton";

export function CalendarsSkeleton() {
    return (
        <div className="px-4 lg:px-6 space-y-6">
            {/* Title */}
            <Skeleton className="h-8 w-48"/>

            {/* Cards grid */}
            <div className="grid grid-cols-1 gap-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-3">
                {Array.from({length: 6}).map((_, i) => (
                    <Card key={i} className="flex flex-col justify-between">
                        <CardHeader className="space-y-3">
                            {/* Title */}
                            <div className="flex items-center gap-2">
                                <Skeleton className="h-5 w-5 rounded-full"/>
                                <Skeleton className="h-5 w-32"/>
                            </div>

                            {/* User */}
                            <div className="flex items-center gap-2">
                                <Skeleton className="h-4 w-4 rounded-full"/>
                                <Skeleton className="h-4 w-24"/>
                            </div>
                        </CardHeader>

                        <CardContent className="flex flex-wrap gap-2">
                            <Skeleton className="h-6 w-28 rounded-full"/>
                            <Skeleton className="h-6 w-24 rounded-full"/>
                        </CardContent>

                        <CardFooter>
                            <Skeleton className="h-8 w-full"/>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}
