
import "reflect-metadata";
import { DataSource } from "typeorm";
import dotenv from 'dotenv';
import { Order } from "../entity/Order";
import { Item } from "../entity/Item";
dotenv.config();

export const database = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.POSTGRES_DB,
  synchronize: true,
  logging: true,
  entities: [Order, Item],
});





