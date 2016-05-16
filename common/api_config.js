/**
 * @author qianqing
 * @create by 16-3-8
 * @description
 */
var api_config = require('./api_config.json');

var ApiFactory = {
  CreateApi: function (model) {
    var api;
    switch (model) {
      case "login":
        api = new LoginApi();
        break;
      case "customer":
        api = new CustomerApi();
        break;
      case "product":
        api = new ProductApi();
        break;
      case "shopping":
        api = new ShoppingApi();
        break;
      case "order":
        api = new OrderApi();
        break;
      case "oss":
        api = new OSSApi();
        break;
      default:
        throw new Error("ApiFactory Unsupported: " + model);
        break;
    }
    return api;
  }
};

exports = module.exports = ApiFactory;

var LoginApi = function () {
};

LoginApi.prototype = {
  login: function () {
    return api_config.loginService.baseUrl + api_config.loginService.method.login;
  },
  getCaptcha: function () {
    return api_config.loginService.baseUrl + api_config.loginService.method.getCaptcha;
  },
  registerAndLogin: function () {
    return api_config.loginService.baseUrl + api_config.loginService.method.registerAndLogin;
  },
  forgetPassword: function () {
    return api_config.loginService.baseUrl + api_config.loginService.method.forgetPassword;
  },
  modifyPassword: function () {
    return api_config.loginService.baseUrl + api_config.loginService.method.modifyPassword;
  },
  isRegistered: function () {
    return api_config.loginService.baseUrl + api_config.loginService.method.isRegistered;
  }
};

var CustomerApi = function () {
};

CustomerApi.prototype = {
  perfectCustomerInfo: function () {
    return api_config.customerService.baseUrl + api_config.customerService.method.perfectCustomerInfo;
  },
  getStoreInfo: function () {
    return api_config.customerService.baseUrl + api_config.customerService.method.getStoreInfo;
  },
  setStoreInfo: function () {
    return api_config.customerService.baseUrl + api_config.customerService.method.setStoreInfo;
  },
  getNoticeMessage: function () {
    return api_config.customerService.baseUrl + api_config.customerService.method.getNoticeMessage;
  },
  getUnreadNoticeCount: function () {
    return api_config.customerService.baseUrl + api_config.customerService.method.getUnreadNoticeCount;
  },
  setNoticeStatus: function () {
    return api_config.customerService.baseUrl + api_config.customerService.method.setNoticeStatus;
  },
  getReceiver: function () {
    return api_config.customerService.baseUrl + api_config.customerService.method.getReceiver;
  },
  setDefaultReceiver: function () {
    return api_config.customerService.baseUrl + api_config.customerService.method.setDefaultReceiver;
  },
  delReceiver: function () {
    return api_config.customerService.baseUrl + api_config.customerService.method.delReceiver;
  },
  modifyReceiver: function () {
    return api_config.customerService.baseUrl + api_config.customerService.method.modifyReceiver;
  },
  addReceiver: function () {
    return api_config.customerService.baseUrl + api_config.customerService.method.addReceiver;
  },
  getAllStreet: function () {
    return api_config.customerService.baseUrl + api_config.customerService.method.getAllStreet;
  },
  getMyFavorite: function () {
    return api_config.customerService.baseUrl + api_config.customerService.method.getMyFavorite;
  },
  addFavorite: function () {
    return api_config.customerService.baseUrl + api_config.customerService.method.addFavorite;
  },
  delFavorite: function () {
    return api_config.customerService.baseUrl + api_config.customerService.method.delFavorite;
  },
  getUserInfo: function () {
    return api_config.customerService.baseUrl + api_config.customerService.method.getUserInfo;
  },
  getBuyReport: function () {
    return api_config.customerService.baseUrl + api_config.customerService.method.getBuyReport;
  },
  getHeadImg: function () {
    return api_config.customerService.baseUrl + api_config.customerService.method.getHeadImg;
  }
};

