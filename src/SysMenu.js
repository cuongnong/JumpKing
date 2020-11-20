var SysMenu = cc.Layer.extend({

    ctor: function () {
        this._super();
        this.init();
    },
    init: function () {
        //load game title
        var title = new cc.LabelTTF("_- JUMP KING -_", "res/fonts/arial.ttf", 30);
        title.setColor(cc.color(200,100,150));

        title.setPosition(cc.p(cc.winSize.width/2, cc.winSize.height - 100));
        //load menuItem new game
        var width = 123, height = 36;
        var newGameNormal = new cc.Sprite(res.menu, cc.rect(0,0, width, height));
        var newGameSelected = new cc.Sprite(res.menu, cc.rect(0,height, width, height));
        var newGameDisabled = new cc.Sprite(res.menu, cc.rect(0,height * 2, width, height));
        var newGame = new cc.MenuItemSprite(newGameNormal, newGameSelected, newGameDisabled, function () {
           cc.LoaderScene.preload(g_maingame,function (){
               var scene = new cc.Scene();
               var gameLayer = new GameLayer();
               scene.addChild(gameLayer);
               cc.director.runScene(new cc.TransitionFade(1, scene));
           }, this);
        });
        newGame.setPosition(cc.p(0,100))

        var menu = new cc.Menu(newGame);
        this.addChild(title);
        this.addChild(menu);
    }
});
SysMenu.getScene = function () {
    var scene = new cc.Scene();
    var layer = new SysMenu();
    scene.addChild(layer);
    return scene;
}
