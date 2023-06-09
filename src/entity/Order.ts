import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Item } from "./Item";

@Entity()
export class Order {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @OneToMany(() => Item, item => item.order)
  items: Item[];

}
