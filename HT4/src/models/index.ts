import { Sequelize } from 'sequelize';
import { GroupFactory } from './group.model';
import { UserFactory } from './user.model';

export const db = new Sequelize('postgres://kdpvnzotxlfury:7cc0950893756a14f0cdf7227f0fa341bbff55d868873d3236617a22c009a17b@ec2-54-216-185-51.eu-west-1.compute.amazonaws.com:5432/d5jpug7qv7ib3k', {
  dialect: "postgres",
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
});

export const User = UserFactory(db);
export const Group = GroupFactory(db);
