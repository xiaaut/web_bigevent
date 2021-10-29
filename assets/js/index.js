$(function () {
  getUserInfo()
  var layer = layui.layer
  // 点击按钮，实现退出功能
  $('#btnLogout').on('click', function () {
    // console.log('ok')
    layer.confirm('是否退出登录？', { icon: 3, title: '提示' }, function (index) {
      localStorage.removeItem('token')
      location.href = '/login.html'
      // 关闭询问框
      layer.close(index)
    })
  })
})
// 获取用户的基本信息
function getUserInfo() {
  $.ajax({
    method: 'GET',
    url: '/my/userinfo',
    // 配置请求头
    // headers: {
    //   Authorization: localStorage.getItem('token') || '',
    // },
    success: function (res) {
      if (res.status !== 0) {
        return layui.layer.msg('获取用户信息失败！')
      }
      // console.log(res)
      // 渲染用户头像
      renderAvatar(res.data)
    },
  })

  // 渲染用户头像
  function renderAvatar(user) {
    // 1.获取用户的名称
    var name = user.nickname || user.username
    // 2. 设置欢迎文本
    $('#welcome').html('欢迎&nbsp&nbsp' + name)
    // 3. 按需渲染用户头像
    if (user.user_pic !== null) {
      $('.layui-nav-img').attr('src', user.user_pic).show()
      $('.text-avatar').hide()
    } else {
      $('.layui-nav-img').hide()
      var first = name[0].toUpperCase()
      $('.text-avatar').html(first).show()
    }
  }
}
