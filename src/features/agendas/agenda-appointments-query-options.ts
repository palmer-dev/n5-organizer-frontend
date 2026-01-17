import {queryOptions} from '@tanstack/react-query'
import {AgendasService} from '@/services/agendas.service'

export const agendaAppointmentsQueryOptions = (agendaId: string) =>
    queryOptions({
        queryKey: ['agenda-appointments', {agendaId}],
        queryFn: () => new AgendasService().getAppointments(agendaId),
    })