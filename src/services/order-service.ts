import { v4 as uuidv4 } from "uuid";
import { ItemDto, CreateOrderDto } from "../dto/general.dto";
import { Item } from "../entity/Item";


let orders: CreateOrderDto[] = [
  {
    id: "b17f6c5f-3fcc-4b51-8b76-06d71f37cf5e",
    name: "je",
    items: [
      {
        id:"3fcc-4b51-8b76-06d71f37cf5e-b17f6c5f",
        name: "jojo",
        quantity: 1,
      },
    ],
  },
];

export function getOrders(): CreateOrderDto[] {
  return orders;
}

export function getOne(id: string): CreateOrderDto {
  const order = orders.find((o) => o.id === id);
  if (!order) {
    throw new OrderNotFoundException("Order not found");
  }
  return order;
}

export function createOrder(name: string, items: ItemDto[]): CreateOrderDto {
  const order: CreateOrderDto = {
    id: uuidv4(),
    name,
    items,
  };

  orders.push(order);
  return order;
}

export function updateOrder(
  id: string,
  updatedFields: Partial<CreateOrderDto>
): CreateOrderDto {
  const order = getOne(id);

  const updatedOrder: CreateOrderDto = {
    ...order,
    ...updatedFields,
  };
  const index = orders.findIndex((o) => o.id === id);
  orders[index] = updatedOrder;
  return updatedOrder;
}

export function deleteOrder(orderId: string): CreateOrderDto {
  const order = getOne(orderId);
  orders = orders.filter((o) => o.id !== order.id);
  return order;
}

export class OrderNotFoundException extends Error {
  constructor(message: string) {
    super(message);
    this.name = "OrderNotFoundException";
  }
}
