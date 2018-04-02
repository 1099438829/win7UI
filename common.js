$(document).ready(function () {
    $("#start").click(function () {
		if($("#menuwin").css("display")=='block'){
			$("#menuwin").hide();
		}else{
			$("#menuwin").css("display", "block");
		}
        
    });
    $(".desktop").click(function () {
        $("#menuwin").hide();
    });
    $("#desktop").click(function () {
        $("#menuwin").hide();
    });
	
	    /*元素的定位函数*/
    //第一个元素的位置，之后的元素的位置 都需要加上这个初始值
    var heightTop = 10;
    var widthLeft = 10;
	
    //每列元素的个数
    var LisCount = 0;
    var Lis = $("#app > li");
	
    LisPosition(Lis);
    $(window).resize(function () {
		console.log($(window).height());
        LisPosition(Lis);
    });
    //元素定位函数实现
    function LisPosition(obj){
        //获取窗体的高度
        var windowHeight = $(window).height() - 42;
        //每列元素的最大个数， floor向下取整
        var LisMaxCount = Math.floor(windowHeight / 90);
        $(obj).each(function(index,item){
            var topHeight = heightTop + LisCount * 80;
            //如果元素的top值 大于窗口的最大高度 而且这一列元素的个数 大于每列最大的元素个数 
            //则执行重置操作
            if(LisCount > LisMaxCount){
				//(LisMaxCount-1) lisCount 从零开始 ,max从一开始
                LisCount = 0;
				widthLeft = widthLeft + 80;
				topHeight = heightTop + LisCount * 80;
            }
            $(item).css({
                top: topHeight,
                left: widthLeft
            });
            //绑定点击事件
            $(item).bind("click",function(){
                openNewWindow(this);
            });
            LisCount ++;
        })
        heightTop = 10;
        widthLeft = 10;
        LisCount = 0;
        /*弹窗定位*/
        $(".pop-ups").css({
            left: ($(window).width() - $(this).outerWidth()) / 2,
            top: ($(window).height() - $(this).outerHeight()) / 2
        });
    }
	
	//打开窗口函数
	function openNewWindow(obj){
		//判断是否已经打开同一窗口
		var task_bar=$('#taskbar');
		var pop_name = $(obj).find("span").text();
		if(!pop_names){
			var pop_names='';
		}
		if(pop_names.indexOf(pop_name) == -1){
			pop_names += (pop_name + ",");
		}else{
			layer.msg(pop_name +"窗口已经打开了~");
			return null;
		}
		//首先应该判断task_bar的宽度够不够显示
		//footer增加标题
			//取消active的状态
		task_bar.find("div").removeClass("task-active");
		var task = $("<div class='task task-active'></div>");
		task.append($(obj).find("img").clone()).append("<span></span>");
		if(task_width > task_bar.width()){
			layer.msg("您当前打开的窗口太多了，休息一下吧~");
			return ;
		}else{
			task_bar.append(task);
			task_width += (task.width() + 3);
		}
		var pop_ups = $("<div class='pop-ups'></div>");
		var pop_menu = $("<div class='pop-menu'></div>");
		var pop_title = $("<div class='pop-title'></div>");
		var pop_func = $("<div class='pop-func'></div>");
		var pop_container = $("<div class='pop-container'></div>");
		var fa_refresh = $("<span><i class='fa fa-refresh'></i></span>");
		var fa_minus = $("<span><i class='fa fa-minus'></i></span>");
		var fa_window_maximize = $("<span><i class='fa fa-window-maximize'></i></span>");
		var fa_remove = $("<span><i class='fa fa-remove'></i></span>");
		pop_func.append(fa_refresh).append(fa_minus).append(fa_window_maximize).append(fa_remove);
		pop_ups.append(pop_menu.append(pop_title).append(pop_func)).append(pop_container);
		pop_title.html($(obj).find("*").clone());
		//添加弹窗
		$("body").append(pop_ups);
		//居中
		pop_left = ($(window).width() - pop_ups.outerWidth()) / 2 + pop_windows_count * 15;
		pop_top = ($(window).height() - pop_ups.outerHeight()) / 2 + pop_windows_count * 10;
		if(pop_left + pop_ups.outerWidth() > $(window).width() || 
			pop_top + pop_ups.outerHeight() > $(window).height()){
			pop_windows_count = 0;
			pop_left = ($(window).width() - pop_ups.outerWidth()) / 2 + pop_windows_count * 15;
			pop_top = ($(window).height() - pop_ups.outerHeight()) / 2 + pop_windows_count * 10;
		}
		pop_windows_count ++;
		pop_ups.css({
			left: pop_left,
			top: pop_top,
			"z-index": z_index++
			});
			//加载页面
			pop_container.load($(obj).attr("data-url"));
		//底部的图标 绑定事件
		task.bind("click",function(){
			pop_ups.css({"z-index": z_index++});
			task_bar.find("div").removeClass("task-active");
			$(this).addClass("task-active");
		});
		//最小化弹窗
		fa_minus.bind("click", function(){
			pop_ups.hide();
		});
		//关闭弹窗
		fa_remove.bind("click", function(){
			pop_ups.remove();
			task_width -= (task.width() + 3);
			if(-- pop_windows_count< 0){
				pop_windows_count = Math.floor(task_width /(task.width() + 3));
			}
			task.remove();
			z_index --;
			pop_names = pop_names.replace(pop_name + ",",",");
		});
		//最大化弹窗
		fa_window_maximize.bind("click", function(){
			if($(this).html() != '<i class="fa fa-window-restore"></i>'){
				pop_ups.css({
					left: 0,
					top: 0,
					width: "100%",
					height: "100%"
				});
				$(this).html("<i class='fa fa-window-restore'></i>");
			}else{
				var width = $(window).width() * 0.8 > 400 ? $(window).width() * 0.8 : 400;
				var height = $(window).height() * 0.8 > 400 ? $(window).height() * 0.8 : 400;
				pop_ups.css({
					left: ($(window).width() - width) / 2,
					top: ($(window).height() - height) / 2,
					width: width,
					height: height
				});
				$(this).html("<i class='fa fa-window-maximize'></i>");
			}
		});
		
	}

});