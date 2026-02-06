import {Service} from "@/services/service";
import type {AppointmentId, IAppointment} from "@/types/IAppointment.ts";
import {Appointment} from "@/models/appointment.ts";
import {Query} from "@/utils/query.ts";
import type {UserId} from "@/types/IUser.ts";
import {AvailableSlot, type IAvailableSlot} from "@/models/available-slot.ts";
import type AppointmentStatusType from "@/types/AppointmentStatusType.ts";
import type {IAgenda} from "@/types/IAgenda.ts";

export class AppointmentsService extends Service<IAppointment, Appointment> {
    constructor() {
        super(Appointment, "appointments");
    }

    /**
     * Récupère une ressource et la transforme en instance du Model.
     */
    public async search(startDate: Date, endDate: Date, users: UserId[], ignoreId?: AppointmentId): Promise<AvailableSlot[]> {
        const query = new Query(this.url, this.relations);
        const data = await query.search({startDate, endDate, users, ignoreId}) as unknown as IAvailableSlot[];

        if (data == null) return [];

        return data.map((items, iteration) => new AvailableSlot({...items, name: `Slot ${iteration + 1}`}));
    }


    /**
     * Met à jour une instance, et transforme en instance du Model
     */
    public async updateStatus(id: IAppointment["id"], agendaId: IAgenda["id"], status: AppointmentStatusType): Promise<Appointment | null> {
        const query = new Query<IAppointment>(this.url);
        const newCreated = await query.put(id, {
            agendaId,
            status: status.toString(),
        }, "status"); // Promise<TData>

        if (newCreated)
            return new this.model(newCreated);

        return null;
    }
}
