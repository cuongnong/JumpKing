var King = cc.PhysicsSprite.extend({
    _speed: null,
    _state: null,
    _power: null,
    _direction: null,
    _lastPos: null,
    _posStatus: null,
    ctor: function () {
        this._super(res.king);
        this.start();
        this.schedule(this.update);
    },
    update: function(dt){
        var rotateAction = new cc.RotateTo(1, 45);
        this.runAction(rotateAction);
        //cc.log(this.x + " " + this.y);
        if(this._state == MW.STATE.STAND){
            return true;
        }
        var prec = 50;
        var curX =  Math.round(this.getPosition().x, prec);
        var curY =  Math.round(this.getPosition().y, prec);

        if(this._lastPos && this._lastPos.x == curX && this._lastPos.y == curY){
            this._posStatus -= 1;
            if(this._posStatus <= MW.POS.STAND){
                this._state = MW.STATE.STAND;
                cc.log("settttt");
            }
        }else{
            this._lastPos.x = Math.round(this.getPosition().x, prec);
            this._lastPos.y = Math.round(this.getPosition().y, prec);
            //cc.log("unnnnsettttt");
        }
    },
    start: function () {
        this.setScale(30/this.width);
        cc.log(this.width + "-" + this.height);
        this._state = MW.STATE.STAND;
        this._power = 0;
        this._direction = MW.DIRECTION.UP;
        this._speed = 2;
        this._lastPos = cc.p(0,0);
        this._posStatus = MW.POS.STAND;

    }
})