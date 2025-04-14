const mongoose = require('mongoose');

const institutionSchema = new mongoose.Schema({
  instituteName: { type: String, required: true },
  idNumber: { type: String, required: true },
  year: { type: String, required: true },
  branch: { type: String, required: true },
});

// Prevent model overwrite
const Institution = mongoose.models.Institution || mongoose.model('Institution', institutionSchema);

module.exports = Institution;
