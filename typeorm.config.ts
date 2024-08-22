import { DataSource } from 'typeorm';
import { DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

export const typeOrmOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: +process.env.POSTGRES_PORT,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities: ['dist/src/modules/*/entities/*.entity{.ts,.js}'],
  migrations: ['dist/src/migrations/**/*.js'],
  synchronize: false,
  logging: process.env.NODE_ENV === 'DEV' ? true : false,
};

const typeOrmDataSource = new DataSource(typeOrmOptions);

export default typeOrmDataSource;
