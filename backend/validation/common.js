import mongoose from "mongoose";
import { z } from "zod";

export const objectIdSchema = z
	.string()
	.refine((val) => mongoose.Types.ObjectId.isValid(val), {
		message: "Invalid id",
	});

export const paginationQuerySchema = z.object({
	page: z
		.coerce
		.number()
		.int()
		.min(1)
		.default(1),
	limit: z
		.coerce
		.number()
		.int()
		.min(1)
		.max(50)
		.default(10),
});
