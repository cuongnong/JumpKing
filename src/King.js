var King = cc.PhysicsSprite.extend({
    _speed: null,
    _state: null,
    _power: null,
    _direction: null,
    _lastPos: null,
    _posStatus: null,
    _body: null,
    _action: null,

    ctor: function ( pos, space) {
        this._super(res.king);
        this.addAnimation();
        var _height = 60;
        var _width = 60;
        var body = new cp.Body(1 , Infinity);
        body.setDynamic = true;
        body.setPos( pos );
        space.addBody( body );
        var shape = new cp.BoxShape(body, _width, _height);
        shape.setFriction(0.1);
        shape.setElasticity(1);

        space.addShape( shape );

        this.setScale(60/this.width);
        this.setBody(body);
        //this.setAnchorPoint(cc.p(0.5,0.5));
        this._body = this.getBody();
        this._state = MW.STATE.STAND;
        this._power = 0;
        this._direction = MW.DIRECTION.UP;
        this._speed = 4;
        this._lastPos = cc.p(0,0);
        this._posStatus = MW.POS.STAND;

        this.schedule(this.update);

    },
    update: function(dt){
        this.updatePosition(dt);
        this.jumpingAnimation();
        // neu dang nhay -> khong the di chuyen
        if(this._state == MW.STATE.STAND){
            return true;
        }
        var prec = 40;
        var curX =  Math.round(this.getPosition().x, prec);
        var curY =  Math.round(this.getPosition().y, prec);

        if(curY > this._lastPos.y){
            this._posStatus = MW.POS.ASCENDING;
        }else if(curY < this._lastPos.y){
            this._posStatus = MW.POS.DESCENTING;
        }else{
            this._posStatus = MW.POS.STAND;
            this.updateAnimation();
        }

        if(this._lastPos && this._lastPos.x == curX && this._lastPos.y == curY){
            MW.COUNTER -= 1;
            if(MW.COUNTER <= MW.POS.STAND){
                this._state = MW.STATE.STAND;

                MW.COUNTER = 8;
                cc.log("settttt");
            }
        }else{
            this._lastPos.x = Math.round(this.getPosition().x, prec);
            this._lastPos.y = Math.round(this.getPosition().y, prec);
        }

    },
    updatePosition: function (dt) {
        switch(this._state){
            case MW.STATE.STAND:
                var kingBody = this._body;
                if(MW.KEYS[cc.KEY.space]){
                    this._power += 2*dt;
                    if(MW.KEYS[cc.KEY.left]){
                        this._direction = MW.DIRECTION.LEFT;
                    }else if(MW.KEYS[cc.KEY.right]){
                        this._direction = MW.DIRECTION.RIGHT;
                    }
                }else if(MW.KEYS[cc.KEY.left] && this.x >= this._speed + 382 + 30){
                    this.setPosition(cc.p(this.x - this._speed, this.y));


                }else if(MW.KEYS[cc.KEY.right] && this.x <= cc.winSize.width - this._speed - cc.winSize.width + 1054  - 30){
                    this.setPosition(cc.p(this.x + this._speed, this.y));

                }
                break;
            case MW.STATE.JUMP:
                if(this._power >= 1){
                    this._power = 1;
                }else if(this._power < 0.5){
                    this._power = 0.5;
                }
                this.jump();
                break;
        }
    },
    jump: function () {
        var kingBody = this._body;
        var power = this._power;
        switch(this._direction){
            case MW.DIRECTION.UP:
                kingBody.applyImpulse(cp.v(0, power * MW.JUMP_POWER), cp.v(0,0));
                cc.log(power);
                break;
            case MW.DIRECTION.LEFT:
                kingBody.applyImpulse(cp.v( -power * 500, power * MW.JUMP_POWER), cp.v(0,0));
                cc.log(power);
                break;
            case MW.DIRECTION.RIGHT:
                kingBody.applyImpulse(cp.v(power * 500, power * MW.JUMP_POWER), cp.v(0,0));
                cc.log(power);
                break;
        }
        this._power = 0;
        this._state = MW.STATE.JUMPING;
        this._posStatus = MW.POS.ASCENDING;
    },
    jumpingAnimation: function () {
        if(MW.KEYS[cc.KEY.space]){
            this.stopAllActions();
            this.setTexture(res.jump1);
            return true;
        }
        if(this._direction == MW.DIRECTION.LEFT){
            this.setFlippedX(true);
        }else{
            this.setFlippedX(false);
        }
        if(this._posStatus == MW.POS.ASCENDING){
            this.setTexture(res.jump2);
        }
        else if(this._posStatus == MW.POS.DESCENTING){
            this.setTexture(res.jump3);
        }
    }
    ,
    updateAnimation: function () {
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

})