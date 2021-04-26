import { Sequelize } from "sequelize";
import { User } from "../models";
import { GroupCreateAttributes, GroupInstance, GroupModel, GroupPatchAttributes, UserInstance } from "../types";

class GroupService {
  private groupModel: GroupInstance;
  private userModel: UserInstance;
  private sequelize: Sequelize;

  constructor(groupModel: GroupInstance, userModel: UserInstance, sequelize: Sequelize) {
    this.groupModel = groupModel;
    this.userModel = userModel;
    this.sequelize = sequelize;
  }

  getGroups(): Promise<GroupModel[]> {
    return this.groupModel.findAll();
  }

  getGroupById(id: number): Promise<GroupModel> {
    return this.groupModel.findByPk(id);
  }

  createNew(group: GroupCreateAttributes): Promise<{ success: boolean, errors: { message: string }[], group: GroupModel | null }> {
    return this.groupModel.create(group, { raw: true })
      .then(e => ({ success: true, errors: [], group: e }))
      .catch(err => ({ success: false, errors: err.errors, group: null }));
  }

  patchGroupById(id: number, payload: GroupPatchAttributes): Promise<{ success: boolean, errors: { message: string }[], group: GroupModel[] | null }> {
    return this.groupModel.update(payload, { where: { id }, returning: true })
      .then(e => ({ success: true, errors: [], group: e[1] }))
      .catch(err => ({ success: false, errors: err.errors, group: null }));
  }

  deleteById(id: number): Promise<{ success: boolean, errors: { message: string }[] }> {
    return this.groupModel.destroy({ where: { id }, force: true })
      .then(e => ({ success: true, errors: [] }))
      .catch(err => ({ success: false, errors: err.errors }));
  }

  async addUsersToGroup(groupId: number, userIds: number[]): Promise<{ success: boolean, errors: { message: string }[] }> {
    const transaction = await this.sequelize.transaction();
    try {
      const users = await this.userModel.findAll({ where: { id: userIds }, transaction });
      if (!users || users.length === 0) {
        throw [{ message: 'No users would be affected' }];
      }
      const group = await this.groupModel.findByPk(groupId, { transaction });
      if (!group) {
        throw [{ message: 'Group not found' }];
      }
      await Promise.all(users.map(e => group.addUser(e, { transaction })));

      await transaction.commit();
      return { success: true, errors: [] };
    } catch (e) {
      await transaction.rollback();
      return { success: false, errors: e };
    }
  }
}

export default GroupService;
