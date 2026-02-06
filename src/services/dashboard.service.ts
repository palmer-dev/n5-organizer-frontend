import {Service} from "@/services/service";
import type {IAgenda} from "@/types/IAgenda.ts";
import {Agenda} from "@/models/agenda.ts";
import {Query} from "@/utils/query.ts";
import {AgendaStats} from "@/models/agendaStats.ts";
import type {IDashboardStats} from "@/types/IDashboardStats.ts";
import type {IAppointment} from "@/types/IAppointment.ts";
import {Appointment} from "@/models/appointment.ts";

export class DashboardService extends Service<IAgenda, Agenda> {
    constructor() {
        super(Agenda, "dashboard");
    }

    public async getStats(): Promise<AgendaStats | null> {
        const query = new Query(this.url);
        const data = await query.get('stats') as unknown as IDashboardStats[];

        return data[0] ? new AgendaStats(data[0]) : null;
    }

    public async getUpcoming(): Promise<Appointment[]> {
        const query = new Query<IAppointment>(this.url);
        const data = await query.get<IAppointment[]>('upcoming');

        if (data === null) return [];

        return data.map(item => new Appointment(item));
    }
}
