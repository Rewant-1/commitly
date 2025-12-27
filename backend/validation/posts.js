import { z } from "zod";
import { objectIdSchema, paginationQuerySchema } from "./common.js";

export const postIdParamsSchema = z.object({
	id: objectIdSchema,
});

export const createPostBodySchema = z.object({
	text: z.string().trim().optional().default(""),
	img: z.string().optional(),
});

export const commentBodySchema = z.object({
	text: z.string().trim().min(1, "Text field is required"),
});

export const userIdParamsSchema = z.object({
	id: objectIdSchema,
});

export const usernameParamsSchema = z.object({
	username: z.string().trim().min(1, "Username is required"),
});

export const feedQuerySchema = paginationQuerySchema;
