import { DataSource, DataSourceOptions } from 'typeorm';
import { User } from './users/user.entity';
import { Question } from './questions/question.entity';
import { Tag } from './tags/tag.entity';

const rawDataSourceOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: '1234',
  database: 'stack',
  synchronize: false,
  entities: [
    User, Question, Tag
  ],
  seeds: ['dist/src/seeds/**/*.js'],
  migrations: ['dist/src/migrations/*.js'],
};

export const dataSourceOptions = rawDataSourceOptions as DataSourceOptions;

const dataSource = new DataSource(dataSourceOptions);

export default dataSource;