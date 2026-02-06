import {AuthQueryProvider} from "@daveyplate/better-auth-tanstack"
import {AuthUIProviderTanstack} from "@daveyplate/better-auth-ui/tanstack"
import {Link, useRouter} from "@tanstack/react-router"
import {QueryClientProvider} from "@tanstack/react-query"
import type {ReactNode} from "react"
import timezones from "@/assets/timezones.json"

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
                    localization={{
                        SIGN_IN: "Log in",
                        SIGN_IN_DESCRIPTION: "Use your email and password to log in.",
                        SIGN_UP: "Create Account",
                        FORGOT_PASSWORD: "Reset Password",
                        EMAIL_PLACEHOLDER: "your-email@example.com",
                        PASSWORD_PLACEHOLDER: "Secret password",
                        MAGIC_LINK_EMAIL: "Check your inbox for your login link!",
                        FORGOT_PASSWORD_EMAIL: "Check your inbox for the password reset link.",
                        RESET_PASSWORD_SUCCESS: "You can now sign in with your new password!",
                        CHANGE_PASSWORD_SUCCESS: "Your password has been successfully updated.",
                        DELETE_ACCOUNT_SUCCESS: "Your account has been permanently deleted.",
                    }}
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
                            required: true,
                            validate: async (value) => {
                                return timezones.find(timezone => timezone.zone === value) !== undefined;
                            },
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