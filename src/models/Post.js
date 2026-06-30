const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    adminId:   { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', default: null },
    adminName: { type: String, default: '' },
    title:        { type: String, required: true },
    slug:         { type: String, required: true, unique: true },
    excerpt:      { type: String, default: '' },
    content:      { type: String, default: '' },
    thumbnailUrl: { type: String, default: '' },
    thumbnailPublicId: { type: String, default: '' },
    images: [
      {
        url:      String,
        publicId: String,
      },
    ],
    categoryTag: { type: String, default: 'kien-thuc' },
    tags:        [{ type: String }],
    status:      { type: String, enum: ['draft', 'published'], default: 'draft' },
    viewCount:   { type: Number, default: 0 },
    metaTitle:       { type: String, default: '' },
    metaDescription: { type: String, default: '' },
    publishedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

postSchema.index({ slug: 1 });
postSchema.index({ status: 1, publishedAt: -1 });

module.exports = mongoose.model('Post', postSchema);
