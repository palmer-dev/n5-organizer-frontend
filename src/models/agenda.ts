import {Model} from "@/models/model.ts";
import type {IAgenda} from "@/types/IAgenda.ts";
import type AgendaType from "@/types/AgendaType";
import {User} from "./user";
import {AgendaStats} from "@/models/agendaStats.ts";

export class Agenda extends Model<IAgenda> implements IAgenda {
    name: string;
    type: AgendaType;
    user?: User;
    stats?: AgendaStats

    constructor(params: IAgenda) {
        super(params);

        this.name = params.name;
        this.type = params.type;
        this.user = params.user ? new User(params.user) : undefined;
        this.stats = params.stats ? new AgendaStats(params.stats) : undefined;
    }
}