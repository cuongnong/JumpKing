var GameLayer = cc.Layer.extend({
    _king: null,
    _level: null,
    _map: null,
    _canSwitch: null,
    ctor: function (){
        this._super();
        this.addKeyboardEvent();
        this.addMouseEvent();
        this.initPhysics();
        this.scheduleUpdate();
        this._king = new King(cc.p(600,120), this.space);
        this._level = 0;
        this._map = new Wall(this.space);
        this._canSwitch = true;
        this.addChild(this._map);
        this.addChild(this._king, 1);

    },
    update: function (dt) {
        this.space.step(dt);
        this.changeStage();
    },
    changeStage: function () {
        var curPos = this._king.getPosition();
        if(curPos.y > cc.winSize.height && this._canSwitch && this._king.getState() == MW.STATE.JUMP && this._king.getPositionStatus() == MW.POS.ASCENDING){
            this._level++;
            this._canSwitch = false;
            this._map.loadMap(this._level, this._level - 1);
            this.caculateNewKingPosition(this._king.getLastJumpInfo());
        }else if(this.canSwitch(curPos) && this._canSwitch){
            this._level--;
            this._canSwitch = false;
            this._map.loadMap(this._level, this._level + 1);
            this._king.setPosition(cc.p(this._king.getPosition().x, cc.winSize.height - 30));
        }
        cc.log(this._king._state + " pos Status: " + this._king._posStatus + " x: " + curPos.x + " y: " + curPos.y + " canSwitch: " + this._canSwitch);
        if(this._king.getPositionStatus() == MW.POS.STAND || curPos.y < 0){
            this._canSwitch = true;
        }
    },
    canSwitch: function (curPos) {
        var state = this._king.getState();
        var posStatus = this._king.getPositionStatus();
        if(curPos.y < 0 && (posStatus == MW.POS.DESCENDING)){ //&& (state == MW.STATE.JUMP || state == MW.STATE.FALL || state == MW.STATE.STAND)
            return true;
        }
        return false;
    },
    caculateNewKingPosition: function (info) {
        this._king.setPosition(cc.p(info.x, 0));

    },
    addKeyboardEvent: function () {
        if(cc.sys.capabilities.hasOwnProperty("keyboard")){
            var self = this;
            cc.eventManager.addListener({
                event: cc.EventListener.KEYBOARD,

                onKeyPressed: function (key, event) {
                    var currentKingState = self._king.getState();
                    switch (key*1){
                        case cc.KEY.space:
                            if(currentKingState == MW.STATE.JUMP || currentKingState == MW.STATE.FALL){
                                break;
                            }
                            MW.KEYS[cc.KEY.space] = true;
                            self._king.setState(MW.STATE.SIT);
                            break;
                        case cc.KEY.left:
                            if(MW.KEYS[cc.KEY.right]){
                                MW.KEYS[cc.KEY.right] = false;
                            }
                            MW.KEYS[cc.KEY.left] = true;
                            self._king.setDirection(MW.DIRECTION.LEFT);
                            if(currentKingState == MW.STATE.STAND){
                                self._king.setState(MW.STATE.MOVE);
                            }

                            break;
                        case cc.KEY.right:
                            if(MW.KEYS[cc.KEY.left]){
                                MW.KEYS[cc.KEY.left] = false;
                            }
                            MW.KEYS[cc.KEY.right] = true;
                            self._king.setDirection(MW.DIRECTION.RIGHT);
                            if(currentKingState == MW.STATE.STAND){
                                self._king.setState(MW.STATE.MOVE);
                            }
                            break;
                    }
                    self._king.moveAnimation();
                },
                onKeyReleased: function (key, event) {
                    var currentKingState = self._king.getState();
                    switch (key*1){
                        case cc.KEY.space:
                            MW.KEYS[cc.KEY.space] = false;
                            if(currentKingState == MW.STATE.JUMP){
                                break;
                            }
                            self._king.setState(MW.STATE.JUMP);
                            break;
                        case cc.KEY.left:
                            MW.KEYS[cc.KEY.left] = false;
                            if(currentKingState == MW.STATE.MOVE && !MW.KEYS[cc.KEY.right]){
                                self._king.setState(MW.STATE.STAND);
                                self._king.setDirection(MW.DIRECTION.UP);
                            }
                            break;
                        case cc.KEY.right:
                            MW.KEYS[cc.KEY.right] = false;

                            if(currentKingState == MW.STATE.MOVE && !MW.KEYS[cc.KEY.left]){
                                self._king.setState(MW.STATE.STAND);
                                self._king.setDirection(MW.DIRECTION.UP);
                            }
                            break;
                    }
                    self._king.moveAnimation();
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