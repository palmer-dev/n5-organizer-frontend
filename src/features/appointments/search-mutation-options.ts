import {mutationOptions} from '@tanstack/react-query'
import {AppointmentsService} from '@/services/appointments.service.ts'
import type {UserId} from '@/types/IUser.ts'
import type {AppointmentId} from "@/types/IAppointment.ts";

type SearchAppointmentsVariables = {
    startDate: Date
    endDate: Date
    users: UserId[],
    ignoreId?: AppointmentId
}

export const searchAppointmentsMutationOptions = () =>
    mutationOptions({
        mutationFn: ({startDate, endDate, users, ignoreId}: SearchAppointmentsVariables) =>
            new AppointmentsService().search(startDate, endDate, users, ignoreId),
    })