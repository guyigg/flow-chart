$(function(){
    var designer_canvas = document.getElementById('designer_canvas');
    var designer_layout = document.getElementById('designer_layout');
    var designer_header = document.getElementById('designer_header');
    var designer_grids = document.getElementById('designer_grids');
    var visualH = document.documentElement.clientHeight;//可视区高度
    var visualW = document.documentElement.clientWidth;//可视区宽度
    var headerH = designer_header.offsetHeight;//头部的高度
    var designer = document.getElementById('designer');//整个操作区域
    var h = visualH - headerH - 2; //操作区域的可视高度

    //整个画布区域的高度
    (function resize(){
        designer_layout.style.height = visualH-headerH +'px';
        window.onresize=function(){
            visualH = document.documentElement.clientHeight;
            designer_layout.style.height = visualH-headerH +'px';
        }
    }());

    //画出主要画布
    drawCanva(designer_grids);

    //初始化画布区域的左右上下滚动距离
    var _layoutInitH = designer_layout.scrollTop = designer_canvas.offsetTop-10;
    var _layoutInitW = designer_layout.scrollLeft = designer_canvas.offsetLeft-10;

    //实例化构造画布函数
    var draw = new InitDraw();
    
     //左边拖动操作
    var panel_box = $('#panel_basic').children('.panel_box');//左边图形列表
    $('#shape_panel').css('height',h+'px');
    panel_box.each(function(){
        for(var i in shapeName){
            if($(this).attr('shapename') == shapeName[i].name){
                drawImg($(this).children()[0],shapeName[i].srcImg);
            }
        }
    });
    //整个图形区域操作
    $('#designer').on('mousedown','#shape_panel .panel_box',function(ev){
        var ev = ev || event;
        ev.preventDefault();//阻止文字默认拖拽事件触发
        var thisBox = $(this);
        var parentW = thisBox.parents('#shape_panel').width();
        var parentH = thisBox.parents('#shape_panel').height();
        var layoutNewH = $('#designer_layout').scrollTop();//layout当前滚动距离顶部高度
        var layoutNewW = $('#designer_layout').scrollLeft();//layout当前滚动距离左边宽度
        var differH = designer_canvas.offsetTop - layoutNewH + headerH;//当前layout距离可视区距离
        var differW = designer_canvas.offsetLeft - layoutNewW + parentW;
        var l = thisBox[0].offsetLeft;
        var t = thisBox[0].offsetTop;
        var disX = ev.clientX - l;
        var disY = ev.clientY - t;
        
        draw.drawDragCanva($("#creating_shape_canvas")[0],thisBox.children()[0]);
        $('#creating_shape_container').css({'display':'block','top':'0','left':'0','width':parentW+'px','height':parentH+'px'});
        $('#creating_shape_canvas').css({'left':l+'px','top':t+'px'});
        
        var off = true;
        draw.drawDiv();//生成shape_box
        draw.drawCanvas(thisBox.attr('shapename'));//生成_canvas
        draw.shape_box.css({'width':draw._canvas.width+'px','height':draw._canvas.height+'px'});
        var dW = draw.shape_box.width();
        var dH = draw.shape_box.height();
        
        designer.onmousemove=function(ev){
            var ev = ev || event;
            var L = ev.clientX - disX;
            var T = ev.clientY - disY;
            $('#creating_shape_canvas').css({'left':L+'px','top':T+'px'});
            if(ev.clientX > parentW){
                draw.divH = Math.round(layoutNewH)-_layoutInitH >= 0 ? ev.clientY-headerH-10-dH/2 : ev.clientY-differH-dH/2;
                draw.divW = Math.round(layoutNewW)-_layoutInitW >= 0 ? ev.clientX-parentW-10-dW/2 : ev.clientX-differW-dH/2;
                draw.shape_box.css({'left':draw.divW + 'px','top':draw.divH + 'px'});
                //draw.shape_box.attr({'divW':draw.divW,'divH':draw.divH});
                if(off){
                    $('#designer_canvas').append(draw.shape_box);
                    off = !off;
                }
            }
        };
        document.onmouseup = function(ev){
            var ev = ev || event;
            if(!off){
                if(ev.clientX < parentW || ev.clientY < headerH || ev.clientX > visualW-10 || ev.clientY > visualH-10){
                    draw.shape_box.remove();
                }else{
                    draw.shape_box.css({'z-index':draw.zindex ++});
                    for(shape_item in shapeName){
                        if(thisBox.attr('shapename') == shapeName[shape_item].name && shapeName[shape_item].connect == true){
                            draw.shape_contour = draw.funDiv(draw.shape_box.attr('id'),dW,dH,draw.divW,draw.divH);//生成连线圆圈功能div
                            $('#designer_canvas').append(draw.shape_contour);//添加圆圈div
                            parentMove(draw.shape_box,draw.shape_contour);//绑定鼠标移入移除效果
                        }else{
                            draw.drag(draw.shape_box); //无连线的图形绑定拖拽事件
                        }
                    }
                    if($('.shape_contour').length > 0){//判断shape_contour是否为当前shape_box相对应的
                        $('.shape_contour').each(function(){
                            if($(this).attr('forshape') != draw.shape_box.attr('id')){
                                $(this).hide();
                            }
                        })
                    }
                }
            }
            $('#creating_shape_container').css({'display':'none'});
            designer.onmousemove = null;
            off = true;
        }
    });

    //鼠标移入移出
    function parentMove(obj,objFun){
    	$(obj).on('mousemove',function(ev){
            var ev = ev || event;
            ev.preventDefault();//阻止文字默认拖拽事件触发
    		var disX = ev.clientX;
    		var disY = ev.clientY;
    		var left = $(this).offset().left;
	    	var top = $(this).offset().top;
	    	var width = $(this).width();
	    	var height = $(this).height();
    		if((disX > left+14 && disX < left-14+width) && (disY > top+14 && disY < top-14+height)){
                $('#canvas_container').css('cursor','move');
                obj.unbind('mousedown');
                //console.log(obj);
                draw.drag(obj,objFun); //图形和圆圈绑定拖拽事件
    		}else if((disX > left+9 && disX < left-9+width) && (disY > top+9 && disY < top-9+height)){
    			$('#canvas_container').css('cursor','crosshair');
                obj.unbind('mousedown');
                createLine(obj);
    		}else{
                obj.unbind('mousedown');
    			$('#canvas_container').css('cursor','default');
    		}
    		if($('.shape_contour').length > 1){
    			$('.shape_contour').each(function(){
    				if($(this).attr('forshape') == $(obj).attr('id')){
	    				$(this).show();
	    			}
    			})
    		}
    	});
    	$('.shape_contour').on('mouseover',function(){
    		$(this).show();
            $('#canvas_container').css('cursor','crosshair');
    	})
    	$(obj).on('mouseout',function(){
    		$('#canvas_container').css('cursor','default');
    		if($('.shape_contour').length > 1){
    			$('.shape_contour').each(function(i,el){
    				if($(el).attr('forshape') != draw.shape_contour.attr('forshape')){
                        $(el).hide();
	    			}
    			})
    		}
    	})
    }
    //鼠标拖动画线功能
    function createLine(obj){
        obj.on('mousedown',function(ev){
            var ev = ev || event;
            ev.preventDefault();//阻止文字默认拖拽事件触发
            var disX = ev.clientX;
            var disY = ev.clientY;
            var arr = [];
            var arrs = $('.shape_box');
            var off = true;
            var lineW = null;
            var lineH = null;
            if(disX > obj.offset().left){
                lineW = obj[0].offsetLeft + obj.width() - 20;
                lineH = obj[0].offsetTop + (obj.height() - 18)/2;
            }
            for(var i = 0;i<arrs.length;i++){
                var son = {
                    id:$(arrs[i]).attr('id'),
                    w:$(arrs[i]).width(),
                    h:$(arrs[i]).height(),
                    l:parseInt($(arrs[i]).offset().left),
                    t:parseInt($(arrs[i]).offset().top)
                };
                arr.push(son);
            }
            var lineDiv = draw.lineDiv();
            var lineCanvas = document.createElement('canvas');
            lineDiv.append(lineCanvas);
            $(document).on('mousemove',function(ev){
                var ev = ev || event;
                var moveX = ev.clientX;
                var moveY = ev.clientY;
                lineDiv.css({'left':lineW,'top':lineH});
                $('#designer_canvas').append(lineDiv);
                var _width = moveX - lineDiv.offset().left;
                var _hegiht  = moveY - lineDiv.offset().top;
                console.log(_hegiht);
                for(var i in arr){
                    if(arr[i].id != obj.attr('id')){
                        if(moveX > arr[i].l && moveX < arr[i].l+arr[i].w && moveY > arr[i].t && moveY < arr[i].t+arr[i].h){
                            _width = arr[i].l - obj.offset().left + obj.width();
                            //_width = _width > 0 ? _width : 
                            //var left = arr[i].l
                            //console.log(arr[i].l);
                            //console.log(moveX);
                            //console.log(arr[i].id);
                        }
                    }
                }
                lineDiv.css({
                        'z-index':draw.zindex-1,
                        'width':_width,
                        'height':20
                    })
                //console.log('moveX:'+moveX);
                //console.log('left:'+lineDiv.offset().left);
                //console.log('_width:'+_width);
                line(lineCanvas,_width,20);
            })
            $(document).on('mouseup',function(){
                $(document).unbind('mousemove');
                //$(obj).unbind('mousedown');
            })
        })
        function line(obj,w,h){
            //console.log('canvas:'+w);
            obj.width = w;
            obj.height = h;
            var ctx = obj.getContext('2d');
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(10,10);
            ctx.lineTo(w-10,h-10);
            ctx.stroke();
        }
    }
    
})
