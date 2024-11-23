const mongoose = require('mongoose');

const assetSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  symbol: { type: String, required: true },
  open: Number,
  high: Number,
  low: Number,
  close: Number,
  adjusted_close: Number,
  volume: Number,
  asset_type: String,
  retrieved_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Asset', assetSchema);
