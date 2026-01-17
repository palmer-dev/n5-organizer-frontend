import {Service} from "@/services/service";
import {User} from "@/models/user";
import type {IUser} from "@/types/IUser.ts";

export class UsersService extends Service<IUser, User> {
    constructor() {
        super(User, "users");
    }

    getOne(id: string) {
        return super.getOne(id);
    }

    getAll() {
        return super.getAll();
    }
}
