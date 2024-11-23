const express = require('express');
const { storeAssetData, searchSymbols } = require('../controllers/dataController');

const router = express.Router();

router.get('/fetch', storeAssetData);
router.get('/search', searchSymbols);

module.exports = router;
