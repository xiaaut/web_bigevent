$(function () {
  // 点击去注册的链接
  $('#link_reg').on('click', function () {
    $('.login-box').hide()
    $('.reg-box').show()
  })

  // 点击去登录的链接
  $('#link_login').on('click', function () {
    $('.reg-box').hide()
    $('.login-box').show()
  })

  var form = layui.form
  var layer = layui.layer

  form.verify({
    pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
    repwd: function (value) {
      var pwd = $('.reg-box [name=password]').val()
      if (pwd !== value) {
        return '两次密码不一致'
      }
    },
  })

  // 监听注册表单的提交事件
  $('#form_reg').on('submit', function (e) {
    e.preventDefault()
    // 发起Ajax请求
    var data = {
      username: $('#form_reg [name=username]').val(),
      password: $('#form_reg [name=password]').val(),
    }
    $.post('/api/reguser', data, function (res) {
      if (res.status !== 0) {
        // return console.log(res.message)
        return layer.msg(res.message)
      }
      // console.log('注册成功')
      layer.msg('注册成功，请登录！')
      // 模拟点击行为，跳转到登录页面
      $('#link_login').click()
    })
  })

  // 监听登录的提交事件
  $('#form_login').submit(function (e) {
    // 阻止默认提交行为
    e.preventDefault()
    $.ajax({
      url: '/api/login',
      method: 'POST',
      // 快速获取表单中的数据
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('登录失败！！！')
        }
        layer.msg('登录成功！')
        // 将登录成功得到的 token 字符串，保存到 localStorage 中
        localStorage.setItem('token', res.token)
        // console.log(res.token)
        // 跳转到后台主页
        location.href = '/index.html'
      },
    })
  })
})
