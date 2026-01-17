import {AuthQueryProvider} from "@daveyplate/better-auth-tanstack"
import {AuthUIProviderTanstack} from "@daveyplate/better-auth-ui/tanstack"
import {Link, useRouter} from "@tanstack/react-router"
import {QueryClientProvider} from "@tanstack/react-query"
import type {ReactNode} from "react"

import {authClient} from "./lib/auth-client"
import {queryClient} from "@/lib/query-client.ts";

export function Providers({children}: { children: ReactNode }) {
    const router = useRouter()

    return (
        <QueryClientProvider client={queryClient}>
            <AuthQueryProvider>
                <AuthUIProviderTanstack
                    authClient={authClient}
                    navigate={(href) => router.navigate({href})}
                    replace={(href) => router.navigate({href, replace: true})}
                    Link={({href, ...props}) => <Link to={href} {...props} />}
                    additionalFields={{
                        firstname: {
                            label: "Prénom",
                            placeholder: "Votre prénom",
                            description: "Veuillez saisir votre prénom",
                            type: "string",
                            required: true,
                        },
                        lastname: {
                            label: "Nom",
                            placeholder: "Votre nom",
                            description: "Veuillez saisir votre nom",
                            type: "string",
                            required: true,
                        },
                        timezone: {
                            label: "Fuseau horaire",
                            placeholder: "Votre fuseau horaire",
                            description: "Veuillez choisir votre fuseau horaire",
                            type: "string",
                            required: true
                            // default: "Europe/Paris",
                        },
                    }}

                    account={{
                        basePath: "/app/account",
                        fields: ["firstname", "lastname", "timezone"]
                    }}

                    signUp={{
                        fields: ["firstname", "lastname"]
                    }}
                >
                    {children}
                </AuthUIProviderTanstack>
            </AuthQueryProvider>
        </QueryClientProvider>
    )
}