import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Order } from "../entity/Order";

@Entity()
export class Item {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    quantity: number;

    @ManyToOne(() => Order, order => order.items)
    order: Order;
}
