const express = require('express');
const router = express.Router();
const cont = require('../controller/cluster');
const contDetail = require('../controller/detail');
const excel = require('../controller/excel');

router.route('/').get(cont.cluster1)
router.route('/cluster2').get(cont.cluster2)
router.route('/cluster3').get(cont.cluster3)
router.route('/cluster4').get(cont.cluster4)
router.route('/:line/:part').get(contDetail.detailLine)
router.route('/:line/:part/detailreject').get(contDetail.detailNG)
router.route('/download').get(excel.downloadExcel)

module.exports = router

