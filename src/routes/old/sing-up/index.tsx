import {createFileRoute} from '@tanstack/react-router'
import {SignupForm} from "@/components/signup-form.tsx";

export const Route = createFileRoute('/old/sing-up/')({
    component: RouteComponent,
})

function RouteComponent() {
    return <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
        <div className="w-full max-w-sm">
            <SignupForm/>
        </div>
    </div>
}
