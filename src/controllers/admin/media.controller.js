const asyncHandler = require('express-async-handler');
const { cloudinary } = require('../../config/cloudinary');
const Media = require('../../models/Media');

// @desc  Upload ảnh lên Cloudinary
// @route POST /api/admin/media/upload
// Middleware multer xử lý trước — file đã được upload lên Cloudinary
const uploadMedia = asyncHandler(async (req, res) => {
  if (!req.file) { res.status(400); throw new Error('Không có file nào được upload'); }

  const media = await Media.create({
    publicId:   req.file.filename,      // multer-storage-cloudinary lưu vào filename
    url:        req.file.path,          // secure_url
    folder:     req.body.folder || 'general',
    format:     req.file.mimetype?.split('/')[1] || 'jpg',
    width:      req.file.width  || 0,
    height:     req.file.height || 0,
    bytes:      req.file.size   || 0,
    altText:    req.body.altText || '',
    uploadedBy: req.admin._id,
  });

  res.status(201).json({ success: true, data: media });
});

// @desc  Lấy danh sách ảnh
// @route GET /api/admin/media
const getMedia = asyncHandler(async (req, res) => {
  const { page = 1, limit = 24, folder } = req.query;
  const filter = folder ? { folder } : {};
  const skip  = (Number(page) - 1) * Number(limit);
  const total = await Media.countDocuments(filter);
  const media = await Media.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit));
  res.json({ success: true, data: media, pagination: { total, page: Number(page) } });
});

// @desc  Xóa ảnh (Cloudinary + DB)
// @route DELETE /api/admin/media/:id
const deleteMedia = asyncHandler(async (req, res) => {
  const media = await Media.findById(req.params.id);
  if (!media) { res.status(404); throw new Error('Không tìm thấy ảnh'); }

  // Xóa trên Cloudinary
  await cloudinary.uploader.destroy(media.publicId);

  await media.deleteOne();
  res.json({ success: true, message: 'Đã xóa ảnh' });
});

module.exports = { uploadMedia, getMedia, deleteMedia };
