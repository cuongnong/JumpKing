/**
 * Created by cuong on 11/19/2020.
 */
var UPPERS_FRICTION = 10;
var UPPERS_ELASTICITY = 0;
var SIDES_FRICTION = 0.1;
var SIDES_ELASTICITY = 0.6;
var WALLS_WIDTH = 14;

var MAPS = [];
var Wall = cc.Layer.extend({
    space: null,
    ctor: function (_space) {
        this._super();
        this.space = _space;
        this.initPhysicsMaps();
        this.initWall();

        //this.setupDebugNode();
        this.loadMap(0, null);
    },
    loadMap: function (level, preLevel) {
        this.loadBackground(level);
        this.loadAnimation(level);
        this.addShape(level, preLevel);
    },
    loadAnimation: function (level) {
        switch (level){
            case 0:
                var fire = new cc.Sprite(res.fire3);
                fire.setPosition(cc.p(510,135));
                var action = cc.blink(2, 6);
                fire.runAction(action.repeatForever());
                this.addChild(fire, -1, 10);
                break;
            default :
                this.removeChildByTag(10);
        }

    },

    loadBackground: function (level) {
        var backgroundImage = new cc.Sprite(res.map[level]);
        backgroundImage.setAnchorPoint(cc.p(0,0));
        //backgroundImage.setScale(cc.winSize.height/backgroundImage.height);
        backgroundImage.setScalesPageToFit = true;
        this.addChild(backgroundImage, -2);


    },
    addShape: function (level, preLevel) {
        if(level < MAPS.length){
            for(var i = 0; i < MAPS[level].length; i++){
                this.space.addShape(MAPS[level][i]);
            }
        }
        if(preLevel != null && preLevel >= 0 && preLevel <= MAPS.length){
            for(var i = 0; i < MAPS[preLevel].length; i++){
                this.space.removeShape(MAPS[preLevel][i]);
            }
        }
    },
    initPhysicsMaps: function () {
        var firstMap = [];

        firstMap.push(this.createShape(cc.winSize.width/2,43,cc.winSize.width,86, "bottomWall", UPPERS_FRICTION, UPPERS_ELASTICITY));
        firstMap.push(this.createShape(190, 259, 380, 510, "brick1", UPPERS_FRICTION, UPPERS_ELASTICITY));
        //singleMap.push(this.addSegmentShape(cc.p(0,515),cc.p(380, 515),0));
        firstMap.push(this.createShape(1245, 259, 380, 510, "brick2", UPPERS_FRICTION, UPPERS_ELASTICITY));
        //singleMap.push(this.addSegmentShape(cc.p(1060,515),cc.p(cc.winSize.width, 515),0));
        firstMap.push(this.createShape(720,881, 330, 144, "brick3", UPPERS_FRICTION, UPPERS_ELASTICITY));
        //singleMap.push()
        firstMap.push(this.addSegmentShape(cp.v(370,85), cp.v(370, 485), WALLS_WIDTH));
        firstMap.push(this.addSegmentShape(cp.v(1070,85), cp.v(1070, 485), WALLS_WIDTH));

        firstMap.push(this.addSegmentShape(cp.v(552,803), cp.v(552, 942), 2));
        firstMap.push(this.addSegmentShape(cp.v(885,803), cp.v(885, 942), 2));


        MAPS.push(firstMap);

        var secondMap = [];
        secondMap.push(this.createShape(1030, 150, 280, 82, "brick2-1", UPPERS_FRICTION, UPPERS_ELASTICITY));
        secondMap.push(this.createShape(876, 442, 210, 86, "brick2-2", UPPERS_FRICTION, UPPERS_ELASTICITY));
        secondMap.push(this.createShape(1335, 442, 210, 86, "brick2-3", UPPERS_FRICTION, UPPERS_ELASTICITY));
        secondMap.push(this.createShape(468, 678, 200, 184, "brick2-4", UPPERS_FRICTION, UPPERS_ELASTICITY));
        secondMap.push(this.createShape(116, 710, 232, 268, "brick2-5", UPPERS_FRICTION, UPPERS_ELASTICITY));

        secondMap.push(this.addSegmentShape(cp.v(888,106), cp.v(888, 180), 2));
        secondMap.push(this.addSegmentShape(cp.v(1173,106), cp.v(1173, 180), 2));

        secondMap.push(this.addSegmentShape(cp.v(1228,396), cp.v(1228, 472), 2));
        secondMap.push(this.addSegmentShape(cp.v(768,396), cp.v(768, 472), 2));
        secondMap.push(this.addSegmentShape(cp.v(982,396), cp.v(982, 472), 2));

        secondMap.push(this.addSegmentShape(cp.v(570,589), cp.v(570, 754), 2));
        secondMap.push(this.addSegmentShape(cp.v(362,589), cp.v(362, 754), 2));

        secondMap.push(this.addSegmentShape(cp.v(234,576), cp.v(234, 825), 2));
        MAPS.push(secondMap);
        MAPS.push([]);
    },
    addSegmentShape: function (bd, kt, size) {

        var wall = new cp.SegmentShape(this.space.staticBody, bd, kt, size);
        wall.setFriction(SIDES_FRICTION);
        wall.setElasticity(SIDES_ELASTICITY);

        return wall;
    },
    createShape: function (posX, posY, width, height, type, friction, elasticity) {

        var body = new cp.Body(Infinity, Infinity);
        body.setPos(cp.v(posX, posY));

        var shape = new cp.BoxShape(body, width, height);
        shape.setFriction(friction);
        shape.setElasticity(elasticity);
        shape.name = type;

        return shape;
    },
    setupDebugNode : function() {
        this._debugNode = new cc.PhysicsDebugNode(this.space);
        this.addChild( this._debugNode );
    },
    initWall: function(){
        var leftWall = new cp.SegmentShape(this.space.staticBody, cp.v(0, cc.winSize.height), cp.v(0,0), WALLS_WIDTH);
        leftWall.setFriction(SIDES_FRICTION);
        leftWall.setElasticity(SIDES_ELASTICITY);
        var rightWall = new cp.SegmentShape(this.space.staticBody, cp.v(cc.winSize.width,0), cp.v(cc.winSize.width, cc.winSize.height), WALLS_WIDTH);
        rightWall.setFriction(SIDES_FRICTION);
        rightWall.setElasticity(SIDES_ELASTICITY);

        this.space.addStaticShape(leftWall);
        this.space.addStaticShape(rightWall);
    }

});