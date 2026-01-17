import {createFileRoute} from '@tanstack/react-router'
import {LoginForm} from "@/components/login-form.tsx";

export const Route = createFileRoute('/old/login/')({
    component: RouteComponent,
})

function RouteComponent() {
    return <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
        <div className="w-full max-w-sm">
            <LoginForm/>
        </div>
    </div>
}
