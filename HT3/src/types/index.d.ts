import { BuildOptions, Model, Optional } from "sequelize";

export interface UserAttributes {
  id: number;
  login: string;
  password: string;
  age: number;
  isDeleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserCreateAttributes extends Optional<UserAttributes, "id" | "isDeleted"> { }
export interface UserPatchAttributes extends Optional<UserAttributes, "id" | "isDeleted" | "login" | "password" | "age"> { }
export interface UserModel extends Model<UserCreateAttributes>, UserAttributes { }
export class User extends Model<UserModel, UserAttributes> { }
export type UserInstance = typeof Model & {
  new(values?: object, options?: BuildOptions): UserModel;
};
