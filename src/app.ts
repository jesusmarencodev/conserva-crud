import express from "express";

import cors from "cors";
import orderRoutes from './routes/routes';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/orders', orderRoutes);

export default app;


