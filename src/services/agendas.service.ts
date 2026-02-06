import {Service} from "@/services/service";
import type {IAgenda} from "@/types/IAgenda.ts";
import {Agenda} from "@/models/agenda.ts";
import {Query} from "@/utils/query.ts";
import {Appointment} from "@/models/appointment.ts";
import type {IAppointment} from "@/types/IAppointment.ts";
import {AgendaStats} from "@/models/agendaStats.ts";
import type {IDashboardStats} from "@/types/IDashboardStats.ts";

export class AgendasService extends Service<IAgenda, Agenda> {
    constructor() {
        super(Agenda, "agendas", {
            appointments: {
                'url': 'appointments'
            }
        });
    }

    /**
     * Récupère une ressource et la transforme en instance du Model.
     */
    public async getAppointments(id: string): Promise<Appointment[] | null> {
        const query = new Query<IAppointment>(this.url, this.relations);
        const data = await query.get<IAppointment[]>(id);
        if (data == null) return null;

        return data.map((items) => new Appointment(items));
    }

    public async getStats(): Promise<AgendaStats | null> {
        const query = new Query(this.url);
        const data = await query.get('stats') as unknown as IDashboardStats[];

        return data[0] ? new AgendaStats(data[0]) : null;
    }
}
