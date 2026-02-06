import {queryOptions} from '@tanstack/react-query'
import {AgendasService} from '@/services/agendas.service'
import type {AgendaId} from "@/types/IAgenda.ts";

export const agendaQueryOptions = (agendaId: AgendaId) =>
    queryOptions({
        queryKey: ['agendas', {agendaId}],
        queryFn: () => new AgendasService().getOne(agendaId),
    })