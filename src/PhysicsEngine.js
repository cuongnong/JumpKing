/**
 * Created by cuong on 11/17/2020.
 */

var g_groundHeight = 57;
var g_runnerStartX = 80;

var WALLS_WIDTH = 5;
var WALLS_ELASTICITY = 0.1;
var WALLS_FRICTION = 1;
var PhysicsEngine = cc.Layer.extend({
    _king: null,
    ctor: function () {
        this._super();
        this.initPhysics();
        this.setupDebugNode();
        this.addWallsAndGround();
        this.addPhysicsCircle();
        this.addPhysicsBox();
        this.addCollisionCallBack();

        this.scheduleUpdate();

        return true;
    },
    initPhysics: function (){
        this.space = new cp.Space();
        this.space.gravity = cp.v(0, -500);
        //this.space.iterations = 3;
        //this.space.sleepTimeThreshold = Infinity;
        //this.space.collisionSlop = Infinity;
    },
    update:function (dt) {
        this.space.step(dt);
    },
    addPhysicsCircle: function() {
        var width=50,height=50,mass=10;

        this.phBodyCircle = this.space.addBody(new cp.Body(mass, cp.momentForCircle(mass,0,width*0.5,cc.p(0,0))));
        this.phBodyCircle.setPos(cc.p(cc.winSize.width * 0.5, cc.winSize.height * 0.3));

        //#4
        var phShape = this.space.addShape(new cp.CircleShape(this.phBodyCircle, width, cc.p(0, 0)));
        phShape.setFriction(1);
        phShape.setElasticity(1);
        phShape.setCollisionType(0);
    },
    addPhysicsBox: function() {

        var width=50,height=50,mass=100;
        this.phBodyBox = this.space.addBody(new cp.Body(mass, cp.momentForBox(mass, width,height)));
        this.phBodyBox.setPos(cc.p(cc.winSize.width * 0.6, cc.winSize.height * 0.2));

     //#4
        var phShape = this.space.addShape(new cp.BoxShape(this.phBodyBox, width, height));
        phShape.setFriction(0);
        phShape.setElasticity(1);
        phShape.setCollisionType(1);
    },
    // add static body
    addWallsAndGround: function() {
        var leftWall = new cp.SegmentShape(this.space.staticBody, new cp.v(0, 0), new cp.v(0, 1000000), WALLS_WIDTH);
        leftWall.setElasticity(WALLS_ELASTICITY);
        leftWall.setFriction(WALLS_FRICTION);
        this.space.addStaticShape(leftWall);

        var rightWall = new cp.SegmentShape(this.space.staticBody, new cp.v(cc.winSize.width, 1000000), new cp.v(cc.winSize.width, 0), WALLS_WIDTH);
        rightWall.setElasticity(WALLS_ELASTICITY);
        rightWall.setFriction(WALLS_FRICTION);
        this.space.addStaticShape(rightWall);

        var bottomWall = new cp.SegmentShape(this.space.staticBody, new cp.v(0, 0), new cp.v(cc.winSize.width, 0), WALLS_WIDTH);
        bottomWall.setElasticity(WALLS_ELASTICITY);
        bottomWall.setFriction(WALLS_FRICTION);
        this.space.addStaticShape(bottomWall);

        var upperWall = new cp.SegmentShape(this.space.staticBody, new cp.v(0, cc.winSize.height), new cp.v(cc.winSize.width, cc.winSize.height), WALLS_WIDTH);
        upperWall.setElasticity(WALLS_ELASTICITY);
        upperWall.setFriction(WALLS_FRICTION);
        this.space.addStaticShape(upperWall);
    },
    setupDebugNode : function() {
        this._debugNode = new cc.PhysicsDebugNode(this.space);
        this.addChild( this._debugNode );
    },
    addCollisionCallBack:function(){
        // 0 and 1 are tag for box and circle
        this.space.addCollisionHandler(0, 1, function(){
            cc.log('Box and Circle colliding !');
            return true;
        }, null, null, null);
    }

});

PhysicsEngine.getScene = function () {
    var scene = new cc.Scene();
    var layer = new PhysicsEngine();
    scene.addChild(layer);
    return scene;
}