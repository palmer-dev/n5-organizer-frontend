// src/services/service.ts
import {Model} from "@/models/model.ts";
import {Query} from "@/utils/query.ts";
import type {IModel} from "@/types/IModel.ts";
import type {ModelConstructor} from "@/types/ModelContructor.ts";
import type {ModelRelations} from "@/types/ModelRelations.ts";

/**
 * Service générique :
 * - TData : shape des données (ex : IUser)
 * - TModel : instance (ex : User) extends Model<TData>
 */
export abstract class Service<
    TData extends IModel,
    TModel extends Model<TData>,
> {
    protected readonly model: ModelConstructor<TData, TModel>;
    protected readonly url: string;
    protected relations: Record<string, ModelRelations> = {}

    protected constructor(model: ModelConstructor<TData, TModel>, url: string, relations: Record<string, ModelRelations> = {}) {
        this.model = model;
        this.url = url;
        this.relations = relations;
    }

    /**
     * Récupère une ressource et la transforme en instance du Model.
     */
    public async getOne(id: string): Promise<TModel | null> {
        const query = new Query<TData>(this.url);
        const data = await query.get(id); // Promise<TData | null>

        if (data == null) return null;

        // le constructeur attend Partial<TData>, on peut fournir data directement
        return new this.model(data);
    }

    /**
     * Récupère toutes les ressources et les transforme en instances du Model.
     */
    public async getAll(): Promise<TModel[]> {
        const query = new Query<TData>(this.url);
        const list = await query.getAll(); // Promise<TData[]>

        return list.map(item => new this.model(item));
    }

    /**
     * Crée une nouvelle instance sur l'API et la transforme en instances du Model.
     */
    public async create(data: Partial<TData>): Promise<TModel | null> {
        const query = new Query<TData>(this.url);
        const newCreated = await query.create(data); // Promise<TData>

        if (newCreated)
            return new this.model(newCreated);

        return null;
    }

    /**
     * Met à jour une instance, et transforme en instance du Model
     */
    public async update(id: TData["id"], data: Partial<TData>): Promise<TModel | null> {
        const query = new Query<TData>(this.url);
        const newCreated = await query.update(id, data); // Promise<TData>

        if (newCreated)
            return new this.model(newCreated);

        return null;
    }

    /**
     * Supprimer une instance, et transforme en instance du Model
     */
    public async delete(id: TData["id"]): Promise<TModel | null> {
        const query = new Query<TData>(this.url);
        const newCreated = await query.delete(id); // Promise<TData>

        if (newCreated)
            return new this.model(newCreated);

        return null;
    }
}
