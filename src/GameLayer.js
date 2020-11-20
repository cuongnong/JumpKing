var GameLayer = cc.Layer.extend({
    _phKing: null,
    _king: null,
    ctor: function (){
        this._super();
        this.addKeyboardEvent();
        this.addMouseEvent();
        this.initPhysics();

        this.addWallsAndGround();
        this.scheduleUpdate();
        this._king = this.createPhysicsKing(cc.p(200,200));
        this.addChild(this._king);
    },
    update: function (dt) {
        this.space.step(dt);
        this.updatePosition(dt);
        //cc.log(this._king._state);
    },
    initPhysics: function () {
        this.space = new cp.Space();
        this.space.gravity = cp.v(0, -800);
    },
    addWallsAndGround: function () {
        //add background
        //var backgroundImage = new cc.Sprite(res.map);
        //backgroundImage.setAnchorPoint(cc.p(0,0));
        //backgroundImage.setScale(cc.winSize.width/backgroundImage.width);
        //this.addChild(backgroundImage, -1);
        var wall = new Wall(this.space);
        this.addChild(wall);
        //add walls
        //this.addBody(100,100,200,100,false,"", "bot1");
    },
    createPhysicsKing: function (pos) {
        var width = 30, height = 30, mass = 2;
        var body = new cp.Body(mass, Infinity);
        body.setPos( pos );
        this.space.addBody( body );

        var shape = new cp.BoxShape( body, width, height);
        shape.setFriction(0.0001);
        shape.setElasticity(1);
        shape.setCollisionType(0);

        this.space.addShape( shape );
        var sprite = new King();
        sprite.setBody( body );
        sprite.setAnchorPoint(cc.p(0.5,0.5));
        return sprite;
    },

    addKeyboardEvent: function () {
        if(cc.sys.capabilities.hasOwnProperty("keyboard")){
            var self = this;
            cc.eventManager.addListener({
                event: cc.EventListener.KEYBOARD,
                onKeyPressed: function (key, event) {
                    if(self._king._state == MW.STATE.STAND){
                        switch (key){
                            case cc.KEY.space:
                                MW.KEYS[cc.KEY.space] = true;
                                break;
                            case cc.KEY.left:
                                MW.KEYS[cc.KEY.left] = true;
                                break;
                            case cc.KEY.right:
                                MW.KEYS[cc.KEY.right] = true;
                                break;
                        }
                    }
                },
                onKeyReleased: function (key, event) {
                    switch (key){
                        case cc.KEY.space:
                            if(self._king._state != MW.STATE.STAND){
                                MW.KEYS[cc.KEY.space] = false;
                            }else{
                                MW.KEYS[cc.KEY.space] = false;
                                self._king._state = MW.STATE.JUMP;
                            }
                            break;
                        case cc.KEY.left:
                            MW.KEYS[cc.KEY.left] = false;
                            break;
                        case cc.KEY.right:
                            MW.KEYS[cc.KEY.right] = false;
                            break;
                    }
                }
            }, this);
        }
    },
    updatePosition: function (dt) {
        switch(this._king._state){
            case MW.STATE.STAND:
                var kingBody = this._king.getBody();
                if(MW.KEYS[cc.KEY.space]){
                    this._king._power += 2*dt;
                    if(MW.KEYS[cc.KEY.left]){
                        this._king._direction = MW.DIRECTION.LEFT;
                    }else if(MW.KEYS[cc.KEY.right]){
                        this._king._direction = MW.DIRECTION.RIGHT;
                    }
                }else if(MW.KEYS[cc.KEY.left] && this._king.x >= this._king._speed + 20){
                    this._king.setPosition(cc.p(this._king.x - this._king._speed, this._king.y));
                    //cc.log("body " + body.getPos().x + " + " + body.getPos().y);

                }else if(MW.KEYS[cc.KEY.right] && this._king.x <= cc.winSize.width - this._king._speed ){
                    this._king.setPosition(cc.p(this._king.x + this._king._speed, this._king.y));

                }
                break;
            case MW.STATE.JUMP:
                if(this._king._power >= 1){
                    this._king._power = 1;
                }else if(this._king._power < 0.5){
                    this._king._power = 0.5;
                }
                this.jump(this._king._power);
                this._king._power = 0;
                this._king._direction = MW.DIRECTION.UP;
                this._king._state = MW.STATE.JUMPING;
                this._king._posStatus = MW.POS.ASCENDING;
                break;
        }

    },
    jump: function ( power ) {
        var kingBody = this._king.getBody();
        switch(this._king._direction){
            case MW.DIRECTION.UP:
                kingBody.applyImpulse(cp.v(0, power * 1000), cp.v(0,0));
                cc.log(power);
                break;
            case MW.DIRECTION.LEFT:
                kingBody.applyImpulse(cp.v(-power * 400, power * 1000), cp.v(0,0));
                cc.log(power);
                break;
            case MW.DIRECTION.RIGHT:
                kingBody.applyImpulse(cp.v(power * 400, power * 1000), cp.v(0,0));
                cc.log(power);
                break;
        }
    },

    addBody: function (posX, posY, width, height, isDynamic, spriteImage, type) {
        if(isDynamic){
            var body = new cp.Body(1, cp.momentForBox(1, width, height));
        }else{
            var body = new cp.Body(Infinity, Infinity);
        }
        body.setPos(cp.v(posX, posY));
        if(isDynamic){
            this.space.addBody(body);
        }
        var shape = new cp.BoxShape(body, width, height);
        shape.setFriction(BOTTOM_FRICTION);
        shape.setElasticity(0);
        shape.name = type;

        this.space.addShape(shape);
    },
    addMouseEvent: function () {
        cc.eventManager.addListener({
                event: cc.EventListener.MOUSE,
                onMouseMove: function (event) {
                    cc.log(event.getLocation().x + " " + event.getLocation().y);
                    return true;
                }
            }
            ,this);
    }
});