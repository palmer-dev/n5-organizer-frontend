// Garde de type pour détecter si une référence est hydratée (runtime)
import type {Relation} from "@/types/ObjectId.ts";

export const isHydrated = <T>(ref: Relation<T>): boolean => {
    return typeof ref === "object" && ref !== null;
};
