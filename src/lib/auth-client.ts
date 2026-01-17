import {createAuthClient} from "better-auth/react"
import {inferAdditionalFields} from "better-auth/client/plugins";

export const authClient = createAuthClient({
    baseURL: "http://localhost:5001",
    plugins: [inferAdditionalFields({
        user: {
            firstname: {
                type: "string",
                required: true,
            },
            lastname: {
                type: "string",
                required: true,
            },
            timezone: {
                type: "string",
                required: false,
                defaultValue: "Europe/Paris",
            },
        }
    })]
})

export type Session = typeof authClient.$Infer.Session // you can infer typescript types from the authClient
export type SessionUser = typeof authClient.$Infer.Session.user // you can infer typescript types from the authClient