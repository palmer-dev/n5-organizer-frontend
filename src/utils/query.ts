// src/utils/query.ts

import type {ModelRelations} from "@/types/ModelRelations.ts";
import type {IModel} from "@/types/IModel.ts";

export class Query<T extends IModel> {
    private readonly baseUrl: string;
    private readonly resource: string;
    protected relations: Record<string, ModelRelations> = {}

    /**
     * @param resource nom de la ressource, ex: "users" ou "agendas"
     * @param relations
     * @param baseUrl base de l'API (optionnel)
     */
    constructor(resource: string, relations: Record<string, ModelRelations> = {}, baseUrl: string = "http://localhost:5001/api") {
        this.resource = resource.replace(/^\/+|\/+$/g, ""); // strip slashes
        this.relations = relations;
        this.baseUrl = baseUrl.replace(/\/+$/, ""); // strip trailing slash
    }

    /**
     * Fetch d'un item par id (ou param optionnel).
     * Retourne null si status === 204 (No Content) ou si body === null.
     */
    public async get<R = T>(id = ""): Promise<R | null> {
        const url = this.buildUrl(id);
        const response = await fetch(url, {method: "GET", credentials: "include"});

        if (!response.ok) {
            throw new Error(`HTTP error ${response.status} when GET ${url}`);
        }

        // 204 No Content -> null
        if (response.status === 204) return null;

        // parse JSON safely
        const parsed = (await this.safeJsonParse(response));
        return parsed as R | null;
    }

    /**
     * Récupère la liste complète de la ressource.
     */
    public async getAll(): Promise<T[]> {
        const url = this.buildUrl();
        const response = await fetch(url, {method: "GET", credentials: "include"});

        if (!response.ok) {
            throw new Error(`HTTP error ${response.status} when GET ${url}`);
        }

        if (response.status === 204) return [];

        const parsed = (await this.safeJsonParse(response));
        return Array.isArray(parsed) ? (parsed as T[]) : ([] as T[]);
    }

    /**
     * Search request (POST)
     */
    public async search<TBody extends object>(bodyData: TBody): Promise<T[] | null> {
        const url = this.buildUrl('search');

        let response: Response;

        try {
            response = await fetch(url, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                body: JSON.stringify(bodyData),
            });
        } catch (error) {
            // Erreur réseau (timeout, DNS, CORS, etc.)
            throw new Error(`Network error while calling POST ${url}: ${String(error)}`);
        }

        if (!response.ok) {
            let errorBody: unknown = null;

            try {
                errorBody = await this.safeJsonParse(response);
            } catch {
                // ignore JSON parse error
            }

            throw new Error(
                `HTTP error ${response.status} when POST ${url}` +
                (errorBody ? ` - ${JSON.stringify(errorBody)}` : "")
            );
        }

        // 204 No Content
        if (response.status === 204) {
            return null;
        }

        const parsed = await this.safeJsonParse(response);