var ProductApi = function () {
};

ProductApi.prototype = {
  getCategory: function () {
    return api_config.productService.baseUrl + api_config.productService.method.getCategory;
  },
  getCategoryProduct: function () {
    return api_config.productService.baseUrl + api_config.productService.method.getCategoryProduct;
  },
  getNewProduct: function () {
    return api_config.productService.baseUrl + api_config.productService.method.getNewProduct;
  },
  getSalesProduct: function () {
    return api_config.productService.baseUrl + api_config.productService.method.getSalesProduct;
  },
  getSecKillProduct: function () {
    return api_config.productService.baseUrl + api_config.productService.method.getSecKillProduct;
  },
  getProductDetail: function () {
    return api_config.productService.baseUrl + api_config.productService.method.getProductDetail;
  },
  getSecKillProductDetail: function () {
    return api_config.productService.baseUrl + api_config.productService.method.getSecKillProductDetail;
  },
  getGroupProductDetail: function () {
    return api_config.productService.baseUrl + api_config.productService.method.getGroupProductDetail;
  },
  getHome: function () {
    return api_config.productService.baseUrl + api_config.productService.method.getHome;
  },
  getRecommend: function () {
    return api_config.productService.baseUrl + api_config.productService.method.getRecommend;
  },
  getRecommendProduct: function () {
    return api_config.productService.baseUrl + api_config.productService.method.getRecommendProduct;
  },
  getGroupProduct: function () {
    return api_config.productService.baseUrl + api_config.productService.method.getGroupProduct;
  },
  searchProduct: function () {
    return api_config.productService.baseUrl + api_config.productService.method.searchProduct;
  },
  getCarousel: function () {
    return api_config.productService.baseUrl + api_config.productService.method.getCarousel;
  }
};

var ShoppingApi = function () {
};

ShoppingApi.prototype = {
  addToCart: function () {
    return api_config.shoppingService.baseUrl + api_config.shoppingService.method.addToCart;
  },
  delInCart: function () {
    return api_config.shoppingService.baseUrl + api_config.shoppingService.method.delInCart;
  },
  getCartInfo: function () {
    return api_config.shoppingService.baseUrl + api_config.shoppingService.method.getCartInfo;
  },
  getCountInCart: function () {
    return api_config.shoppingService.baseUrl + api_config.shoppingService.method.getCountInCart;
  },
  modifyQtyInCart: function () {
    return api_config.shoppingService.baseUrl + api_config.shoppingService.method.modifyQtyInCart;
  },
  submitOrder: function () {
    return api_config.shoppingService.baseUrl + api_config.shoppingService.method.submitOrder;
  },
  getUserPromotion: function () {
    return api_config.shoppingService.baseUrl + api_config.shoppingService.method.getUserPromotion;
  }
};

var OrderApi = function () {
};

OrderApi.prototype = {
  getOrderDetail: function () {
    return api_config.orderService.baseUrl + api_config.orderService.method.getOrderDetail;
  },
  createPaymentRecord: function () {
    return api_config.orderService.baseUrl + api_config.orderService.method.createPaymentRecord;
  },
  cancelOrder: function () {
    return api_config.orderService.baseUrl + api_config.orderService.method.cancelOrder;
  },
  getOrderList: function () {
    return api_config.orderService.baseUrl + api_config.orderService.method.getOrderList;
  },
  rebuyByOrderId: function () {
    return api_config.orderService.baseUrl + api_config.orderService.method.rebuyByOrderId;
  },
  setOrderPayment: function () {
    return api_config.orderService.baseUrl + api_config.orderService.method.setOrderPayment;
  }
};

var OSSApi = function () {
};

OSSApi.prototype = {
  headPicture: function () {
    return api_config.ossFilePath.method.headPicture;
  },
  headPictureAll: function () {
    return api_config.ossFilePath.baseUrl + api_config.ossFilePath.method.headPicture;
  }
};


