var King = cc.PhysicsSprite.extend({
    _speed: null,
    _state: null,
    _power: null,
    _direction: null,
    _lastPos: null,
    _lastJumpInfo: null,
    _posStatus: null,
    _body: null,
    _action: null,
    setState: function (state) {
        this._state = state;
    },
    getState: function () {
        return this._state;
    },
    addPower: function (delta) {
        this._power += delta;
    },
    getPower: function () {
        return this._power;
    },
    resetPower: function () {
        this._power = 0;
    },
    setDirection: function (direction) {
        this._direction = direction;
    },
    getDirection: function () {
        return this._direction;
    },
    setPositionStatus: function (status) {
        this._posStatus = status;
    },
    getPositionStatus: function () {
        return this._posStatus;
    },
    ctor: function ( pos, space) {
        var _height = 60;
        var _width = 60;
        this._super(res.king);

        var body = new cp.Body(1 , Infinity);
        body.setDynamic = true;
        body.setPos( pos );
        space.addBody( body );
        var shape = new cp.BoxShape(body, _width, _height);
        shape.setFriction(0.1);
        shape.setElasticity(1);
        space.addShape( shape );

        this.setScale(_height/this.width);
        this.setBody(body);
        this.addAnimation();

        this._body = this.getBody();
        this._speed = 40;
        this._lastPos = pos;

        this.setState(MW.STATE.STAND);
        this.resetPower();
        this.setDirection(MW.DIRECTION.UP);
        this.setPositionStatus(MW.POS.STAND);
        this._lastJumpInfo = {
            x: null,
            y: null,
            power: MW.POWER_MIN,
            direction: MW.DIRECTION.UP
        }
        this.schedule(this.update);
    },
    update: function(dt){
        this.directionAnimation();
        this.updatePosition(dt);
        this.jumpingAnimation();
        var precision = 40;
        var curX =  Math.round(this.getPosition().x, precision);
        var curY =  Math.round(this.getPosition().y, precision);
        // neu dang nhay -> khong the di chuyen
        var curState = this.getState();
        //cc.log(curState + " pos Status: " + this._posStatus);
        if(curState != MW.STATE.JUMP){
            if(curY < this._lastPos.y){
                this.setPositionStatus(MW.POS.DESCENDING);
            }else{
                this.setPositionStatus(MW.POS.STAND);
            }
            this._lastPos.x = Math.round(this.getPosition().x, precision);
            this._lastPos.y = Math.round(this.getPosition().y, precision);
            return true;
        }

        if(curY > this._lastPos.y){
            this.setPositionStatus(MW.POS.ASCENDING);
        }else if(curY < this._lastPos.y){
            this.setPositionStatus(MW.POS.DESCENDING);
        }else{
            this.setPositionStatus(MW.POS.STAND);
        }

        if(this._lastPos.x == curX && this._lastPos.y == curY){
            MW.COUNTER -= 1;
            if(MW.COUNTER <= MW.POS.STAND){
                this.setState(MW.STATE.STAND);
                this.setDirection(MW.DIRECTION.UP);
                MW.COUNTER = 8;
                cc.log("settttt");

            }
        }else{
            this._lastPos.x = Math.round(this.getPosition().x, precision);
            this._lastPos.y = Math.round(this.getPosition().y, precision);
        }

    },
    updatePosition: function (dt) {

        switch(this._state){
            case MW.STATE.STAND:
                break;
            case MW.STATE.SIT:
                this.addPower(2*dt);

                break;
            case MW.STATE.MOVE:
                if(MW.KEYS[cc.KEY.left]){
                    this.setPosition(cc.p(this.x - 4, this.y));
                    //this._body.applyImpulse(cp.v(-this._speed, 0), cp.v(0, 0));
                }else if(MW.KEYS[cc.KEY.right]){
                    this.setPosition(cc.p(this.x + 4, this.y));
                    //this._body.applyImpulse(cp.v(this._speed, 0), cp.v(0, 0));
                }
                break;
            case MW.STATE.JUMP:
                if(this._power > MW.POWER_MIN){
                    if(this._power >= MW.POWER_MAX){
                        this._power = MW.POWER_MAX;
                    }else if(this._power < MW.POWER_INIT){
                        this._power = MW.POWER_INIT;
                    }
                    this.saveJumpInfo();
                    this.jump(this._power, this._direction);
                    this.resetPower();
                    this.setPositionStatus(MW.POS.ASCENDING);
                    this.setDirection(MW.DIRECTION.UP);
                }
                break;
        }
    },
    jump: function ( power, direction) {
        cc.log(power);
        var kingBody = this._body;
        switch(direction){
            case MW.DIRECTION.UP:
                kingBody.applyImpulse(cp.v(0, power * MW.JUMP_POWER), cp.v(0,0));
                break;
            case MW.DIRECTION.LEFT:
                kingBody.applyImpulse(cp.v( -power * 500, power * MW.JUMP_POWER), cp.v(0,0));
                break;
            case MW.DIRECTION.RIGHT:
                kingBody.applyImpulse(cp.v(power * 500, power * MW.JUMP_POWER), cp.v(0,0));
                break;
        }
    },
    jumpingAnimation: function () {
        if(this._state == MW.STATE.SIT){
            this.setTexture(res.jump1);
            return true;
        }
        if(this._state == MW.STATE.STAND){
            this.setTexture(res.king);
        }
        if(this._posStatus == MW.POS.ASCENDING){
            this.setTexture(res.jump2);
        }
        else if(this._posStatus == MW.POS.DESCENDING){
            this.setTexture(res.jump3);
        }
    },
    directionAnimation: function () {
        //cc.log(this._direction);
        if(this._direction == MW.DIRECTION.UP){
            return true;
        }
        if(this._direction == MW.DIRECTION.LEFT){
            this.setFlippedX(true);
        }else{
            this.setFlippedX(false);
        }
    },
    moveAnimation: function () {
        if(this._state == MW.STATE.STAND){
            this.setTexture(res.king);
        }
        if(MW.KEYS[cc.KEY.right]){
            this.startActionMoveToRight();
            return true;
        }
        else if (!MW.KEYS[cc.KEY.right]){
            this.stopActionMoveToRight();
            //this.setSprite(new cc.Sprite(res.king));
        }
        if(MW.KEYS[cc.KEY.left]){
            this.startActionMoveToLeft();
            cc.log("turning ");
            return true;
        }
        else if(!MW.KEYS[cc.KEY.left]){
            this.stopActionMoveToLeft();
        }
    },
    startActionMoveToRight: function () {

        var action = this._action[0].clone();
        this.runAction(action.repeatForever());
    },
    stopActionMoveToRight: function () {
        this.stopAllActions();
        this.setTexture(res.king);
    },
    startActionMoveToLeft: function () {

        var action = this._action[0].clone();
        this.runAction(action.repeatForever());
    },
    stopActionMoveToLeft: function () {
        this.stopAllActions();
        this.setTexture(res.king);
    },

    addAnimation: function () {
        this._action = [];
        var animationFrames = [];
        var spriteFrame = new cc.SpriteFrame(res.king, cc.rect(0, 0, 30, 30));
        var animationFrame = new cc.AnimationFrame();
        animationFrame.initWithSpriteFrame(spriteFrame, 1, null);
        animationFrames.push(animationFrame);
        spriteFrame = new cc.SpriteFrame(res.king2, cc.rect(0, 0, 30, 30));
        animationFrame = new cc.AnimationFrame();
        animationFrame.initWithSpriteFrame(spriteFrame, 1, null);
        animationFrames.push(animationFrame);
        spriteFrame = new cc.SpriteFrame(res.king3, cc.rect(0, 0, 30, 30));
        animationFrame = new cc.AnimationFrame();
        animationFrame.initWithSpriteFrame(spriteFrame, 1, null);
        animationFrames.push(animationFrame);
        spriteFrame = new cc.SpriteFrame(res.king4, cc.rect(0, 0, 30, 30));
        animationFrame = new cc.AnimationFrame();
        animationFrame.initWithSpriteFrame(spriteFrame, 1, null);
        animationFrames.push(animationFrame);

        var animation = new cc.Animation(animationFrames, 0.08);
        var action = new cc.Animate(animation);
        action.retain();
        this._action.push(action);
    },
    saveJumpInfo: function(){
        var curPos = this.getPosition();
        this._lastJumpInfo = {
            x: curPos.x,
            y: curPos.y,
            power: this._power,
            direction: this._direction
        }
    },
    getLastJumpInfo: function () {
        return this._lastJumpInfo;
    }
})