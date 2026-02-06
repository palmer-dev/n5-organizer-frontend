import type {IModel} from "@/types/IModel.ts";
import type AppointmentStatusType from "@/types/AppointmentStatusType.ts";
import type {IAgenda} from "@/types/IAgenda.ts";
import type {Brand} from "@/types/Brand.ts";
import type {IUser} from "@/types/IUser.ts";

export type AppointmentId = Brand<string, "Appointment">

export interface AppointmentAgendas {
    agenda: IAgenda,
    status: AppointmentStatusType
}

export interface IAppointment extends IModel<AppointmentId> {
    name: string
    notes: string
    startDate: Date;
    endDate: Date;
    status: AppointmentStatusType | string;
    agendas: AppointmentAgendas[];
    users?: IUser[]
}