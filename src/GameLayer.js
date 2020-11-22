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
        this._king = new King(cc.p(720,800), this.space);

        this.addChild(this._king);
        //this.addAnimation();
    },
    update: function (dt) {
        this.space.step(dt);
    },
    initPhysics: function () {
        this.space = new cp.Space();
        this.space.gravity = cp.v(0, -1800);
    },
    addWallsAndGround: function () {
        var wall = new Wall(this.space);
        this.addChild(wall);

    },
    addKeyboardEvent: function () {
        if(cc.sys.capabilities.hasOwnProperty("keyboard")){
            var self = this;
            cc.eventManager.addListener({
                event: cc.EventListener.KEYBOARD,
                onKeyPressed: function (key, event) {
                    //if(self._king._state == MW.STATE.STAND){
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
                    //}
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
    addMouseEvent: function () {
        cc.eventManager.addListener({
                event: cc.EventListener.MOUSE,
                onMouseMove: function (event) {
                    cc.log(event.getLocation().x + " " + event.getLocation().y);
                    return true;
                }
            }
            ,this);
    },
    addAnimation: function () {
        var animationFrames = [];
        var spriteFrame = new cc.SpriteFrame(res.king);
        var animationFrame = new cc.AnimationFrame();
        animationFrame.initWithSpriteFrame(spriteFrame, 1, null);
        animationFrames.push(animationFrame);
        spriteFrame = new cc.SpriteFrame(res.king2);
        animationFrame = new cc.AnimationFrame();
        animationFrame.initWithSpriteFrame(spriteFrame, 1, null);
        animationFrames.push(animationFrame);
        spriteFrame = new cc.SpriteFrame(res.king3);
        animationFrame = new cc.AnimationFrame();
        animationFrame.initWithSpriteFrame(spriteFrame, 1, null);
        animationFrames.push(animationFrame);
        spriteFrame = new cc.SpriteFrame(res.king4);
        animationFrame = new cc.AnimationFrame();
        animationFrame.initWithSpriteFrame(spriteFrame, 1, null);
        animationFrames.push(animationFrame);

        var animation = cc.Animation(animationFrames, 0.08);
        var action = cc.Animate(animation);
        this._king.runAction(action.repeatForever());

    }

});