        return Array.isArray(parsed) ? (parsed as T[]) : ([] as T[]);
    }

    /**
     * Création d'une ressource (POST)
     */
    public async create(data: Partial<T>): Promise<T | null> {
        const url = this.buildUrl();

        let response: Response;

        try {
            response = await fetch(url, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                body: JSON.stringify(data),
            });
        } catch (error) {
            // Erreur réseau (timeout, DNS, CORS, etc.)
            throw new Error(`Network error while calling POST ${url}: ${String(error)}`);
        }

        if (!response.ok) {
            let errorBody: unknown = null;

            try {
                errorBody = await this.safeJsonParse(response);
            } catch {
                // ignore JSON parse error
            }

            throw new Error(
                `HTTP error ${response.status} when POST ${url}` +
                (errorBody ? ` - ${JSON.stringify(errorBody)}` : "")
            );
        }

        // 204 No Content
        if (response.status === 204) {
            return null;
        }

        const parsed = await this.safeJsonParse(response);
        return parsed as T | null;
    }

    /**
     * Mise à jour d'une ressource (PUT)
     */
    public async update(
        id: T["id"],
        data: Partial<Omit<T, "id">>
    ): Promise<T | null> {
        const url = this.buildUrl(id);

        let response: Response;

        try {
            response = await fetch(url, {
                method: "PUT",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                body: JSON.stringify(data),
            });
        } catch (error) {
            // Erreur réseau (timeout, DNS, CORS, etc.)
            throw new Error(`Network error while calling POST ${url}: ${String(error)}`);
        }

        if (!response.ok) {
            let errorBody: unknown = null;

            try {
                errorBody = await this.safeJsonParse(response);
            } catch {
                // ignore JSON parse error
            }

            throw new Error(
                `HTTP error ${response.status} when POST ${url}` +
                (errorBody ? ` - ${JSON.stringify(errorBody)}` : "")
            );
        }

        // 204 No Content
        if (response.status === 204) {
            return null;
        }

        const parsed = await this.safeJsonParse(response);
        return parsed as T | null;
    }

    /**
     * Mise à jour d'une ressource (PUT)
     */
    public async put<ST = Partial<Omit<T, "id">>>(
        id: T["id"],
        data: ST,
        action?: string
    ): Promise<T | null> {
        const url = this.buildUrl(id, action);

        let response: Response;

        try {
            response = await fetch(url, {
                method: "PUT",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                body: JSON.stringify(data),
            });
        } catch (error) {
            // Erreur réseau (timeout, DNS, CORS, etc.)
            throw new Error(`Network error while calling POST ${url}: ${String(error)}`);
        }

        if (!response.ok) {
            let errorBody: unknown = null;

            try {
                errorBody = await this.safeJsonParse(response);
            } catch {
                // ignore JSON parse error
            }

            throw new Error(
                `HTTP error ${response.status} when POST ${url}` +
                (errorBody ? ` - ${JSON.stringify(errorBody)}` : "")
            );
        }

        // 204 No Content
        if (response.status === 204) {
            return null;
        }

        const parsed = await this.safeJsonParse(response);
        return parsed as T | null;
    }

    /**
     * Mise à jour d'une ressource (PUT)
     */
    public async delete(id: T['id']): Promise<T | null> {
        const url = this.buildUrl(id);

        let response: Response;

        try {
            response = await fetch(url, {
                method: "DELETE",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                }
            });
        } catch (error) {
            // Erreur réseau (timeout, DNS, CORS, etc.)
            throw new Error(`Network error while calling POST ${url}: ${String(error)}`);
        }

        if (!response.ok) {
            let errorBody: unknown = null;

            try {
                errorBody = await this.safeJsonParse(response);
            } catch {
                // ignore JSON parse error
            }

            throw new Error(
                `HTTP error ${response.status} when POST ${url}` +
                (errorBody ? ` - ${JSON.stringify(errorBody)}` : "")
            );
        }

        // 204 No Content
        if (response.status === 204) {
            return null;
        }

        const parsed = await this.safeJsonParse(response);
        return parsed as T | null;
    }

    /**
     * Construit l'URL complète en échappant l'id/param si fourni.
     */
    private buildUrl(param?: string, action?: string): string {
        const parts: string[] = [this.baseUrl, this.resource];

        if (param) {
            // si l'utilisateur passe déjà un chemin (ex: "123/foo") on filtre et encode pour la sécurité
            const encodedParam = param
                .split("/")
                .map(p => encodeURIComponent(p))
                .join("/");

            parts.push(encodedParam);
        }

        // relations intermédiaires
        if (this.relations) {
            Object.values(this.relations).forEach(item => {
                if (item?.url) {
                    parts.push(encodeURIComponent(item.url));
                }
            });
        }

        // action finale
        if (action) {
            parts.push(encodeURIComponent(action));
        }

        return parts.join("/");
    }

    /**
     * Lit la réponse et renvoie le JSON ou null si body vide.
     * Utilise unknown pour rester typé.
     */
    private async safeJsonParse(response: Response): Promise<unknown> {
        const text = await response.text();

        if (!text) return null;

        try {
            return JSON.parse(text);
        } catch (err) {
            throw new Error(`Invalid JSON response from ${response.url}: ${(err as Error).message}`);
        }
    }
}
