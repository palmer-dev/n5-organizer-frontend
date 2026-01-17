import {Model} from "@/models/model.ts";
import type {IExternalAgenda} from "@/types/IExternalAgenda.ts";
import type {Agenda} from "@/models/agenda.ts";

export class ExternalAgenda extends Model<IExternalAgenda> implements IExternalAgenda {
    password!: string;
    url!: string;
    username!: string;
    agenda?: Agenda;

    constructor(params: IExternalAgenda) {
        super(params);
    }
}