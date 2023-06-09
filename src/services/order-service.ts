import { v4 as uuidv4 } from 'uuid';
import { ItemDto, CreateOrderDto, UpdateOrderDto } from '../dto/general.dto';
import { FindOneOptions, Repository, getManager, getRepository } from 'typeorm';
import { Order } from '../entity/Order';
import { Item } from '../entity/Item';

let orderRepository: Repository<Order>;

export async function getOrders(): Promise<Order[]> {
  return await Order.find({ relations: ['items'] });
}

export async function getOne(id: string): Promise<Order> {
  const options: FindOneOptions<Order> = {
    where: { id },
    relations: ['items'],
  };
  const order = await Order.findOne(options);
  if (!order) {
    throw new OrderNotFoundException('Order not found');
  }
  return order;
}

export async function createOrder(
  createOrderDto: CreateOrderDto
): Promise<any> {
  const { name, items } = createOrderDto;

  const order = new Order();
  order.name = name;

  const savedOrder = await order.save();

  const itemPromises = items.map(async (item) => {
    const newItem = new Item();
    newItem.name = item.name;
    newItem.quantity = item.quantity;
    newItem.order = savedOrder;
    const savedItem = await newItem.save();
    return {
      name: savedItem.name,
      quantity: savedItem.quantity,
      id: savedItem.id,
    };
  });

  const savedItems = await Promise.all(itemPromises);

  const response = {
    order: {
      name: savedOrder.name,
      id: savedOrder.id,
      items: savedItems,
    },
  };

  return response;
}

export async function updateOrder(
  id: string,
  idItem: string,
  updatedFields: Partial<UpdateOrderDto>
): Promise<Boolean> {
  const order = await getOne(id);
  order.name = updatedFields?.name ? updatedFields?.name : order.name;
  await order.save();
  if (updatedFields.item) {
    const item = await getItem(idItem);
    item.name = updatedFields.item.name ? updatedFields.item.name : item.name;
    item.quantity = updatedFields.item.quantity
      ? updatedFields?.item.quantity
      : item.quantity;
    item.save();
  }

  return true;
}

export async function deleteOrder(id: string): Promise<boolean> {
  const order = await getOne(id);

  if (!order) {
    throw new OrderNotFoundException('Order not found');
  }

  const items = order.items;

  for (const item of items) {
    await Item.delete(item.id);
  }

  await Order.delete(id);

  return true;
}

export class OrderNotFoundException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'OrderNotFoundException';
  }
}

export async function getItem(id: string): Promise<Item> {
  const options: FindOneOptions<Item> = { where: { id } };
  const item = await Item.findOne(options);
  if (!item) {
    throw new OrderNotFoundException('Order not found');
  }
  return item;
}
