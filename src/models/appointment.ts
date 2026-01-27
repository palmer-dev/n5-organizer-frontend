import {Model} from "@/models/model.ts";
import type {IAppointment} from "@/types/IAppointment.ts";
import {Agenda} from "@/models/agenda.ts";
import AppointmentStatusType from "@/types/AppointmentStatusType.ts";
import type {CalendarEvent} from "@/types/CalendarEvent.ts";
import {toDate} from "@/lib/utils.ts";

export class Appointment extends Model<IAppointment> implements IAppointment {
    name: string;
    notes: string;
    agenda?: Agenda[];
    endDate: Date;
    startDate: Date;
    status: AppointmentStatusType;
    users: string[];

    constructor(params: IAppointment) {
        super(params);

        this.name = params.name;
        this.notes = params.notes;
        this.startDate = toDate(params.startDate)!;
        this.endDate = toDate(params.endDate)!;
        this.status = params.status instanceof AppointmentStatusType ? params.status : new AppointmentStatusType(params.status);
        this.users = params.users ?? [];
    }

    toCalendarEvent() {
        return {
            title: this.name,
            startDate: this.startDate,
            endDate: this.endDate,
            variant: 'primary',
        } as CalendarEvent
    }
}