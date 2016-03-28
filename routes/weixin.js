/**
 * @author qianqing
 * @create by 16-3-23
 * @description
 */
var express = require('express');
var unirest = require('unirest');
var router = express.Router();
var nwo = require('node-weixin-oauth');
var wx_conf = require('../weixinPay');
var WXPay = require('weixin-pay');
var path = require('path');
var fs = require('fs');
var md5 = require('../common/md5');

var ApiFactory = require('../common/api_config');
var orderApi = ApiFactory.CreateApi('order');

var wxpay = WXPay({
  appid: wx_conf.appId,
  mch_id: wx_conf.mchId,
  partner_key: wx_conf.apiKey, //微信商户平台API密钥
  pfx: fs.readFileSync(path.resolve('apiclient_cert.p12'))//微信商户平台证书
});

var app = {
  id: wx_conf.appId,
  secret: wx_conf.secret,
  token: 'weixin'
};

router.get('/oauth', function (req, res, next) {
  var url = nwo.createURL(wx_conf.appId, wx_conf.authUrl, req.query.orderId + '@' + req.query.name, 0);
  res.header('Access-Control-Allow-Origin', '*');
  res.redirect(url);
});

router.get('/openId', function (req, res, next) {
  nwo.success(app, req.query.code, function (error, body) {
    if (!error) {
      res.redirect('/book/pay-way?openId=' + body.openid + '&state=' + req.query.state);
    } else {
      res.status(500).send('no openid!');
    }
  });
});

router.post('/pay', function (req, res, next) {
  var params = {
    openid: req.body.openId,
    spbill_create_ip: getClientIp(req),
    notify_url: wx_conf.notifyUrl,
    body: '好好麦H5支付',
    detail: '公众号支付',
    out_trade_no: req.body.orderId + 'T' + Math.random().toString().substr(2, 10),
    total_fee: req.body.amount,
    attach: req.session.uid + '#' + req.body.userName
  };

  wxpay.getBrandWCPayRequestParams(params, function (err, result) {
    // in express
    if (err) {
      res.json({status: 0});
    } else {
      res.json({status: 1, payargs: result});
    }
  });
});

router.use('/pay-notify', wxpay.useWXCallback(function (msg, req, res, next) {
  // 处理商户业务逻辑

  if (msg.result_code === 'SUCCESS') {
    if (wxpay.sign(msg) === msg.sign) {
      var attach = msg.attach;
      var out_trade_no = msg.out_trade_no;
      var total = parseInt(msg.total_fee)/100;
      attach = attach.split('#');
      out_trade_no = out_trade_no.split('T');
      var userId = parseInt(attach[0]);
      var userName = attach[1];
      var orderId = parseInt(out_trade_no[0]);

      var obj = {
        "userId": userId,
        "orderId": orderId,
        "note": "微信支付",
        "buyer": userName,
        "total": total,
        "tradeId": msg.transaction_id,
        "type": 13
      };
      unirest.post(orderApi.createPaymentRecord())
        .headers({'Accept': 'application/json', 'Content-Type': 'application/json'})
        .send(obj)
        .end(function (response) {
        });
    }
  }
  res.success();
}));

router.use('/pay-notify-app', wxpay.useWXCallback(function (msg, req, res, next) {
  // 处理商户业务逻辑
  function sign (param) {
    var querystring = Object.keys(param).filter(function(key){
        return param[key] !== undefined && param[key] !== '' && ['pfx', 'partner_key', 'sign', 'key'].indexOf(key)<0;
      }).sort().map(function(key){
        return key + '=' + param[key];
      }).join("&") + "&key=" + wx_conf.mchKey;

    return md5(querystring).toUpperCase();
  }

  if (msg.result_code === 'SUCCESS') {
    if (sign(msg) === msg.sign) {
      var out_trade_no = msg.out_trade_no;
      var total = parseInt(msg.total_fee)/100;
      out_trade_no = out_trade_no.split('_');
      var userId = parseInt(out_trade_no[0]);
      var userName = '';
      var orderId = parseInt(out_trade_no[1]);

      var obj = {
        "userId": userId,
        "orderId": orderId,
        "note": "微信支付",
        "buyer": userName,
        "total": total,
        "tradeId": msg.transaction_id,
        "type": 13
      };
      unirest.post(orderApi.createPaymentRecord())
        .headers({'Accept': 'application/json', 'Content-Type': 'application/json'})
        .send(obj)
        .end(function (response) {
        });
    }
  }
  res.success();
}));

function getClientIp(req) {
  var ip = req.connection.remoteAddress;
  ip = ip.split(':');
  return ip[ip.length - 1];
}

module.exports = router;
