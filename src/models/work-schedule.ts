import {Model} from "@/models/model.ts";
import {User} from "./user";
import type {IWorkSchedule} from "@/types/IWorkSchedule.ts";

export class WorkSchedule extends Model<IWorkSchedule> implements IWorkSchedule {
    endTime!: Date;
    name!: string;
    startTime!: Date;
    timezone!: string;
    user!: User;

    constructor(params: IWorkSchedule) {
        super(params);
    }
}