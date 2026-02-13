// Hook personnalisé
import {authClient} from "@/lib/auth-client.ts";
import {useMemo} from "react";
import {User} from "@/models/user.ts";
import type {IUser} from "@/types/IUser.ts";

export function useAuthUser() {
    const {data: session, ...rest} = authClient.useSession();

    const user = useMemo(() => {
        if (!session?.user) return null;
        return new User(session.user as unknown as IUser);
    }, [session]);

    return {user, session, ...rest};
}