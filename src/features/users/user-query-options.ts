import {queryOptions} from '@tanstack/react-query'
import {UsersService} from "@/services/users.service.ts";

export const userQueryOptions = (userId: string) =>
    queryOptions({
        queryKey: ['users', {userId}],
        queryFn: () => new UsersService().getOne(userId),
    })