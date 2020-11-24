/**
 * Created by cuong on 11/19/2020.
 */
var UPPERS_FRICTION = 999999999999999;
var UPPERS_ELASTICITY = 0;
var SIDES_FRICTION = 0.1;
var SIDES_ELASTICITY = 0.6;
var WALLS_WIDTH = 1;

var MAPS = [];
var Wall = cc.Layer.extend({
    space: null,
    ctor: function (_space) {
        this._super();
        this.space = _space;
        this.loadMap();
        cc.log(MAPS.length + "--------------------------------------------------");
        this.loadBackground(0);
        this.setupDebugNode();
        this.loadAnimation(0)
    },
    loadAnimation: function (level) {
        switch (level){
            case 0:
                var fire = new cc.Sprite(res.fire3);
                fire.setPosition(cc.p(510,135));
                //var actionTo = cc.skewTo(0.1, 10, -10);
                //var actionBack = cc.skewTo(0.1, 0, 0);
                //var action = cc.sequence(actionTo, actionBack);
                var action = cc.blink(2, 6);
                fire.runAction(action.repeatForever());
                this.addChild(fire, -1);
                break;
        }
    },

    loadBackground: function (level) {
        var backgroundImage = new cc.Sprite(res.map[level]);
        backgroundImage.setAnchorPoint(cc.p(0,0));
        //backgroundImage.setScale(cc.winSize.height/backgroundImage.height);
        backgroundImage.setScalesPageToFit = true;
        this.addChild(backgroundImage, -2);
        var leftWall = new cp.SegmentShape(this.space.staticBody, cp.v(0, cc.winSize.height), cp.v(0,0), WALLS_WIDTH);
        leftWall.setFriction(SIDES_FRICTION);
        leftWall.setElasticity(SIDES_ELASTICITY);
        var rightWall = new cp.SegmentShape(this.space.staticBody, cp.v(cc.winSize.width,0), cp.v(cc.winSize.width, cc.winSize.height), WALLS_WIDTH);
        rightWall.setFriction(SIDES_FRICTION);
        rightWall.setElasticity(SIDES_ELASTICITY);

        this.space.addStaticShape(leftWall);
        this.space.addStaticShape(rightWall);

        this.loadNextMap(level);
    },
    loadNextMap: function (level) {
        if(level < MAPS.length){
            for(var i = 0; i < MAPS[level].length; i++){
                this.space.addStaticShape(MAPS[level][i]);
            }
        }
    },
    loadMap: function () {
        var singleMap = [];
        //map level 0
        singleMap.push(this.addSegmentShape(new cp.v(0, 81), new cp.v(cc.winSize.width, 81), 0));
        singleMap.push(this.addSegmentShape(new cp.v(0, 514), new cp.v(382, 514), 0));
        singleMap.push(this.addSegmentShape(new cp.v(382, 0), new cp.v(382, 513), 1));
        singleMap.push(this.addSegmentShape(new cp.v(1056, 0), new cp.v(1056, 514), 1));
        singleMap.push(this.addSegmentShape(new cp.v(1056, 514), new cp.v(cc.winSize.width, 514), 0));

        singleMap.push(this.addSegmentShape(new cp.v(556, 808), new cp.v(556, 948), 1));
        singleMap.push(this.addSegmentShape(new cp.v(556, 948), new cp.v(880, 948), 0));
        singleMap.push(this.addSegmentShape(new cp.v(880, 948), new cp.v(880, 808), 1));
        singleMap.push(this.addSegmentShape(new cp.v(880, 808), new cp.v(556, 808), 0));

        MAPS.push(singleMap);
    },
    addSegmentShape: function (bd, kt, type) {
        var friction = UPPERS_FRICTION;
        var elasticity = UPPERS_ELASTICITY;
        var wall = new cp.SegmentShape(this.space.staticBody, bd, kt, WALLS_WIDTH);
        if( type == 1){ //set friction and elasticity for side walls
            friction = SIDES_FRICTION;
            elasticity = SIDES_ELASTICITY;
        }
        wall.setGravity = false;
        wall.setFriction(friction);
        wall.setElasticity(elasticity);

        return wall;
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
    setupDebugNode : function() {
        this._debugNode = new cc.PhysicsDebugNode(this.space);
        this.addChild( this._debugNode );
    },

});