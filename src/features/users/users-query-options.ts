import {queryOptions} from '@tanstack/react-query'
import {UsersService} from "@/services/users.service.ts";

export const usersQueryOptions = queryOptions({
    queryKey: ['users'],
    queryFn: () => new UsersService().getAll(),
})