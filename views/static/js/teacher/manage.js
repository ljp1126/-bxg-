
define(["utils", "jquery", "template", "form", "datepicker", "datepickerCN","validate"], function(utils, $, template){
  
  //一个页面中，要实现两个功能： 添加  编辑
  //问题1： 如何判断是哪个功能
  
  var id = utils.getQuery("id");
  var data = {};
  if(id){
    // alert("编辑功能");
    data.title = "讲师编辑";
    data.buttonText = "保 存"
    data.url = "/api/teacher/update";
    
    //由于是编辑功能，所以需要将当前编辑的用户的数据从后台获取回来 将其渲染到页面中
    $.ajax({
      url: "/api/teacher/edit",
      data: {tc_id: id},
      success: function(msg){
        if(msg.code == 200){
          // console.log(data);
          data.teacher = msg.result;
          renderData();
        }
      }
    })
  }else{
    // alert("添加功能");
    data.title = "讲师添加";
    data.buttonText = "添 加";
    data.url = "/api/teacher/add";
    data.teacher = {
      tc_gender:"0"
    };
    renderData();
  }
  
  //问题2： 知道是哪个功能之后，如何在页面上显示不同的内容
  //将页面主体部分直接提取成模板，将两个功能中不同的项，用模板中的数据来代替title 表单内容 buttonText
  
  function renderData(){
    var html = template("manage-tpl", data);
    $(".body.teacher").html(html);
    
    
    //使用日期选择插件
    $("input[name='tc_join_date']").datepicker({
      format: "yyyy-mm-dd",
      autoclose: true,
      language: "zh-CN"
    })
    
    //使用表单验证插件为表单注册验证功能
    $("form").validate({
      onBlur: true,
      onChange: true,
      sendForm:false,
      conditional:{
        forbidden:function (value) {
          return value != "前端学院"
        }
      },
      description:{
        name:{
          required:"用户名不能为空",
          conditional:"不能使用前端学院"
        },
        pass:{
          required:"密码不能为空",
          pattern:"密码必须是6-15位的数字和字母"
        },
        joindate:{
          required:"入职日期不能为空"
        }
        
      },
      valid:function () {
        //表单验证通过的时候调用，并发送ajax请求提交表单
        //this就是指这个表单的jQuery对象
        $(this).ajaxSubmit({
          success: function(data){
            if(data.code == 200){
              location.href = "/teacher/list"
            }
          }
        })
      },
      
      eachValidField:function () {
        this.parent().parent().addClass("has-success").removeClass("has-error")
      },
      eachInvalidField:function () {
        this.parent().parent().addClass("has-error").removeClass("has-success")
      }
      
    })
  }
  
  
  // $(".body.teacher").on("submit", "form", function(){
  //   $(this).ajaxSubmit({
  //     success: function(data){
  //       if(data.code == 200){
  //         location.href = "/teacher/list"
  //       }
  //     }
  //   })
  //   return false;
  // })
})