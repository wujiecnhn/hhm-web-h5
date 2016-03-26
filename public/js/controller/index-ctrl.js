/**
 * @author qianqing
 * @create by 16-2-15
 * @description index page controller
 */
(function () {
  require.config({
    baseUrl: './js',
    paths: {
      'Vue': './lib/vue.min',
      'Utils': './lib/utils'
    },
    shim: {
      'Vue': {
        exports: 'Vue'
      },
      'Utils': {
        exports: 'Utils'
      }
    }
  });

  function ajaxPost(url, data, cb) {
    $.ajax({
      type: 'POST',
      url: url,
      data: data,
      timeout: 15000,
      success: function (data, status, xhr) {
        if (data.status) {
          cb(null, data);
        } else {
          cb(data.msg, null);
        }
      },
      error: function (xhr, errorType, error) {
        console.error(url + ' error: ' + errorType + '##' + error);
        cb('服务异常', null);
      }
    });
  }

  require(['Vue', 'Utils'],
    function (Vue, Utils) {
      'use strict';
      Vue.config.delimiters = ['${', '}'];
      Vue.config.unsafeDelimiters = ['{!!', '!!}'];

      $(document).on("pageInit", "#page-index", function (e, id, page) {
        var vm = new Vue({
          el: '#page-index',
          data: {
            search: '',
            banners: [],
            newsImg: '',
            salesImg: '',
            groupImg: '',
            secKillImg: '',
            recommends: [],
            message: 0
          }
        });

        ajaxPost('/get-home', {}, function (err, data) {
          $.hidePreloader();
          if (err) {
            $.toast(err, 1000);
          } else {
            var home = data.home;
            vm.banners = home.banner.slice();
            vm.newsImg = home.news.img;
            vm.salesImg = home.sales.img;
            vm.groupImg = home.group.img;
            vm.secKillImg = home.secKill.img;
            vm.recommends = home.recommend.slice();

            vm.$nextTick(function () {
              $(function () {
                $(".swiper-container").swiper({
                  spaceBetween: 30,
                  continuous: true,
                  autoplay: 2500,
                  autoplayDisableOnInteraction: false
                });
              });
            });
          }
        });
        $.showPreloader('请稍等...');


        ajaxPost('/users/get-notice-count', {}, function (err, data) {
          if (err) {
          } else {
            vm.message = data.count;
          }
        });

        $(page).on('click', '.icon-clear', function () {
          vm.search = '';
        });

      });

      $(document).on("pageInit", "#page-login", function (e, id, page) {
        var vm = new Vue({
          el: '#page-login',
          data: {
            phone: '',
            password: ''
          },
          computed: {
            isDisable: function () {
              return this.phone.length === 0 || this.password.length === 0;
            }
          },
          methods: {
            login: login
          }
        });

        function login(event) {
          if (!vm.phone) {
            $.toast("请输入手机号", 1000);
            return;
          }

          if (!vm.password) {
            $.toast("请输入密码", 1000);
            return;
          }

          if (!Utils.checkMobile(vm.phone)) {
            $.toast("请输入正确的手机号", 1000);
            return;
          }

          if (vm.isDisable) {
            return;
          }

          ajaxPost('/', {'username': vm.phone, 'password': vm.password}, function (err, data) {
            $.hidePreloader();
            if (err) {
              $.toast(err, 1000);
            } else {
              location.href = data.redirect
            }
          });

          $.showPreloader('登录中');
        }

        $(window).resize(function () {
          $('.content').scrollTop($(window).height());
        });
      });

      $(document).on("pageInit", "#page-register", function (e, id, page) {
        var vm = new Vue({
          el: '#page-register',
          data: {
            captchaTip: '获取验证码',
            isSendCaptcha: false,
            isDisable: true,
            captchaMsg: '',
            captcha: '',
            password: '',
            rePassword: '',
            phone: ''
          },
          methods: {
            sendCaptcha: sendCaptcha,
            submitReg: submitReg
          }
        });

        function sendCaptcha(event) {
          if (vm.isSendCaptcha) {
            return;
          }

          if (!vm.phone) {
            $.toast("手机号不能为空", 1000);
            return;
          }

          if (!Utils.checkMobile(vm.phone)) {
            $.toast("请输入正确的手机号", 1000);
            return;
          }

          ajaxPost('/is-registered', {'phone': vm.phone}, function (err, data) {
            if (err) {
              $.toast(err, 1000);
            } else {
              if (!data.isRegistered) {
                ajaxPost('/get-captcha', {'phone': vm.phone, 'type': 1}, function (err, data) {
                  $.hidePreloader();
                  if (err) {
                    $.toast(err, 1000);
                  } else {
                    var time = 60;
                    vm.captchaTip = time + '秒';
                    vm.isSendCaptcha = true;
                    vm.isDisable = false;
                    vm.captchaMsg = '如果您未收到短信，请在60秒后再次获取';
                    var sendCaptchaInterval = setInterval(function () {
                      time--;
                      if (time > 9) {
                        vm.captchaTip = time + '秒';
                      } else {
                        vm.captchaTip = '0' + time + '秒';
                      }
                      if (time === 0) {
                        vm.captchaTip = '获取验证码';
                        vm.isSendCaptcha = false;
                        vm.captchaMsg = '';
                        clearInterval(sendCaptchaInterval);
                      }
                    }, 1000);
                  }
                });

                $.showPreloader('发送中');
              } else {
                $.toast('该手机号已被注册', 1000);
              }
            }
          });
        }

        function submitReg(event) {
          if (!vm.isSendCaptcha) {
            return;
          }

          if (!vm.phone) {
            $.toast("手机号不能为空", 1000);
            return;
          }

          if (!vm.captcha) {
            $.toast("验证码不能为空", 1000);
            return;
          }

          if (!vm.password) {
            $.toast("密码不能为空", 1000);
            return;
          }

          if (vm.password != vm.rePassword) {
            $.toast("密码输入不一致", 1000);
            return;
          }

          if (!Utils.checkMobile(vm.phone)) {
            $.toast("请输入正确的手机号", 1000);
            return;
          }

          ajaxPost('/register', {
            'phone': vm.phone,
            'password': vm.password,
            'captcha': vm.captcha
          }, function (err, data) {
            $.hidePreloader();
            if (err) {
              $.toast(err, 1000);
            } else {
              location.href = data.redirect
            }
          });

          $.showPreloader('注册中');
        }
      });

      $(document).on("pageInit", "#page-register-complete", function (e, id, page) {
        var vm = new Vue({
          el: '#page-register-complete',
          data: {
            phone: '',
            storeName: '',
            receiver: '',
            pcdDes: '浙江省 嘉兴市 南湖区',
            address: ''
          },
          methods: {
            submitInfo: submitInfo
          }
        });

        function submitInfo(event) {
          if (vm.phone && !Utils.checkMobile(vm.phone)) {
            $.toast("请输入正确的手机号", 1000);
            return;
          }

          ajaxPost('/register-complete',
            {
              'phone': vm.phone,
              'storeName': vm.storeName,
              'receiver': vm.receiver,
              'pcdDes': vm.pcdDes,
              'address': vm.address
            },
            function (err, data) {
              $.hidePreloader();
              if (err) {
                $.toast(err, 1000);
              } else {
                $.toast('恭喜您, 注册成功！', 1000);
                var url = data.redirect;
                setTimeout(function () {
                  location.href = url;
                }, 1000);
              }
            }
          );

          $.showPreloader('请稍等');
        }

        $("#city-picker").cityPicker({
          toolbarTemplate: '<header class="bar bar-nav"><button class="button button-link pull-right close-picker">确定</button>\
        <h1 class="title">选择收货地址</h1></header>'
        });
      });

      $(document).on("pageInit", "#page-rest-password", function (e, id, page) {
        var vm = new Vue({
          el: '#page-rest-password',
          data: {
            captchaTip: '获取验证码',
            isSendCaptcha: false,
            isDisable: true,
            captchaMsg: '',
            captcha: '',
            password: '',
            rePassword: '',
            phone: ''
          },
          methods: {
            sendCaptcha: sendCaptcha,
            restPW: restPW
          }
        });

        function sendCaptcha(event) {
          if (vm.isSendCaptcha) {
            return;
          }

          if (!vm.phone) {
            $.toast("手机号不能为空", 1000);
            return;
          }

          if (!Utils.checkMobile(vm.phone)) {
            $.toast("请输入正确的手机号", 1000);
            return;
          }

          ajaxPost('/get-captcha', {'phone': vm.phone, 'type': 1}, function (err, data) {
            $.hidePreloader();
            if (err) {
              $.toast(err, 1000);
            } else {
              var time = 60;
              vm.captchaTip = time + '秒';
              vm.isSendCaptcha = true;
              vm.isDisable = false;
              vm.captchaMsg = '如果您未收到短信，请在60秒后再次获取';
              var sendCaptchaInterval = setInterval(function () {
                time--;
                if (time > 9) {
                  vm.captchaTip = time + '秒';
                } else {
                  vm.captchaTip = '0' + time + '秒';
                }
                if (time === 0) {
                  vm.captchaTip = '获取验证码';
                  vm.isSendCaptcha = false;
                  vm.captchaMsg = '';
                  clearInterval(sendCaptchaInterval);
                }
              }, 1000);
            }
          });

          $.showPreloader('发送中');
        }

        function restPW(event) {
          if (!vm.isSendCaptcha) {
            return;
          }

          if (!vm.phone) {
            $.toast("手机号不能为空", 1000);
            return;
          }

          if (!Utils.checkMobile(vm.phone)) {
            $.toast("请输入正确的手机号", 1000);
            return;
          }

          if (!vm.captcha) {
            $.toast("验证码不能为空");
            return;
          }

          if (!vm.password) {
            $.toast("密码不能为空");
            return;
          }

          if (vm.password != vm.rePassword) {
            $.toast("密码输入不一致");
            return;
          }

          ajaxPost('/rest-password',
            {
              'phone': vm.phone,
              'password': vm.password,
              'captcha': vm.captcha
            },
            function (err, data) {
              $.hidePreloader();
              if (err) {
                $.toast(err, 1000);
              } else {
                $.toast('密码重置成功, 请重新登录', 1000);
                location.href = data.redirect
              }
            }
          );

          $.showPreloader('请稍等');
        }

      });

      $.init();
    }
  );
}());
