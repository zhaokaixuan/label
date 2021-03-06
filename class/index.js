/**
 *canvas绘制
 *
 * @class Canvas
 */
class Canvas{
    /**
     *Creates an instance of Canvas.
     * @param {document} canvas
     * @memberof Canvas
     */
    constructor(canvas){  
        this.canvas = canvas;
        this.ctx = this.canvas.getContext('2d');
        this.w = this.canvas.width;
        this.h = this.canvas.height;
        this.touch = ("createTouch" in document);
        this.StartEvent = this.touch ? "touchstart" : "mousedown";
        this.MoveEvent = this.touch ? "touchmove" : "mousemove";
        this.EndEvent = this.touch ? "touchend" : "mouseup";
        this.lock = false;
        this.rect = {};
        this.isRect = false;
        this.outerParams = {
            rect: {
                lineWidth: 2,
                radius: 0,
                color: "red"
            }
        }
        this.status = {
            rectArr : []
        }
        this.bind()
    }
    /**
     *绘制矩形
     *
     * @memberof Canvas
     */
    chooseRect (){
        this.isRect = true;
    }
    /**
     *绘制事件
     *
     * @memberof Canvas
     */
    bind (){
        let t = this;
        this.canvas['on' + t.StartEvent ] = function(e){
            let touch = t.touch ? e.touches[e] : e;
                t.lock = true;
            let _x = touch.offsetX;
            let _y = touch.offsetY;
            if(t.isRect){
                t.rect.x = _x;
                t.rect.y = _y;
            }
        }
        this.canvas['on' + t.MoveEvent] = function(e){
            if(t.lock){
                if(t.isRect){
                    t.rect.width = Math.abs(t.rect.x - e.offsetX);
                    t.rect.height = Math.abs(t.rect.y - e.offsetY);
                    if(t.rect.x > e.offsetX){
                        t.rect.realX = e.offsetX;
                    }else{
                        t.rect.realX = t.rect.x;
                    }
                    if(t.rect.y > e.offsetY){
                        t.rect.realY = e.offsetY;
                    }else{
                        t.rect.realY = t.rect.y;
                    }
                    t.clear();
                    t.redrawAll();
                    t.drawRect(
                        t.rect.realX,
                        t.rect.realY,
                        t.rect.width,
                        t.rect.height,
                        t.outerParams.rect.radius,
                        t.outerParams.rect.color,
                        t.outerParams.rect.lineWidth
                    )
                }
            }
        }
        this.canvas['on' + t.EndEvent] = function(e){
            if(t.isRect){
                t.status.rectArr.push({
                    realX: t.rect.realX,
                    realY: t.rect.realY,
                    width: t.rect.width,
                    height: t.rect.height,
                    radius: t.outerParams.rect.radius,
                    color: t.outerParams.rect.color,
                    lineWidth: t.outerParams.rect.lineWidth
                })
                t.rect = {};
            }
            t.lock = false;
        }
    }
    /**
     *清除画布
     *
     * @memberof Canvas
     */
    clear (){
        this.ctx.clearRect(0,0,this.w,this.h);
    }
    /**
     *绘制所有图形
     *
     * @memberof Canvas
     */
    redrawAll (){
        let t = this;
        this.status.rectArr.forEach((val) => {
            t.drawRect(val.realX,val.realY,val.width,val.height,val.radius,val.color,val.lineWidth)
        })
    }
    /**
     *绘制图形需要的参数
     *
     * @param {Number} realX
     * @param {Number} realY
     * @param {Number} width
     * @param {Number} height
     * @param {Number} radius
     * @param {String} color
     * @param {Number} lineWidth
     * @memberof Canvas
     */
    drawRect (realX,realY,width,height,radius,color,lineWidth){
        this.createRect(realX,realY,width,height,radius,color,'stroke',lineWidth)
    }
    /**
     *绘制
     *
     * @param {Number} x
     * @param {Number} y
     * @param {Number} width
     * @param {Number} height
     * @param {Number} radius
     * @param {String} color
     * @param {String} type
     * @param {Number} lineWidth
     * @memberof Canvas
     */
    createRect (x,y,width,height,radius,color,type,lineWidth){
        this.ctx.beginPath();
        this.ctx.moveTo(x,y + radius);
        this.ctx.lineTo(x,y + height - radius);
        this.ctx.quadraticCurveTo(x,y + height, x + radius, y + height);
        this.ctx.lineTo(x + width - radius, y + height);
        this.ctx.quadraticCurveTo(x + width, y +height, x+ width, y + height - radius);
        this.ctx.lineTo(x + width, y + radius);
        this.ctx.quadraticCurveTo(x+ width, y, x + width - radius, y);
        this.ctx.lineTo(x+ radius, y);
        this.ctx.quadraticCurveTo(x, y, x, y +radius);
        this.ctx[type + 'Style'] = color;
        this.ctx.lineWidth = lineWidth;
        this.ctx.closePath();
        this.ctx[type]();
    }
}