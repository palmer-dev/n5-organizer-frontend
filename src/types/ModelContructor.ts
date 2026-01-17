import type {IModel} from "@/types/IModel.ts";
import type {Model} from "@/models/model.ts";

/**
 * Constructor type for sub-models: must accept optional Partial<Instance>.
 * On évite complètement `any`.
 */
export type ModelConstructor<TData extends IModel, TModel extends Model<TData>> = new (params: TData) => TModel;