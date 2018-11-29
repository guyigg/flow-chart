window.onload=function(){
    //左边图形初始化数据
    var shapename=[{
        name:"text",
        srcImg:"img/text.png",
        text:'文本',
        props:{
            w:160,
            h:40
        }
    },{
        name:"note",
        srcImg:"img/note.png",
        text:'备注',
        props:{
            w:80,
            h:100
        }
    },{
        name:"round",
        srcImg:"img/round.png",
        text:'圆形',
        props:{
            w:70,
            h:70
        }
    },{
        name:"rectangle",
        srcImg:"img/rectangle.png",
        text:'矩形',
        props:{
            w:100,
            h:70
        }
    },{
        name:"braces",
        srcImg:"img/braces.png",
        text:'大括号',
        props:{
            w:200,
            h:100
        }
    },{
        name:"parentheses",
        srcImg:"img/parentheses.png",
        text:'中括号',
        props:{
            w:200,
            h:140
        }
    },{
        name:"rightBrace",
        srcImg:"img/rightBrace.png",
        text:'右备注',
        props:{
            w:100,
            h:140
        }
    },{
        name:"leftBrace",
        srcImg:"img/leftBrace.png",
        text:'左备注',
        props:{
            w:100,
            h:140
        }
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


    //画布操作构造函数
    function InitDraw(){
        var self = this;
        var designer = document.getElementById('designer');//整个操作区域
        var h = visualH - headerH - 2; //操作区域的可视高度
        var panel_box = $('#panel_basic').children('.panel_box');//左边图形列表
        $('#shape_panel').css('height',h+'px');
        panel_box.each(function(){
            for(var i in shapename){
                if($(this).attr('shapename') == shapename[i].name){
                    self.drawImg($(this).children()[0],shapename[i].srcImg);
                }
            };
        });
        $('#designer').on('mousedown','#shape_panel .panel_box',function(ev){
            var ev = ev || event;
            var thisBox = $(this);
            var parentW = thisBox.parents('#shape_panel').width();
            var parentH = thisBox.parents('#shape_panel').height();
            var layoutNewH = $('#designer_layout').scrollTop();//layout当前滚动距离顶部高度
            var layoutNewW = $('#designer_layout').scrollLeft();//layout当前滚动距离左边宽度
            var differH = designer_canvas.offsetTop - layoutNewH + headerH;//当前layout距离可是区距离
            var differW = designer_canvas.offsetLeft - layoutNewW + parentW;
            var l = thisBox[0].offsetLeft;
            var t = thisBox[0].offsetTop;
            var disX = ev.clientX - l;
            var disY = ev.clientY - t;
            self.drawDragCanva($("#creating_shape_canvas")[0],thisBox.children()[0]);
            $('#creating_shape_container').css({'display':'block','top':'0','left':'0','width':parentW+'px','height':parentH+'px'});
            $('#creating_shape_canvas').css({'left':l+'px','top':t+'px'});
            var off = true;
            var shape_box = self.drawDiv();
            var _canvas = self.drawCanvas(thisBox.attr('shapename'));
            shape_box.append(_canvas);
            shape_box.css({'width':_canvas.width+'px','height':_canvas.height+'px'});
            var dW = shape_box.width();
            var dH = shape_box.height();
            var funDiv = self.funDiv(shape_box.attr('id'));
            designer.onmousemove=function(ev){
                var ev = ev || event;
                var L = ev.clientX - disX;
                var T = ev.clientY - disY;
                $('#creating_shape_canvas').css({'left':L+'px','top':T+'px'});
                if(ev.clientX > parentW){
                    var divH = Math.round(layoutNewH)-_layoutInitH>=0 ? ev.clientY-headerH-10-dH/2 : ev.clientY-differH-dH/2;
                    var divW = Math.round(layoutNewW)-_layoutInitW>=0 ? ev.clientX-parentW-10-dW/2 : ev.clientX-differW-dH/2;
                    shape_box.css({'left':divW + 'px','top':divH + 'px'});
                    if(off){
                        $('#designer_canvas').append(shape_box);
                        off = !off;
                    }
                };
            };

            document.onmouseup = function(ev){
                var ev = ev || event;
                if(!off){
                    if(ev.clientX < parentW || ev.clientY < headerH || ev.clientX > visualW-10 || ev.clientY > visualH-10){
                        shape_box.remove();
                    }else{
                        self.drag(shape_box[0]);
                        $('#designer_canvas').append(funDiv);
                        console.log($('.shape_contour'));
                    }
                };
                $('#creating_shape_container').css({'display':'none'});
                designer.onmousemove = null;
                off = true;
            }
            return false;//阻止文字默认拖拽事件触发
        });

    };

    //画布内拖拽
    InitDraw.prototype.drag = function(obj){
        obj.onmousedown = function(ev){
            var ev = ev || event;
            var disX = ev.clientX - this.offsetLeft;
            var disY = ev.clientY - this.offsetTop;
            document.onmousemove = function(ev){
                var ev = ev || event;
                var L = ev.clientX - disX;
                var T = ev.clientY - disY;
                obj.style.left = L+'px';
                obj.style.top = T+'px';
            }
            document.onmouseup = function(){
                document.onmousemove = null;
            }
        }
    }
    //生成图形div
    InitDraw.prototype.drawDiv = function(){
        var id = uuid();
        var $div = $('<div id='+id+' class="shape_box"><textarea class="text_canvas" forshape="'+id+'" readonly="readonly"></textarea></div>');
        return $div;
    };
    //生成连线圆圈功能div
    InitDraw.prototype.funDiv = function(id){
        var $div = $('<div class="shape_contour" forshape="'+id+'"></div>');
        return $div;
    };
    //生成canvas
    InitDraw.prototype.drawCanvas = function(attr,text){
        var _text = text || '';
        var obj = document.createElement('canvas');
        for(var i in shapename){
            if(shapename[i].name == attr ){
                obj.width = shapename[i].props.w+20;
                obj.height = shapename[i].props.h+20;
                var wt = shapename[i].props.w;
                var ht = shapename[i].props.h;
                _text = shapename[i].text;
            }
        };
        var fontSize = '14px 微软雅黑';
        var ctx = obj.getContext('2d');
        ctx.lineWidth = 2;
        ctx.fillStyle = '#fff';
        ctx.strokeStyle = 'black';
        ctx.save();
        ctx.translate(10,10);
        switch (attr){
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
                ctx.arc(wt/2,ht/2,(wt-6)/2,0,2*Math.PI);
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
        ctx.fillText(_text,wt/2,ht/2);
        ctx.restore();
        return obj;
    };
    //左边栏图片canvas
    InitDraw.prototype.drawImg=function(obj,src){
        var width = obj.width;
        var height = obj.height;
        var ctx = obj.getContext('2d');
        var drawImage = new Image();
        drawImage.src = src;
        drawImage.onload=function(){
            var pat = ctx.createPattern(drawImage,'no-repeat');
            ctx.fillStyle = pat;
            ctx.fillRect(0,0,width,height);
        };
    };
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
    };
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