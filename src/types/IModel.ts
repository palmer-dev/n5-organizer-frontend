export interface IModel<Id = string> {
    id: Id;
    createdAt?: Date | string | number | null;
    updatedAt?: Date | string | number | null;
}
