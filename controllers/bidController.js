const express = require("express");
const { createBid, getBidsForJob, updateBidStatus } = require("../controllers/bidController");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, createBid);
router.get("/:jobId", protect, getBidsForJob);
router.put("/:bidId", protect, updateBidStatus);

module.exports = router;
