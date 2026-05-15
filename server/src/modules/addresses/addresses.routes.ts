import { Router } from "express";
import { validate } from "../../middleware/validate.middleware";
import { requireAuth } from "../../middleware/auth.middleware";
import { createAddressSchema, updateAddressSchema } from "./addresses.schema";
import * as controller from "./addresses.controller";
import type { RequestHandler } from "express";

const router = Router();

router.use(requireAuth as RequestHandler);

router.get("/", controller.getAddresses as unknown as RequestHandler);
router.post("/", validate(createAddressSchema), controller.createAddress as unknown as RequestHandler);
router.put("/:id", validate(updateAddressSchema), controller.updateAddress as unknown as RequestHandler);
router.delete("/:id", controller.deleteAddress as unknown as RequestHandler);

export default router;
