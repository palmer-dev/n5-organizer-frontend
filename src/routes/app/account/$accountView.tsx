import {createFileRoute} from '@tanstack/react-router'
import {AccountView} from "@daveyplate/better-auth-ui";

export const Route = createFileRoute('/app/account/$accountView')({
    component: RouteComponent,
})

function RouteComponent() {
    const {accountView} = Route.useParams()

    return <div className="flex flex-col justify-center py-12 px-4">
        <AccountView pathname={accountView}/>
    </div>
}
