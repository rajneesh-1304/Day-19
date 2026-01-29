import { DataSource, DataSourceOptions } from 'typeorm';
import { User } from './users/user.entity';

const rawDataSourceOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'admin',
  database: 'stack',
  synchronize: false,
  entities: [
    User,
  ],
  seeds: ['dist/src/seeds/**/*.js'],
  migrations: ['dist/src/migrations/*.js'],
};

export const dataSourceOptions = rawDataSourceOptions as DataSourceOptions;

const dataSource = new DataSource(dataSourceOptions);

export default dataSource;