import { Router, Request, Response } from 'express';
import * as Joi from 'joi';
import {
  OrderNotFoundException,
  createOrder,
  deleteOrder,
  getOne,
  getOrders,
  updateOrder,
} from '../services/order-service';
import { CreateOrderDto, UpdateOrderDto } from '../dto/general.dto';
import { validateOrReject } from 'class-validator';
// import { validateOrReject } from 'class-validator';

const router = Router();

// using Joi
const updateOrderSchema = Joi.object({
  name: Joi.string().required(),
  item: Joi.object({
    name: Joi.string().required(),
    quantity: Joi.number().required(),
  }).required(),
});

router.get('/', async (req: Request, res: Response) => {
  try {
    const orders = await getOrders();
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const order = await getOne(req.params.id);
    res.json(order);
  } catch (error) {
    console.log(error);
    if (error instanceof OrderNotFoundException) {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
});

router.post('/', async (req: Request, res: Response) => {
  const createOrderDto: CreateOrderDto = req.body;

  try {
    await validateOrReject(createOrderDto);

    const order = await createOrder(createOrderDto);
    res.status(201).json(order);
  } catch (errors) {
    res.status(400).json({ error: 'Invalid input data' });
  }
});

router.put('/:orderId/:itemId', async (req: Request, res: Response) => {
  const updateOrderDto: UpdateOrderDto = req.body;

  try {
    await updateOrderSchema.validateAsync(updateOrderDto);

    const orderId = req.params.orderId;
    const itemId = req.params.itemId;
    const updatedOrder = await updateOrder(orderId, itemId, updateOrderDto);

    res.json(updatedOrder);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: 'Invalid input data' });
  }
});

router.delete('/:id', async (req: Request, res: Response) => {
  const orderId = req.params.id;

  try {
    const deletedOrder = await deleteOrder(orderId);
    res.json(deletedOrder);
  } catch (error) {
    if (error instanceof OrderNotFoundException) {
      res.status(404).json({ error: error.message });
    } else {
      console.log(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
});

export default router;
