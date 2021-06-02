import { Sequelize } from 'sequelize';
import { GroupFactory } from './group.model';
import { UserFactory } from './user.model';

export const db = new Sequelize(process.env.DB_CONNECTION_STRING, {
  dialect: "postgres",
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
});

const User = UserFactory(db);
const Group = GroupFactory(db);

User.belongsToMany(Group, { through: 'UserGroup', onDelete: 'CASCADE' });
Group.belongsToMany(User, { through: 'UserGroup', onDelete: 'CASCADE' });

export { User, Group };
