import {Vec2} from "@leela/common";

const posInterpolator = (pos1: Vec2, pos2: Vec2, progress: number, result?: Vec2) => {
    if (!result) {
        result = {x: 0, y: 0};
    }
    result.x = pos1.x + (pos2.x - pos1.x) * progress;
    result.y = pos1.y + (pos2.y - pos1.y) * progress;

    return result;
};

const posEquals = (pos1: Vec2, pos2: Vec2) => {
    return pos1?.x == pos2?.x && pos1?.y == pos2?.y;
}

const posDiff = (pos1: Vec2, pos2: Vec2, result?: Vec2) => {
    if (!result) {
        result = {x: 0, y: 0};
    }
    result.x = pos2.x - pos1.x;
    result.y = pos2.y - pos1.y;

    return result;
}

export {
    posInterpolator,
    posEquals,
    posDiff
};