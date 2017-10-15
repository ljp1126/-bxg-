define(["jquery","template","nprogress","bootstrap"],function ($,template,NProgress) {
  //过滤器
  // template.defaults.imports.getage = function (value) {
  //   return new Date().getFullYear() - new Date(value).getFullYear()
  // }
  template.defaults.imports.getage = function(value){
    return new Date().getFullYear() - new Date(value).getFullYear();
  };
  
  //向后台发送ajax请求，获取后台数据
  $.ajax({
    url:"/api/teacher",
    
    //页面开始加载，进度条开始执行
    // beforeSend:function () {
    //   NProgress.start();
    // },
    
    success:function (data) {
      if(data.code == 200){
        console.log(data);
        var html = template("teacher-list-tpl",data);
        $("#teacher-list").html(html);
      }
    },
    
    //加载完成，进度条结束
    // complete:function () {
    //   NProgress.done();
    // }
    
  })
  
  
  //给所有的查看按钮注册点击事件（委托）
  
  $("#teacher-list").on("click", ".btn-checkinfo",function () {

    var id = $(this).parent().data("id")
    console.log(id);
    $.ajax({
        url: "/api/teacher/view",
        data: {tc_id: id},
        success:function (data) {
          if(data.code == 200){
            console.log(data);
            var html = template("teacher-info-tpl", data.result);
            $("#teacher-info").html(html);

            //展示模态框
            $("#teacherModal").modal("show")
          }
        }
      })
    return false;
  })
  
  //讲师注销和启用功能的实现：
  
  //讲师账号的状态：
  //已启用： tc_status == 0     按钮： 注销
  //已注销： tc_status == 1     按钮： 启用
  
  $("#teacher-list").on("click", ".btn-status", function(){
    //向后台发送请求
    var id = $(this).parent().data("id");
    var status = $(this).data("status");
    
    var that = this;
    
    $.ajax({
      url: "/api/teacher/handle",
      type: "post",
      data: {
        tc_id: id,
        tc_status: status
      },
      success: function(data){
        console.log(data);
        if(data.code == 200){
          var enable = data.result.tc_status == 0
          //在请求成功之后，
          //1. 更改按钮的文字
          //2. 更改按钮的样式
          //3. 更改按钮中的自定义属性data-status的值
          $(that)
              .text(enable ? "注 销" : "启 用")
              .removeClass(enable ? "btn-success": "btn-warning")
              .addClass(enable ? "btn-warning": "btn-success")
              .data("status", data.result.tc_status)
        }
      }
    })
  })
  

  
})
