const Job = require("../models/Job");

const createJob = async (req, res) => {
  const job = await Job.create(req.body);
  res.status(201).json(job);
};

const getJobsByCategory = async (req, res) => {
  const jobs = await Job.find({ category: req.params.category, assigned: false });
  res.json(jobs);
};

module.exports = { createJob, getJobsByCategory };
