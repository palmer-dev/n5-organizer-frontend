import {queryOptions} from '@tanstack/react-query'
import {AgendasService} from '@/services/agendas.service'

export const agendasQueryOptions = queryOptions({
    queryKey: ['agendas'],
    queryFn: () => new AgendasService().getAll(),
})