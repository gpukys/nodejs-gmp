import { Op } from "sequelize";
import { FindOptions } from "sequelize";
import { UserCreateAttributes, UserInstance, UserModel, UserPatchAttributes } from "../types";

class UserService {
  private userModel: UserInstance;

  constructor(userModel: UserInstance) {
    this.userModel = userModel;
  }

  getUsers(loginSubstring?: string, limit?: number): Promise<UserModel[]> {
    const options: FindOptions<UserCreateAttributes> = {
      order: [['login', 'ASC']]
    };
    if (loginSubstring) {
      options.where = { login: { [Op.like]: `%${loginSubstring}%` } };
    }

    if (limit) {
      options.limit = limit;
    }

    return this.userModel.findAll(options);
  }

  getUserById(id: number): Promise<UserModel> {
    return this.userModel.findByPk(id);
  }

  createNew(user: UserCreateAttributes): Promise<{ success: boolean, errors: { message: string }[], user: UserModel | null }> {
    return this.userModel.create(user, { raw: true })
      .then(e => ({ success: true, errors: [], user: e }))
      .catch(err => ({ success: false, errors: err.errors, user: null }));
  }

  patchUserById(id: number, payload: UserPatchAttributes): Promise<{ success: boolean, errors: { message: string }[], user: UserModel[] | null }> {
    return this.userModel.update(payload, { where: { id }, returning: true })
      .then(e => ({ success: true, errors: [], user: e[1] }))
      .catch(err => ({ success: false, errors: err.errors, user: null }));
  }
}

export default UserService;
