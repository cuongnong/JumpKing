/**
 * Created by cuong on 11/22/2020.
 */
var GameKing = cc.Layer.extend({
    sprite: null,
    ctor: function () {
        this._super();
        this.sprite = new cc.Sprite();
        this.sprite.attr({
            x: cc.winSize.width/2,
            y: cc.winSize.height/2
        });
        this.addAnimation();
        this.addChild(this.sprite);
        return true;
    },
    addAnimation: function () {
        var animationFrames = [];
        var spriteFrame = new cc.SpriteFrame(res.king, cc.rect(0,0, 30, 30));
        var animationFrame = new cc.AnimationFrame();
        animationFrame.initWithSpriteFrame(spriteFrame, 1, null);
        animationFrames.push(animationFrame);
        spriteFrame = new cc.SpriteFrame(res.king2,  cc.rect(0,0, 30, 30));
        animationFrame = new cc.AnimationFrame();
        animationFrame.initWithSpriteFrame(spriteFrame, 1, null);
        animationFrames.push(animationFrame);
        spriteFrame = new cc.SpriteFrame(res.king3,  cc.rect(0,0, 30, 30));
        animationFrame = new cc.AnimationFrame();
        animationFrame.initWithSpriteFrame(spriteFrame, 1, null);
        animationFrames.push(animationFrame);
        spriteFrame = new cc.SpriteFrame(res.king4,  cc.rect(0,0, 30, 30));
        animationFrame = new cc.AnimationFrame();
        animationFrame.initWithSpriteFrame(spriteFrame, 1, null);
        animationFrames.push(animationFrame);

        var animation = new cc.Animation(animationFrames, 0.08);
        var action = new cc.Animate(animation);
        cc.log(spriteFrame.width);
        this.sprite.runAction(action.repeatForever());
    }
});
GameKing.getScene = function () {
    var scene = new cc.Scene();
    var layer = new GameKing();
    scene.addChild(layer);
    return scene;
}