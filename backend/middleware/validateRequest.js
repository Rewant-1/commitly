import { z } from "zod";

const formatZodError = (error) => {
	if (!(error instanceof z.ZodError)) return null;
	return error.issues.map((issue) => ({
		path: issue.path.join("."),
		message: issue.message,
	}));
};

/**
 * validateRequest({ body, params, query })
 * Each key is an optional Zod schema.
 */
export const validateRequest = ({ body, params, query }) => {
	return (req, res, next) => {
		try {
			if (body) {
				const parsed = body.safeParse(req.body);
				if (!parsed.success) {
					return res.status(400).json({
						error: "ValidationError",
						message: "Invalid request body",
						details: formatZodError(parsed.error),
					});
				}
				req.body = parsed.data;
			}

			if (params) {
				const parsed = params.safeParse(req.params);
				if (!parsed.success) {
					return res.status(400).json({
						error: "ValidationError",
						message: "Invalid route parameters",
						details: formatZodError(parsed.error),
					});
				}
				req.params = parsed.data;
			}

			if (query) {
				const parsed = query.safeParse(req.query);
				if (!parsed.success) {
					return res.status(400).json({
						error: "ValidationError",
						message: "Invalid query parameters",
						details: formatZodError(parsed.error),
					});
				}
				req.query = parsed.data;
			}

			next();
		} catch (err) {
			next(err);
		}
	};
};
