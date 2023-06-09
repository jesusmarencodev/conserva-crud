import { Router, Request, Response } from "express";
import {
  OrderNotFoundException,
  createOrder,
  deleteOrder,
  getOne,
  getOrders,
  updateOrder,
} from "../services/order-service";
import { CreateOrderDto, UpdateOrderDto } from "../dto/general.dto";
import { validateOrReject } from "class-validator";

const router = Router();

router.get("/", (req: Request, res: Response) => {
  const orders = getOrders();
  res.json(orders);
});

router.get("/:id", (req: Request, res: Response) => {
  try {
    const order = getOne(req.params.id);
    res.json(order);
  } catch (error) {
    if (error instanceof OrderNotFoundException) {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
});

router.post("/", async (req: Request, res: Response) => {
  const createOrderDto: CreateOrderDto = req.body;

  try {
    await validateOrReject(createOrderDto);

    const order = createOrder(createOrderDto.name, createOrderDto.items);
    res.status(201).json(order);
  } catch (errors) {
    res.status(400).json({ error: "Invalid input data" });
  }
});

router.put("/:id", async (req: Request, res: Response) => {
  const updateOrderDto: UpdateOrderDto = req.body;

  try {
    await validateOrReject(updateOrderDto);

    const orderId = req.params.id;
    const updatedOrder = updateOrder(orderId, updateOrderDto);

    res.json(updatedOrder);
  } catch (errors) {
    res.status(400).json({ error: "Invalid input data" });
  }
});

router.delete("/:id", (req: Request, res: Response) => {
  const orderId = req.params.id;

  res.json(deleteOrder(orderId));
});

export default router;
