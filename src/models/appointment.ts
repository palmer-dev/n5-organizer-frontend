import {Model} from "@/models/model.ts";
import type {AppointmentAgendas, IAppointment} from "@/types/IAppointment.ts";
import AppointmentStatusType from "@/types/AppointmentStatusType.ts";
import type {CalendarEvent} from "@/types/CalendarEvent.ts";
import {toDate} from "@/lib/utils.ts";
import {User} from "@/models/user.ts";

export class Appointment extends Model<IAppointment> implements IAppointment {
    name: string;
    notes: string;
    agendas: AppointmentAgendas[];
    status: AppointmentStatusType;
    endDate: Date;
    startDate: Date;
    users: User[];

    constructor(params: IAppointment) {
        super(params);

        this.name = params.name;
        this.notes = params.notes;
        this.startDate = toDate(params.startDate)!;
        this.endDate = toDate(params.endDate)!;
        this.agendas = params.agendas?.map(item => ({
            ...item,
            status: new AppointmentStatusType(item.status.toString())
        })) ?? [];
        this.status = params.status instanceof AppointmentStatusType ? params.status : new AppointmentStatusType(params.status);
        this.users = params.users?.map(user => new User(user)) ?? [];
    }

    toCalendarEvent() {
        return {
            id: this.id,
            title: this.name,
            startDate: this.startDate,
            endDate: this.endDate,
            variant: this.variant,
        } as CalendarEvent
    }

    get variant() {

        if (AppointmentStatusType.Pending.is(this.status)) {
            return 'outline';
        }

        if (AppointmentStatusType.Validated.is(this.status)) {
            return 'primary';
        }

        if (AppointmentStatusType.Refused.is(this.status)) {
            return 'destructive';
        }

        return 'secondary';
    }

    get collaborator() {
        return this.users.map(user => user.fullName).join(', ') ?? 'Moi';
    }

    get time() {

        const options: Intl.DateTimeFormatOptions = {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
        };

        return this.startDate.toLocaleTimeString(undefined, options)
    }
}