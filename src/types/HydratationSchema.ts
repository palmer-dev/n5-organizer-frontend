import type {ModelConstructor} from "@/types/ModelContructor.ts";

/**
 * Hydration schema optionnel : pour chaque clé K de T on peut fournir
 * soit un constructeur de sous-modèle, soit un tableau contenant ce constructeur.
 */
export type HydrationSchema<T> = {
    [K in keyof T]?: ModelConstructor<T[K]> | [ModelConstructor<T[K]>];
};