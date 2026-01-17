import {Model} from "@/models/model.ts";
import type {IAgenda} from "@/types/IAgenda.ts";
import type AgendaType from "@/types/AgendaType";
import {User} from "./user";

export class Agenda extends Model<IAgenda> implements IAgenda {
    name: string;
    type: AgendaType;
    user?: User;

    constructor(params: IAgenda) {
        super(params);

        this.name = params.name;
        this.type = params.type;
    }
}