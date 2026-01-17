import type {IModel} from "@/types/IModel.ts";
import type {IUser} from "@/types/IUser.ts";
import type {Brand} from "@/types/Brand.ts";

export type WorkScheduleId = Brand<string, "WorkSchedule">

export interface IWorkSchedule extends IModel<WorkScheduleId> {
    name: string;
    timezone: string;
    startTime: Date;
    endTime: Date;
    user?: IUser;
}