import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
	return res.status(200).json({
		status: "ok",
		uptimeSeconds: Math.floor(process.uptime()),
		timestamp: new Date().toISOString(),
	});
});

export default router;
