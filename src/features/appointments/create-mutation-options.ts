import {mutationOptions} from '@tanstack/react-query'
import type {IAppointment} from "@/types/IAppointment.ts";
import {queryClient} from "@/lib/query-client.ts";
import {agendaAppointmentsQueryOptions} from "@/features/agendas/agenda-appointments-query-options.ts";
import type {AgendaId} from "@/types/IAgenda.ts";
import {agendaQueryOptions} from "@/features/agendas/agenda-query-options.ts";
import {agendasQueryOptions} from "@/features/agendas/agendas-query-options.ts";
import {AgendasService} from "@/services/agendas.service.ts";

export const createAppointmentsMutationOptions = (agendaId: AgendaId) =>
    mutationOptions({
        mutationFn: (data: Partial<IAppointment>) =>
            new AgendasService().createAppointment(agendaId, data),
        onSuccess: () => {
            if (agendaId) {
                void queryClient.invalidateQueries({
                    queryKey: agendaAppointmentsQueryOptions(agendaId).queryKey
                })

                void queryClient.invalidateQueries({
                    queryKey: agendaQueryOptions(agendaId).queryKey
                })

                void queryClient.invalidateQueries({
                    queryKey: agendasQueryOptions.queryKey
                })
            }
        }
    })