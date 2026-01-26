import {queryOptions} from '@tanstack/react-query'
import {AppointmentsService} from '@/services/appointments.service'

export const appointmentQueryOptions = (appointmentId: string) =>
    queryOptions({
        queryKey: ['appointments', {appointmentId}],
        queryFn: () => new AppointmentsService().getOne(appointmentId),
    })