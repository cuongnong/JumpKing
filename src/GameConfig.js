/**
 * Created by cuong on 11/17/2020.
 */
var MW = MW || {};

MW.KEYS = [];
MW.STATE = {
    STAND: 1,
    MOVE: 2,
    SIT: 3,
    JUMP: 4,
    FALL: 5
};
MW.DIRECTION = {
    UP: 1,
    LEFT: 2,
    RIGHT: 3
};
MW.POS = {
    STAND: 1,
    DESCENDING: 2,
    ASCENDING: 3,
};

MW.JUMP_POWER = 1250;

MW.COUNTER = 6;
MW.POWER_MAX = 1;
MW.POWER_MIN = 0;
MW.POWER_INIT = 0.4;
