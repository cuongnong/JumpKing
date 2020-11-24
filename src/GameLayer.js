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
        this.addChild(this._king, 1);

    },
    update: function (dt) {
        this.space.step(dt);
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
                                self._king.updateAnimation();
                                self._king._direction = MW.DIRECTION.UP;
                                break;
                            case cc.KEY.left:
                                MW.KEYS[cc.KEY.left] = true;
                                self._king._direction = MW.DIRECTION.LEFT;
                                break;
                            case cc.KEY.right:
                                MW.KEYS[cc.KEY.right] = true;
                                self._king._direction = MW.DIRECTION.RIGHT;
                                break;
                        }
                    self._king.updateAnimation();
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
                            //self._king._direction = MW.DIRECTION.LEFT;
                            //self._king._state = MW.STATE.STAND;
                            break;
                        case cc.KEY.right:
                            MW.KEYS[cc.KEY.right] = false;
                            //self._king._direction = MW.DIRECTION.RIGHT;
                            //self._king._state = MW.STATE.STAND;
                            break;
                    }
                    self._king.updateAnimation();
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

    initPhysics: function () {
        this.space = new cp.Space();
        this.space.gravity = cp.v(0, -1800);
    },
});