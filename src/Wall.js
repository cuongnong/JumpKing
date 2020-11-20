/**
 * Created by cuong on 11/19/2020.
 */
var UPPERS_FRICTION = 10000000000;
var UPPERS_ELASTICITY = 0;
var SIDES_FRICTION = 0.1;
var SIDES_ELASTICITY = 0.3;
var WALLS_WIDTH = 1;
var STEPS_WIDTH = 15;
var Wall = cc.Layer.extend({
    space: null,
    ctor: function (_space) {
        this._super();
        this.space = _space;
        this.loadBackground();
        //this.setupDebugNode();
    },
    loadBackground: function () {
        var backgroundImage = new cc.Sprite(res.map);
        backgroundImage.setAnchorPoint(cc.p(0,0));
        backgroundImage.setScale(cc.winSize.width/backgroundImage.width);
        this.addChild(backgroundImage, -11);


        var leftWall = new cp.SegmentShape(this.space.staticBody, new cp.v(-19,0), new cp.v(0, cc.winSize.height), WALLS_WIDTH);
        leftWall.setFriction(SIDES_FRICTION);
        leftWall.setElasticity(SIDES_ELASTICITY);
        var rightWall = new cp.SegmentShape(this.space.staticBody, new cp.v(cc.winSize.width, 0), new cp.v(cc.winSize.width, cc.winSize.height), WALLS_WIDTH);
        rightWall.setFriction(SIDES_FRICTION);
        rightWall.setElasticity(SIDES_ELASTICITY);
        var bottomWall = new cp.SegmentShape(this.space.staticBody, new cp.v(0, 0), new cp.v(cc.winSize.width, 0), 5);
        bottomWall.setFriction(UPPERS_FRICTION);
        bottomWall.setElasticity(UPPERS_ELASTICITY);
        this.space.addStaticShape(leftWall);
        this.space.addStaticShape(rightWall);

        this.space.addStaticShape(bottomWall);
        this.setupSteps();
    },

    setupSteps: function () {
        var step1 = new cp.SegmentShape(this.space.staticBody, new cp.v(0, 135), new cp.v(127, 132), STEPS_WIDTH);
        step1.setFriction(UPPERS_FRICTION);
        step1.setElasticity(UPPERS_ELASTICITY);
        var step2 = new cp.SegmentShape(this.space.staticBody, new cp.v(118, 120), new cp.v(118, 0), STEPS_WIDTH);
        step2.setFriction(SIDES_FRICTION);
        step2.setElasticity(SIDES_ELASTICITY);
        this.space.addStaticShape(step1);
        this.space.addStaticShape(step2);


        step1 = new cp.SegmentShape(this.space.staticBody, new cp.v(363, 0), new cp.v(363, 128), STEPS_WIDTH);
        step1.setFriction(SIDES_FRICTION);
        step1.setElasticity(SIDES_ELASTICITY);
        step2 = new cp.SegmentShape(this.space.staticBody, new cp.v(352, 130), new cp.v(cc.winSize.width, 133), STEPS_WIDTH);
        step2.setFriction(UPPERS_FRICTION);
        step2.setElasticity(UPPERS_ELASTICITY);
        this.space.addStaticShape(step1);
        this.space.addStaticShape(step2);

        step1 = new cp.SegmentShape(this.space.staticBody, new cp.v(198, 250), new cp.v(195, 275), STEPS_WIDTH);
        step1.setFriction(SIDES_FRICTION);
        step1.setElasticity(SIDES_ELASTICITY);
        step2 = new cp.SegmentShape(this.space.staticBody, new cp.v(192, 280), new cp.v(290,279), STEPS_WIDTH);
        step2.setFriction(UPPERS_FRICTION);
        step2.setElasticity(UPPERS_ELASTICITY);
        this.space.addStaticShape(step1);
        this.space.addStaticShape(step2);

        step1 = new cp.SegmentShape(this.space.staticBody, new cp.v(283,277), new cp.v(280, 233), STEPS_WIDTH);
        step1.setFriction(SIDES_FRICTION);
        step1.setElasticity(SIDES_ELASTICITY);
        step2 = new cp.SegmentShape(this.space.staticBody, new cp.v(280, 233), new cp.v(200,250), STEPS_WIDTH);
        step2.setFriction(SIDES_FRICTION);
        step2.setElasticity(SIDES_ELASTICITY);
        this.space.addStaticShape(step1);
        this.space.addStaticShape(step2);


        step1 = new cp.SegmentShape(this.space.staticBody, new cp.v(92,382), new cp.v(181, 382), STEPS_WIDTH);
        step1.setFriction(UPPERS_FRICTION);
        step1.setElasticity(SIDES_ELASTICITY);
        this.space.addStaticShape(step1);

        step1 = new cp.SegmentShape(this.space.staticBody, new cp.v(0,475), new cp.v(65, 472), STEPS_WIDTH);
        step1.setFriction(UPPERS_FRICTION);
        step1.setElasticity(SIDES_ELASTICITY);
        this.space.addStaticShape(step1);

        step1 = new cp.SegmentShape(this.space.staticBody, new cp.v(159,472), new cp.v(200, 471), STEPS_WIDTH);
        step1.setFriction(UPPERS_FRICTION);
        step1.setElasticity(SIDES_ELASTICITY);
        this.space.addStaticShape(step1);

        step1 = new cp.SegmentShape(this.space.staticBody, new cp.v(213,487), new cp.v(245, 487), STEPS_WIDTH);
        step1.setFriction(UPPERS_FRICTION);
        step1.setElasticity(SIDES_ELASTICITY);
        this.space.addStaticShape(step1);

        step1 = new cp.SegmentShape(this.space.staticBody, new cp.v(294,577), new cp.v(338, 577), STEPS_WIDTH);
        step1.setFriction(UPPERS_FRICTION);
        step1.setElasticity(SIDES_ELASTICITY);
        this.space.addStaticShape(step1);

        step1 = new cp.SegmentShape(this.space.staticBody, new cp.v(438,602), new cp.v(500, 604), STEPS_WIDTH);
        step1.setFriction(UPPERS_FRICTION);
        step1.setElasticity(SIDES_ELASTICITY);
        this.space.addStaticShape(step1);

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