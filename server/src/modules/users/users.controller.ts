import type { Request, Response, NextFunction } from "express";
import { success } from "../../utils/response";
import { usersQuerySchema } from "./users.schema";
import * as service from "./users.service";

export async function listCustomers(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const query = usersQuerySchema.parse(req.query);
    const result = await service.listCustomers(query);
    success(res, result);
  } catch (err) {
    next(err);
  }
}
