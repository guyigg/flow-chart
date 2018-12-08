window.onload=function(){
    //左边图形初始化数据
    var shapeName=[{
        name:"text",
        srcImg:"img/text.png",
        text:'文本',
        props:{
            w:160,
            h:40
        },
        connect:false,
        connectCircle:"none"
    },{
        name:"note",
        srcImg:"img/note.png",
        text:'备注',
        props:{
            w:80,
            h:100
        },
        connect:false,
        connectCircle:"none"
    },{
        name:"round",
        srcImg:"img/round.png",
        text:'圆形',
        props:{
            w:70,
            h:70
        },
        connect:true,
        connectCircle:function(w,h){
        	var differ = 4;
        	return [{
        		left:-differ,
        		top:(h-26)/2
        		},
        		{
        		left:w-20-differ,
        		top:(h-26)/2
        		},
        		{
        		left:(w-26)/2,
        		top:-differ
        		},
        		{
        		left:(w-26)/2,
        		top:h-20-differ
        		}
        	]
        }
    },{
        name:"rectangle",
        srcImg:"img/rectangle.png",
        text:'矩形',
        props:{
            w:100,
            h:70
        },
        connect:true,
        connectCircle:function(w,h){
        	var differ = 4;
        	return [{
        		left:-differ,
        		top:(h-26)/2
        		},
        		{
        		left:w-20-differ,
        		top:(h-26)/2
        		},
        		{
        		left:(w-26)/2,
        		top:-differ
        		},
        		{
        		left:(w-26)/2,
        		top:h-20-differ
        		}
        	]
        }
    },{
        name:"braces",
        srcImg:"img/braces.png",
        text:'大括号',
        props:{
            w:200,
            h:100
        },
        connect:true,
        connectCircle:function(w,h){
        	var differ = 4;
        	return [{
        		left:-differ,
        		top:(h-26)/2
        		},
        		{
        		left:w-20-differ,
        		top:(h-26)/2
        		}
        	]
        }
    },{
        name:"parentheses",
        srcImg:"img/parentheses.png",
        text:'中括号',
        props:{
            w:200,
            h:140
        },
        connect:true,
        connectCircle:function(w,h){
        	var differ = 4;
        	return [{
        		left:-differ,
        		top:(h-26)/2
        		},
        		{
        		left:w-20-differ,
        		top:(h-26)/2
        		}
        	]
        }
    },{
        name:"rightBrace",
        srcImg:"img/rightBrace.png",
        text:'右备注',
        props:{
            w:100,
            h:140
        },
        connect:false,
        connectCircle:"none"
    },{
        name:"leftBrace",
        srcImg:"img/leftBrace.png",
        text:'左备注',
        props:{
            w:100,
            h:140
        },
        connect:false,
        connectCircle:"none"
    }
    ];
    var designer_canvas = document.getElementById('designer_canvas');
    var designer_layout = document.getElementById('designer_layout');
    var designer_header = document.getElementById('designer_header');
    var designer_grids = document.getElementById('designer_grids');
    var visualH = document.documentElement.clientHeight;//可视区高度
    var visualW = document.documentElement.clientWidth;//可视区宽度
    var headerH = designer_header.offsetHeight;//头部的高度
    //整个画布区域的高度
    (function resize(){
        designer_layout.style.height = visualH-headerH +'px';
        window.onresize=function(){
            visualH = document.documentElement.clientHeight;
            designer_layout.style.height = visualH-headerH +'px';
        }
    }());
    //初始化画布区域的左右上下滚动距离
    var _layoutInitH = designer_layout.scrollTop = designer_canvas.offsetTop-10;
    var _layoutInitW = designer_layout.scrollLeft = designer_canvas.offsetLeft-10;
    //主要画布填充
    drawCanva(designer_grids);
    function drawCanva(obj){
        var ctx = obj.getContext('2d');
        var width = obj.width;
        var height = obj.height;
        var space = 20,
            sw = width - space*2,
            sh = height - space*2;
        ctx.beginPath();
        ctx.rect(space,space,sw,sh);
        ctx.closePath();
        ctx.fillStyle = 'rgb(255,255,255)';
        ctx.fill();
        var d = 15;
        ctx.lineWidth = 1;
        ctx.translate(space, space);
        ctx.save();
        var i = 0.5,
            g = 0;
        while(i <= sh) {
            ctx.restore();
            if(g % 4 == 0) {
                ctx.strokeStyle = "rgb(229,229,229)"
            } else {
                ctx.strokeStyle = "rgb(242,242,242)"
            }
            ctx.beginPath();
            ctx.moveTo(0, i);
            ctx.lineTo(sw, i);
            i += d;
            g++;
            ctx.stroke();
        };
        i = 0.5,
            g = 0;
        while(i <= sw) {
            ctx.restore();
            if(g % 4 == 0) {
                ctx.strokeStyle = "rgb(229,229,229)"
            } else {
                ctx.strokeStyle = "rgb(242,242,242)"
            }
            ctx.beginPath();
            ctx.moveTo(i, 0);
            ctx.lineTo(i, sh);
            i += d;
            g++;
            ctx.stroke();
        };
    };

	//var arrBox = [];//储存所有self.shape_contour和对于的圆圈div
    //画布操作构造函数
    function InitDraw(){
        this.shape_box = null,
        this.shape_contour = null,
        this._canvas = null,
        this.zindex = 1,
        this.divW = null,
        this.divH = null,
        this.att = null,
        this.arrBox = [];
        this.leftDrag();
    }
    //鼠标移入移出
    InitDraw.prototype.parentMove = function(obj,objFun){
    	var self = this;
    	$(obj).on('mousemove',function(ev){
    		var ev = ev || event;
    		var disX = ev.clientX;
    		var disY = ev.clientY;
    		var left = $(this).offset().left;
	    	var top = $(this).offset().top;
	    	var width = $(this).width();
	    	var height = $(this).height();
    		if((disX > left+14 && disX < left-14+width) && (disY > top+14 && disY < top-14+height)){
    			$('#canvas_container').css('cursor','move');
  				self.drag(obj,objFun); //图形和圆圈绑定拖拽事件
    		}else if((disX > left+9 && disX < left-9+width) && (disY > top+9 && disY < top-9+height)){
    			$('#canvas_container').css('cursor','crosshair');
    			obj.unbind('mousedown');
    		}else{
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
    			$('.shape_contour').each(function(){
    				if($(this).attr('forshape') != self.shape_contour.attr('forshape')){
	    				$(this).hide();
	    			}
    			})
    		}
    	})
    }
    
    //左边拖动操作
    InitDraw.prototype.leftDrag = function(){
    	var self = this;
    	var designer = document.getElementById('designer');//整个操作区域
        var h = visualH - headerH - 2; //操作区域的可视高度
        var panel_box = $('#panel_basic').children('.panel_box');//左边图形列表
        
        $('#shape_panel').css('height',h+'px');
        panel_box.each(function(){
            for(var i in shapeName){
                if($(this).attr('shapename') == shapeName[i].name){
                    drawImg($(this).children()[0],shapeName[i].srcImg);
                }
            }
        });
        
    	$('#designer').on('mousedown','#shape_panel .panel_box',function(ev){
            var ev = ev || event;
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
            
            self.drawDragCanva($("#creating_shape_canvas")[0],thisBox.children()[0]);
            $('#creating_shape_container').css({'display':'block','top':'0','left':'0','width':parentW+'px','height':parentH+'px'});
            $('#creating_shape_canvas').css({'left':l+'px','top':t+'px'});
            
            var off = true;
            self.drawDiv();//生成shape_box
            self.drawCanvas(thisBox.attr('shapename'));//生成_canvas
            self.shape_box.css({'width':self._canvas.width+'px','height':self._canvas.height+'px'});
            var dW = self.shape_box.width();
            var dH = self.shape_box.height();
            
            designer.onmousemove=function(ev){
                var ev = ev || event;
                var L = ev.clientX - disX;
                var T = ev.clientY - disY;
                $('#creating_shape_canvas').css({'left':L+'px','top':T+'px'});
                if(ev.clientX > parentW){
                	self.divH = Math.round(layoutNewH)-_layoutInitH>=0 ? ev.clientY-headerH-10-dH/2 : ev.clientY-differH-dH/2;
                	self.divW = Math.round(layoutNewW)-_layoutInitW>=0 ? ev.clientX-parentW-10-dW/2 : ev.clientX-differW-dH/2;
                    self.shape_box.css({'left':self.divW + 'px','top':self.divH + 'px'});
                    self.shape_box.attr({'divW':self.divW,'divH':self.divH});
                    if(off){
                        $('#designer_canvas').append(self.shape_box);
                        off = !off;
                    }
                }
            };
            document.onmouseup = function(ev){
                var ev = ev || event;
                var obj = {};
                if(!off){
                    if(ev.clientX < parentW || ev.clientY < headerH || ev.clientX > visualW-10 || ev.clientY > visualH-10){
                        self.shape_box.remove();
                    }else{
                  		self.shape_box.css({'z-index':self.zindex ++});
                    	self.shape_contour = self.funDiv(self.shape_box.attr('id'),dW,dH,self.divW,self.divH);//生成连线圆圈功能div
                    	$('#designer_canvas').append(self.shape_contour);//添加圆圈div
                        self.parentMove(self.shape_box,self.shape_contour);//绑定鼠标移入移除效果
                        if($('.shape_contour').length > 0){//判断shape_contour是否为当前shape_box相对应的
                        	$('.shape_contour').each(function(){
                        		if($(this).attr('forshape') != self.shape_box.attr('id')){
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
            return false;//阻止文字默认拖拽事件触发
        });
    }
    //画布内拖拽
    InitDraw.prototype.drag = function(obj,objFun){
       	obj.on('mousedown',function(ev){
        	var ev = ev || event;
        	var disX = ev.clientX - this.offsetLeft;
            var disY = ev.clientY - this.offsetTop;
            $(document).on('mousemove',function(ev){
            	var ev = ev || event;
                var L = ev.clientX - disX;
                var T = ev.clientY - disY;
                obj.css({'left':L,'top':T});
                objFun.css({'left':L+10,'top':T+10});
            })
            $(document).on('mouseup',function(){
            	obj.off('mousedown');
            	$(document).off('mousemove');
            	objFun.show().siblings('.shape_contour').hide();
//          	if($('.shape_contour').length > 1){
//	    			$('.shape_contour').each(function(){
//	    				//$('.shape_contour').hide();
//	    				if($(this).attr('forshape') == $(obj).attr('id')){
//		    				$(this).show();
//		    			}
//	    			})
//	    		}
            })
            return false; //阻止文字默认拖拽
        })
    }
    //生成图形div
    InitDraw.prototype.drawDiv = function(){
        var id = uuid();
        this.shape_box = $('<div id='+id+' class="shape_box"><textarea class="text_canvas" forshape="'+id+'" >123</textarea></div>');
    }
    //生成连线圆圈功能div
    InitDraw.prototype.funDiv = function(id,w,h,l,t){
        oDiv = $('<div class="shape_contour" forshape="'+id+'"></div>');
        oDiv.css({'left':(Number(l) + 10) + 'px','top':(Number(t) + 10) +'px','z-index':this.zindex});
        var arr = [];
        var elem = null;
    	for(var i in shapeName){
    		if(shapeName[i].connect == true && shapeName[i].name == this.att){
	    		arr = shapeName[i].connectCircle(w,h);
	    		for(var j = 0;j < arr.length; j ++){
			    	elem = $('<div class="shape_anchor"></div>');
			    	elem.css({'left':arr[j].left,'top':arr[j].top,'z-index':this.zindex});
			        oDiv.append(elem);
			    }
    		}
    	}
    	return oDiv;
    }
    //生成canvas
    InitDraw.prototype.drawCanvas = function(att){
    	this.att = att;
        var obj = document.createElement('canvas');
        for(var i in shapeName){
            if(shapeName[i].name == att ){
                obj.width = shapeName[i].props.w+20;
                obj.height = shapeName[i].props.h+20;
                var wt = shapeName[i].props.w;
                var ht = shapeName[i].props.h;
            }
        }
        var fontSize = '14px 微软雅黑';
        var ctx = obj.getContext('2d');
        ctx.lineWidth = 2;
        ctx.fillStyle = '#fff';
        ctx.strokeStyle = 'black';
        ctx.save();
        ctx.translate(10,10);
        switch (att){
            case "text":
                break;
            case "note":
                ctx.beginPath();
                ctx.moveTo(0,0);
                ctx.lineTo(wt-20,0);
                ctx.lineTo(wt-20,20);
                ctx.lineTo(wt,20);
                ctx.lineTo(wt,ht);
                ctx.lineTo(0,ht);
                ctx.fillStyle = "rgb(255,255,170)";
                ctx.fill();
                ctx.closePath();
                ctx.beginPath();
                ctx.moveTo(wt-20,0);
                ctx.lineTo(wt-20,20);
                ctx.lineTo(wt,20);
                ctx.fillStyle = "rgb(225,225,140)";
                ctx.fill();
                ctx.closePath();
                break;
            case "round":
                ctx.arc(wt/2,ht/2,wt/2,0,2*Math.PI);
                ctx.fill();
                ctx.stroke();
                break;
            case "rectangle":
                ctx.fillRect(0,0,wt,ht);
                ctx.strokeRect(0,0,wt,ht);
                break;
            case "braces":
                ctx.beginPath();
                ctx.arc(10*2,10,10,3/2*Math.PI,Math.PI,true);
                ctx.lineTo(10,(ht-8*10)/2+10*2);
                ctx.arc(0,(ht-8*10)/2+10*3,10,0,1/2*Math.PI);
                ctx.arc(0,(ht-8*10)/2+10*5,10,3/2*Math.PI,2*Math.PI);
                ctx.lineTo(10,ht-10*2);
                ctx.arc(10*2,ht-10,10,Math.PI,1/2*Math.PI,true);
                ctx.stroke();
                ctx.beginPath();
                ctx.arc(wt-10*2,10,10,3/2*Math.PI,2*Math.PI);
                ctx.lineTo(wt-10,(ht-8*10)/2+10*2);
                ctx.arc(wt,(ht-8*10)/2+10*3,10,Math.PI,1/2*Math.PI,true);
                ctx.arc(wt,(ht-8*10)/2+10*5,10,3/2*Math.PI,Math.PI,true);
                ctx.lineTo(wt-10,ht-10*2);
                ctx.arc(wt-2*10,ht-10,10,0,1/2*Math.PI);
                ctx.stroke();
                break;
            case "parentheses":
                ctx.beginPath();
                ctx.moveTo(10,0);
                ctx.lineTo(0,10);
                ctx.lineTo(0,ht-10);
                ctx.lineTo(10,ht);
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(wt-10,0);
                ctx.lineTo(wt,10);
                ctx.lineTo(wt,ht-10);
                ctx.lineTo(wt-10,ht);
                ctx.stroke();
                break;
            case "rightBrace":
                ctx.beginPath();
                ctx.arc(0,10,10,3/2*Math.PI,2*Math.PI);
                ctx.lineTo(10,(ht-8*10)/2+10*2);
                ctx.arc(10*2,(ht-8*10)/2+10*3,10,Math.PI,1/2*Math.PI,true);
                ctx.arc(10*2,(ht-8*10)/2+10*5,10,3/2*Math.PI,Math.PI,true);
                ctx.lineTo(10,ht-10*2);
                ctx.arc(0,ht-10,10,0,1/2*Math.PI);
                ctx.stroke();
                break;
            case "leftBrace":
                ctx.beginPath();
                ctx.arc(wt,10,10,3/2*Math.PI,Math.PI,true);
                ctx.lineTo(wt-10,(ht-8*10)/2+10*2);
                ctx.arc(wt-10*2,(ht-8*10)/2+10*3,10,0,1/2*Math.PI);
                ctx.arc(wt-10*2,(ht-8*10)/2+10*5,10,3/2*Math.PI,2*Math.PI);
                ctx.lineTo(wt-10,ht-10*2);
                ctx.arc(wt,ht-10,10,Math.PI,1/2*Math.PI,true);
                ctx.stroke();
                break;
        }
        ctx.beginPath();
        ctx.font = fontSize;
        ctx.fillStyle='black';
        ctx.textAlign='center';
        ctx.textBaseline='middle';
        ctx.restore();
        this._canvas = obj;
        this.shape_box.append(this._canvas);
    }
    //左边栏图片canvas
    function drawImg(obj,src){
        var width = obj.width;
        var height = obj.height;
        var ctx = obj.getContext('2d');
        var drawImage = new Image();
        drawImage.src = src;
        drawImage.onload=function(){
            var pat = ctx.createPattern(drawImage,'no-repeat');
            ctx.fillStyle = pat;
            ctx.fillRect(0,0,width,height);
        }
    }
    //左边拖拽canvas
    InitDraw.prototype.drawDragCanva=function(obj,c){
        var wt = obj.width;
        var ht = obj.height;
        var ctx = obj.getContext('2d');
        ctx.save();
        ctx.clearRect(0,0,wt,ht);
        var pat = ctx.createPattern(c,'no-repeat');
        ctx.fillStyle = pat;
        ctx.fillRect(0,0,wt,ht);
        ctx.restore();
    }
    var init = new InitDraw();
    
    function uuid() {
        var s = [];
        var hexDigits = "0123456789abcdef";
        for (var i = 0; i < 13; i++) {
            s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
        }
        s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
        s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
        s[8] = s[13] = s[18] = s[23];

        var uuid = s.join("");
        return uuid;
    }
}