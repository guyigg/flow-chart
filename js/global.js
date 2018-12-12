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

//主要画布填充
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
    this.shape_box = null,
    this.shape_contour = null,
    this._canvas = null,
    this.zindex = 1,
    this.divW = null,
    this.divH = null,
    this.att = null,
    this.arrBox = [];
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
//生成uuid
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