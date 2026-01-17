import type {IModel} from "@/types/IModel.ts";
import {toDate} from "@/lib/utils.ts";

export abstract class Model<T extends IModel> implements IModel {
    id: T['id'];
    createdAt?: Date;
    updatedAt?: Date;

    protected constructor({id, createdAt, updatedAt}: T) {
        this.id = id;
        this.createdAt = toDate(createdAt);
        this.updatedAt = toDate(updatedAt);
    }
}