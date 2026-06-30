const router = require('express').Router();
const { getSetting, getSettings } = require('../../controllers/public/setting.controller');

router.get('/',     getSettings);
router.get('/:key', getSetting);

module.exports = router;
