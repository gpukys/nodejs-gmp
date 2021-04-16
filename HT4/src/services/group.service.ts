import { Op } from "sequelize";
import { FindOptions } from "sequelize";
import { GroupCreateAttributes, GroupInstance, GroupModel, GroupPatchAttributes } from "../types";

class GroupService {
  private groupModel: GroupInstance;

  constructor(groupModel: GroupInstance) {
    this.groupModel = groupModel;
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
}

export default GroupService;
