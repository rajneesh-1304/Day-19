import { DataSource, DataSourceOptions } from 'typeorm';
import { User } from './users/user.entity';
import { Question } from './questions/question.entity';
import { Tag } from './tags/tag.entity';
import { Answer } from './answers/answer.entity';

const rawDataSourceOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'admin',
  database: 'stack',
  synchronize: false,
  entities: [
    User, Question, Tag, Answer
  ],
  seeds: ['dist/src/seeds/**/*.js'],
  migrations: ['dist/src/migrations/*.js'],
  logging: true
};

export const dataSourceOptions = rawDataSourceOptions as DataSourceOptions;

const dataSource = new DataSource(dataSourceOptions);

export default dataSource;