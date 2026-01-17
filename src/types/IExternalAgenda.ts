import type {IModel} from "@/types/IModel.ts";
import type {IAgenda} from "@/types/IAgenda.ts";
import type {Brand} from "@/types/Brand.ts";

export type ExternalAgendaId = Brand<string, "ExternalAgenda">

export interface IExternalAgenda extends IModel<ExternalAgendaId> {
    url: string;
    username: string;
    password: string;
    agenda?: IAgenda;
}