const router = require('express').Router();
const { getCategories, getCategorySizes, getWoodMaterials } = require('../../controllers/public/category.controller');

router.get('/wood-materials', getWoodMaterials);
router.get('/',               getCategories);
router.get('/:code/sizes',    getCategorySizes);

module.exports = router;
