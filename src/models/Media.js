const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema(
  {
    publicId:   { type: String, required: true, unique: true },
    url:        { type: String, required: true },
    folder:     { type: String, default: 'general' },
    format:     { type: String, default: 'jpg' },
    width:      { type: Number, default: 0 },
    height:     { type: Number, default: 0 },
    bytes:      { type: Number, default: 0 },
    altText:    { type: String, default: '' },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Media', mediaSchema);
