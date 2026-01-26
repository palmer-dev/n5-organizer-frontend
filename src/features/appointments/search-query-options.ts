import {mutationOptions} from '@tanstack/react-query'
import {AppointmentsService} from '@/services/appointments.service.ts'
import type {UserId} from '@/types/IUser.ts'

type SearchAppointmentsVariables = {
    startDate: Date
    endDate: Date
    users: UserId[]
}

export const searchAppointmentsMutationOptions = () =>
    mutationOptions({
        mutationFn: ({startDate, endDate, users}: SearchAppointmentsVariables) =>
            new AppointmentsService().search(startDate, endDate, users),
    })