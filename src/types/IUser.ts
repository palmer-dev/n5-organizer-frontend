import type {IModel} from "@/types/IModel.ts";
import type {Brand} from "@/types/Brand.ts";

export type UserId = Brand<string, "User">

export interface IUser extends IModel<UserId> {
    firstname: string;
    lastname: string;
    password: string;
    email: string;
    timezone: string;
}