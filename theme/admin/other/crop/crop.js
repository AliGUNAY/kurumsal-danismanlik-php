/**
 * @author ziloLiang
 * 22/01/2015
 * thx cropbox.js by ezgoing provide inspiration;
 */

(function(factory){
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    } else {
        factory(jQuery);
    }
}(function($){
        
    function BoxLayout(obj){  //盒模型
        
        this.x = obj.offset().left; //视口左边距
        this.y = obj.offset().top; //视口上边距
        this.width = obj.width(); 
        this.height = obj.height();
        this.left = obj.position().left; //相对parent左边距
        this.top = obj.position().top; //相对parent上边距
    }
    var vmousedown = "mousedown",
        vmousemove = "mousemove", 
        vmouseup = "mouseup";
    if("ontouchend" in document){
        vmousedown = "touchstart";
        vmousemove = "touchmove";
        vmouseup = "touchend";
    }
    /**
     * CanvasCrop canvas剪切图片插件
     * @param {
     *     opts: {
     *       limitOver: 初始图片大小( 0: 不限制;1: 以外容器为初始参照物,2: 以内部切图框为初始参照物)
     *     }
     *     el: 剪切插件对象,
     *     rot: 旋转角度,
     *     ratio: 放大/缩小倍数,
     *     innerRatio: 内部缩放倍数(图片过大是缩小canvas),
     *     visbleCanvas: 作为上传图片的canvas,
     *     visbleContext: 作为上传图片的context("2d"),
     *     drawArgument: 绘制背景canvas(visbleCanvas)参数,
     *     clipArgument: 生成剪切后图片参数对象,
     * }
     */
    
    $.CanvasCrop = function(options){
        
        var opts = $.extend({},{
                limitOver: 1,
                isMoveOver: false
            },options),
            el = $(options.cropBox)||$(".cropBox"),
            rot = 0,
            ratio = 1,
            innerRatio = 1,
            warpBox = new BoxLayout(el),
            thumb = options.thumbBox? $(options.thumbBox) : el.find(".thumbBox"),
            thumbBox = new BoxLayout(thumb),
            ImgSrc = options.imgSrc,
            img = new Image(),
            drawArgument = {},
            clipArgument = {
                dx : thumbBox.x - warpBox.x,
                dy : thumbBox.y - warpBox.y,
            },
            visbleCanvas,visbleContext,
            visbleCanvasBox = {
                left: 0,
                top: 0
            },
            CanvasCropInit = function(){
                if(ImgSrc){
                    canvasInit();
                    img.src = ImgSrc;
                    //thumbBoxInit();
                    
                    el.off(".CropDown").on(vmousedown+".CropDown",backgroudMove);
                }else{
                    throw "image src is not defined";
                }
                
            },
            canvasInit = function(){
                img.onload = function(){
                    visbleCanvas = document.createElement("canvas");
                    limitOver();
                    getScale();
                    visbleCanvas.id="visbleCanvas";
                    visbleCanvas.style.position = "absolute";
                    visbleContext = visbleCanvas.getContext("2d");
                    drawImage();
                    setPosition({x:(warpBox.width-visbleCanvas.width)/2,y:(warpBox.height-visbleCanvas.height)/2});
                    el.find("#visbleCanvas").remove();
                    el.prepend(visbleCanvas);
                    img.onload = img.onerror = null;
                }
                img.onerror = function(){
                    alert("下载图片出错");
                }
            },
            limitOver = function(){
                var w = img.width,
                    h = img.height,
                    imgRatio = w/h;
                if(imgRatio<1){
                    if(opts.limitOver == 1){
                        h = warpBox.height;
                    }else if(opts.limitOver == 2){
                        w = thumbBox.width;
                        h = w/imgRatio;
                    }
                }else{
                    if(opts.limitOver == 1){
                        w = warpBox.width;
                        h = w/imgRatio;
                    }else if(opts.limitOver == 2){
                        h = thumbBox.height;
                    }
                }
                innerRatio = h/img.height;
            },
            thumbBoxInit = function(){
                var thumb = el.find(".thumbBox");
                var pointList = "<div class='cropPoint' style='left:-4px;top:-4px;' id='leftTopPoint'></div>"+
                                "<div class='cropPoint' style='right:-4px;top:-4px;' id='rightTopPoint'></div>"+
                                "<div class='cropPoint' style='left:-4px;bottom:-4px;' id='leftBottomPoint'></div>"+
                                "<div class='cropPoint' style='right:-4px;bottom:-4px;' id='rightBottomPoint'></div>";
                
                thumb.append(pointList);
                
            },
            backgroudMove = function(e){
                e.preventDefault();
                if(!visbleCanvas){
                    return false;
                }
                var oldBox = new BoxLayout($(visbleCanvas)),
                    pagesite =  getPagePos(e),
                    oldPointer = {
                        x: pagesite.pageX,
                        y: pagesite.pageY
                    };
                this.onselectstart = function(){
                    return false;
                }
                $(document).on(vmousemove+".CropMove",function(e){
                    e.preventDefault();
                    var pagesite =  getPagePos(e),
                        disX = pagesite.pageX - oldPointer.x,
                        disY = pagesite.pageY - oldPointer.y;
                        imgDis = {
                            x: oldBox.left + disX,
                            y: oldBox.top + disY
                        };
                    setPosition(imgDis);

                });
                $(document).on(vmouseup+".CropLeave",function(e){
                    e.preventDefault();
                    $(document).off(".CropMove").off(".CropLeave");
                });
            },
            getPagePos = function(evt){
                return {
                    pageX : hasTouch()? evt.originalEvent.touches[0].pageX : evt.pageX,
                    pageY : hasTouch()? evt.originalEvent.touches[0].pageY : evt.pageY
                }
            }
            innerRotate = function(){
                var w = visbleCanvas.width,
                    h = visbleCanvas.height,
                    rotation = Math.PI * rot / 180,
                    c = Math.round(Math.cos(rotation) * 1000) / 1000,
                    s = Math.round(Math.sin(rotation) * 1000) / 1000;
                //旋转后canvas标签的大小
                visbleCanvas.height = Math.abs(c*h) + Math.abs(s*w);
                visbleCanvas.width = Math.abs(c*w) + Math.abs(s*h);

                //改变中心点
                if (rotation <= Math.PI/2) {
                    visbleContext.translate(s*h,0);
                } else if (rotation <= Math.PI) {
                    visbleContext.translate(visbleCanvas.width,-c*h);
                } else if (rotation <= 1.5*Math.PI) {
                    visbleContext.translate(-c*w,visbleCanvas.height);
                } else {
                    visbleContext.translate(0,-s*w);
                }
                visbleContext.rotate(rotation);
                
            },
            hasTouch = function(){
                return "ontouchend" in document;
            }
            getScale = function(){  //获取缩放后的宽高
                drawArgument.w = visbleCanvas.width = img.width*innerRatio*ratio;
                drawArgument.h = visbleCanvas.height = img.height*innerRatio*ratio;
            },
            drawImage = function(){ //绘图
                visbleContext.clearRect(0,0,visbleCanvas.width,visbleCanvas.height);
                visbleContext.drawImage(img, 0, 0, drawArgument.w, drawArgument.h);
            },
            getPosition = function(oldWidth,oldHeight){
                return {
                    x: visbleCanvasBox.left + (oldWidth-visbleCanvas.width)/2,
                    y: visbleCanvasBox.top + (oldHeight-visbleCanvas.height)/2
                }
            },
            setPosition = function(imgDis){
                var thumbBoxPos = {
                    left: thumbBox.x-warpBox.x,
                    top: thumbBox.y-warpBox.y,
                    right: thumbBox.x-warpBox.x + thumbBox.width,
                    bottom: thumbBox.y-warpBox.y + thumbBox.height
                }
                if(opts.isMoveOver){
                    if(thumbBoxPos.left-imgDis.x<0){
                        imgDis.x = thumbBoxPos.left;
                    }else if(thumbBoxPos.right > imgDis.x + visbleCanvas.width){
                        imgDis.x = thumbBoxPos.right - visbleCanvas.width;
                    }
                    if(thumbBoxPos.top-imgDis.y<0){
                        imgDis.y = thumbBoxPos.top;
                    }else if(thumbBoxPos.bottom > imgDis.y + visbleCanvas.height){
                        imgDis.y = thumbBoxPos.bottom - visbleCanvas.height;
                    }
                }

                $(visbleCanvas).css({
                    left: imgDis.x,
                    top: imgDis.y
                });
                visbleCanvasBox = {  //将canvas坐标保存起来
                    left: imgDis.x,
                    top: imgDis.y
                };
                clipArgument = {  //将生成剪切后图片坐标保存起来
                    dx: imgDis.x - thumbBoxPos.left,
                    dy: imgDis.y - thumbBoxPos.top
                };  
                
            },
            canvasTransform = function(options){
                if(!visbleCanvas){
                    return false;
                }
                var oldWidth = visbleCanvas.width,
                    oldHeight = visbleCanvas.height;
                
                ratio = typeof options.ratio === "undefined"? ratio : options.ratio;
                rot = typeof options.rot === "undefined"? rot : options.rot;
                
                //保存canvas状态
                visbleContext.save();
                //缩放
                getScale(); 
                //旋转
                innerRotate();
                drawImage();
                //恢复canvas状态
                visbleContext.restore();
                
                var pos = getPosition(oldWidth,oldHeight); //计算变化后的坐标
                setPosition(pos); //设定变化后的坐标
            };
        
        var returnObj = {
            rotate : function(deg){
                canvasTransform({
                    rot: deg
                });
            },
            scale: function(ratio){
                canvasTransform({
                    ratio: ratio
                });
            },
            getDataURL: function(type){
                var type = type||"png",
                    width = thumbBox.width,
                    height = thumbBox.height,
                    hiddenCanvas = document.createElement("canvas"),
                    hiddenContext = hiddenCanvas.getContext("2d");
                
                hiddenCanvas.width = "500";
                hiddenCanvas.height = height;
                //hiddenContext.drawImage(visbleCanvas, clipArgument.sx, clipArgument.sy, width, height, 0, 0, width, height);
                hiddenContext.drawImage(visbleCanvas, clipArgument.dx, clipArgument.dy, visbleCanvas.width,visbleCanvas.height);
                return hiddenCanvas.toDataURL('image/'+type);
            }
        }
        
        CanvasCropInit();
        
        return returnObj;
    }
}));