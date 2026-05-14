import type { Request, Response, NextFunction } from "express";
import { success } from "../../utils/response";
import { productReviewsQuerySchema, reviewQuerySchema } from "./reviews.schema";
import * as service from "./reviews.service";
import type { AuthRequest } from "../../middleware/auth.middleware";

export async function createReview(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const productId = Array.isArray(req.params.productId)
      ? req.params.productId[0]
      : req.params.productId;
    const review = await service.createReview(
      req.user!.userId,
      productId,
      req.body
    );
    success(res, { review }, "Review submitted successfully", 201);
  } catch (err) {
    next(err);
  }
}

export async function getProductReviews(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const productId = Array.isArray(req.params.productId)
      ? req.params.productId[0]
      : req.params.productId;
    const query = productReviewsQuerySchema.parse(req.query);
    const result = await service.getProductReviews(productId, query);
    success(res, result);
  } catch (err) {
    next(err);
  }
}

export async function listAllReviews(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const query = reviewQuerySchema.parse(req.query);
    const result = await service.listAllReviews(query);
    success(res, result);
  } catch (err) {
    next(err);
  }
}

export async function updateReviewStatus(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const review = await service.updateReviewStatus(id, req.body.isApproved);
    success(res, { review }, "Review status updated");
  } catch (err) {
    next(err);
  }
}

export async function deleteReview(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    await service.deleteReview(id);
    success(res, null, "Review deleted");
  } catch (err) {
    next(err);
  }
}
