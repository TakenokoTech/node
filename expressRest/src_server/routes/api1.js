const express = require('express');
const router = express.Router();
const CONST = require('../const')
const log = require('../utils/log')

router.get('/1/:id', (req, res, next) => {

    log.debug(`req.params = ${JSON.stringify(req.params)}`);
    log.debug(`req.query = ${JSON.stringify(req.query)}`);

    var param = {"値":"これはサンプルAPIです"};

    res.header(CONST.CONTENT_TYPE, CONST.CONTENT_TYPE_JSON)
    res.send(param);
});

router.post('/2', (req, res, next) => {
    log.debug(`req.body = ${JSON.stringify(req.body)}`);
    var param = {"値":"POSTメソッドのリクエストを受け付けました","bodyの値":req.body.card};
    
    res.header(CONST.CONTENT_TYPE, CONST.CONTENT_TYPE_JSON)
    res.send(param);
  });
  

module.exports = router;