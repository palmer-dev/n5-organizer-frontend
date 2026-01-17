import {Model} from "@/models/model.ts";
import type {IUser} from "@/types/IUser.ts";

export class User extends Model<IUser> implements IUser {
    firstname: string;
    lastname: string;
    password: string;
    email: string;
    timezone: string;

    constructor(data: IUser) {
        super(data);

        this.firstname = data.firstname;
        this.lastname = data.lastname;
        this.password = data.password;
        this.email = data.email;
        this.timezone = data.timezone;
    }
}