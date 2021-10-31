$(function () {
  var layer = layui.layer
  var form = layui.form
  var laypage = layui.laypage

  // 定义美化时间的过滤器
  template.defaults.imports.dataFormat = function (date) {
    const dt = new Date(date)

    var y = dt.getFullYear()
    var m = padZero(dt.getMonth() + 1)
    var d = padZero(dt.getDate())

    var hh = padZero(dt.getHours())
    var mm = padZero(dt.getMinutes())
    var ss = padZero(dt.getSeconds())

    return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
  }

  // 定义补零的函数
  function padZero(n) {
    return n > 9 ? n : '0' + n
  }

  // 定义一个查询对象，请求数据的时候会用到
  // 需要将请求的参数对象提交到服务器
  var q = {
    pagenum: 1,
    pagesize: 2,
    cate_id: '',
    state: '',
  }

  initTable()
  initCate()

  // 获取文章列表数据的方法
  function initTable() {
    $.ajax({
      method: 'GET',
      url: '/my/article/list',
      data: q,
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('获取文章列表失败！')
        }
        // console.log(res)
        // layer.msg('获取文章列表成功！')
        // 使用模板引擎渲染页面数据
        var htmlStr = template('tpl-table', res)
        $('tbody').html(htmlStr)

        // 调用渲染分页的方法
        renderPage(res.total)
      },
    })
  }

  // 初始化文章分类的方法
  function initCate() {
    $.ajax({
      method: 'GET',
      url: '/my/article/cates',
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('获取分类数据失败！')
        }

        // 调用模板引擎渲染分类的可选项
        var htmlStr = template('tpl-cate', res)
        // console.log(htmlStr)
        $('[name=cate_id]').html(htmlStr)
        form.render()
      },
    })
  }

  // 为筛选表单绑定 submit 事件
  $('#form-search').on('submit', function (e) {
    e.preventDefault()
    var cate_id = $('[name=cate_id]').val()
    var state = $('[name=state]').val()
    q.cate_id = cate_id
    q.state = state

    initTable()
  })

  // console.log(!undefined)

  // 定义渲染分页的方法
  function renderPage(total) {
    // console.log(total)
    laypage.render({
      elem: 'pageBox', // 分页容器的 id
      count: total, //数据总数
      limit: q.pagesize, // 每页显示几条数据
      curr: q.pagenum, // 设置默认被选中的分页
      layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
      limits: [2, 3, 5],
      // 分页发生的时候触发 jump 回调
      jump: function (obj, first) {
        // console.log(obj.curr)
        q.pagenum = obj.curr
        q.pagesize = obj.limit

        if (!first) {
          // 根据最新的 q 获取对应的数据列表，并渲染表格
          initTable()
        }
      },
    })
  }
})
