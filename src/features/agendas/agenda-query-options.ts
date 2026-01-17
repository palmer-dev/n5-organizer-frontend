import {queryOptions} from '@tanstack/react-query'
import {AgendasService} from '@/services/agendas.service'

export const agendaQueryOptions = (agendaId: string) =>
    queryOptions({
        queryKey: ['agendas', {agendaId}],
        queryFn: () => new AgendasService().getOne(agendaId),
    })