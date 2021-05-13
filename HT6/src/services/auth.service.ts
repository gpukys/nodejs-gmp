import { UserInstance, UserModel } from "../types";

class AuthService {
  constructor(private userModel: UserInstance) { }

  userLogin(login: string, password: string): Promise<UserModel> {
    return this.userModel.findOne({ where: { login, password } });
  }
}

export default AuthService;
