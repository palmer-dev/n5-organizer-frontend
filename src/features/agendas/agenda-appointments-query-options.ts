import {queryOptions} from '@tanstack/react-query'
import {AgendasService} from '@/services/agendas.service'
import type {AgendaId} from "@/types/IAgenda.ts";

export const agendaAppointmentsQueryOptions = (agendaId: AgendaId) =>
    queryOptions({
        queryKey: ['agenda-appointments', {agendaId}],
        queryFn: () => new AgendasService().getAppointments(agendaId),
    })