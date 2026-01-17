import type {IModel} from "@/types/IModel.ts";
import type AgendaType from "@/types/AgendaType.ts";
import type {IUser} from "@/types/IUser.ts";
import type {Brand} from "@/types/Brand.ts";

export type AgendaId = Brand<string, "Agenda">

export interface IAgenda extends IModel<AgendaId> {
    name: string;
    type: AgendaType;
    user?: IUser;
}