const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Tạo storage upload theo folder
const createStorage = (folder) =>
  new CloudinaryStorage({
    cloudinary,
    params: {
      folder: `do-go-quoc-hieu/${folder}`,
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
      transformation: [{ quality: 'auto', fetch_format: 'auto' }],
    },
  });

const uploadProduct = multer({ storage: createStorage('products') });
const uploadPost    = multer({ storage: createStorage('posts') });
const uploadGeneral = multer({ storage: createStorage('general') });

module.exports = { cloudinary, uploadProduct, uploadPost, uploadGeneral };
