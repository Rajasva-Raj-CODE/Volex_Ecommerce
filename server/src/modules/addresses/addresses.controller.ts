import type { Response, NextFunction } from "express";
import type { AuthRequest } from "../../middleware/auth.middleware";
import * as service from "./addresses.service";
import { success } from "../../utils/response";

export async function getAddresses(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const addresses = await service.getAddresses(req.user!.userId);
    success(res, { addresses });
  } catch (err) { next(err); }
}

export async function createAddress(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const address = await service.createAddress(req.user!.userId, req.body);
    success(res, { address }, "Address created", 201);
  } catch (err) { next(err); }
}

export async function updateAddress(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const address = await service.updateAddress(req.user!.userId, id, req.body);
    success(res, { address }, "Address updated");
  } catch (err) { next(err); }
}

export async function deleteAddress(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    await service.deleteAddress(req.user!.userId, id);
    success(res, null, "Address deleted");
  } catch (err) { next(err); }
}
