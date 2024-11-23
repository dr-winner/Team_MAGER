const express = require('express');
const { storeAssetData } = require('../controllers/dataController');

const router = express.Router();

router.post('/fetch', storeAssetData);

module.exports = router;
