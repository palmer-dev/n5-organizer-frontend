import {mutationOptions} from '@tanstack/react-query'
import {AppointmentsService} from '@/services/appointments.service.ts'
import type {AppointmentId} from "@/types/IAppointment.ts";
import {queryClient} from "@/lib/query-client.ts";
import {agendaAppointmentsQueryOptions} from "@/features/agendas/agenda-appointments-query-options.ts";
import type {AgendaId} from "@/types/IAgenda.ts";
import {agendaQueryOptions} from "@/features/agendas/agenda-query-options.ts";
import {agendasQueryOptions} from "@/features/agendas/agendas-query-options.ts";
import type AppointmentStatusType from "@/types/AppointmentStatusType.ts";

export const updateStatusAppointmentsMutationOptions = (agendaId: AgendaId) =>
    mutationOptions({
        mutationFn: ({id, status}: {
            id: AppointmentId,
            status: AppointmentStatusType
        }) => new AppointmentsService().updateStatus(id, agendaId, status),
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