import { Item } from '../entity/Item';
import { Order } from '../entity/Order';
import {
  getOrders,
  getOne,
  OrderNotFoundException,
  createOrder,
  updateOrder,
  deleteOrder,
  getItem,
} from '../services/order-service';

// Mocks
jest.mock('typeorm', () => ({
  Order: {
    find: jest.fn().mockResolvedValue([{ id: 1, name: 'Order 1', items: [] }]),
    findOne: jest.fn().mockResolvedValue({ id: 1, name: 'Order 1', items: [] }),
  },
  Item: {
    findOne: jest
      .fn()
      .mockResolvedValue({ id: 1, name: 'Item 1', quantity: 1 }),
    delete: jest.fn(),
  },
}));

describe('Functions', () => {
  describe('getOrders', () => {
    it('should return an array of orders', async () => {
      const orders = await getOrders();
      expect(orders).toEqual([{ id: 1, name: 'Order 1', items: [] }]);
    });
  });

  describe('getOne', () => {
    it('should return an order', async () => {
      const order = await getOne('1');
      expect(order).toEqual({ id: 1, name: 'Order 1', items: [] });
    });

    it('should throw OrderNotFoundException when order is not found', async () => {
      expect.assertions(1);
      try {
        await getOne('2');
      } catch (error) {
        expect(error).toBeInstanceOf(OrderNotFoundException);
      }
    });
  });

  describe('createOrder', () => {
    it('should create an order', async () => {
      const createOrderDto = {
        name: 'New Order',
        items: [{ name: 'Item 1', quantity: 1 }],
      };

      const response = await createOrder(createOrderDto);

      expect(response.order.name).toBe('New Order');
      expect(response.order.items).toEqual([
        { id: 1, name: 'Item 1', quantity: 1 },
      ]);
    });
  });

  describe('updateOrder', () => {
    it('should update an order', async () => {
      const id = '1';
      const idItem = '1';
      const updatedFields = {
        name: 'Updated Order',
        item: { name: 'Updated Item', quantity: 2 },
      };

      const result = await updateOrder(id, idItem, updatedFields);

      expect(result).toBe(true);
    });
  });

  describe('deleteOrder', () => {
    it('should delete an order', async () => {
      const id = '1';

      const result = await deleteOrder(id);

      expect(result).toBe(true);
      expect(Item.delete).toHaveBeenCalledWith(1);
      expect(Order.delete).toHaveBeenCalledWith(id);
    });
  });

  describe('getItem', () => {
    it('should return an item', async () => {
      const item = await getItem('1');
      expect(item).toEqual({ id: 1, name: 'Item 1', quantity: 1 });
    });

    it('should throw OrderNotFoundException when item is not found', async () => {
      expect.assertions(1);
      try {
        await getItem('2');
      } catch (error) {
        expect(error).toBeInstanceOf(OrderNotFoundException);
      }
    });
  });
});
