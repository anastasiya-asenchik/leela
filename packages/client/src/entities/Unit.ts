import Sprite = Phaser.GameObjects.Sprite;
import {Scene} from "phaser";
import {Role, UNIT_BODY_HEIGHT, UNIT_BODY_WIDTH, Vec2} from "@leela/common";
import PhysBody from "../physics/PhysBody";
import WorldScene from "../world/WorldScene";


type SnapshotState = {
    x: number,
    y: number,
    vx: number,
    vy: number
}

type Snapshot = {
    state: SnapshotState,
    timestamp: number
}

export default class Unit extends Sprite {

    public guid: number;
    public typeId: number;
    public roles: number[];
    private _skin: number;
    public readonly snapshots: Snapshot[];
    public readonly physBody: PhysBody;

    constructor(scene: Scene, skin = 0, x?: number, y?: number) {
        super(scene, x, y, `unit:${skin}`);

        this._skin = skin;

        this.physBody = new PhysBody(this);
        this.physBody.width = UNIT_BODY_WIDTH;
        this.physBody.height = UNIT_BODY_HEIGHT;

        this.setDir(0, 0);

        this.skin = skin;

        this.snapshots = [];
    }

    public set skin(value: number) {
        this._skin = value;
        this.setTexture(`unit:${this._skin}`);
        this.updateDir();
    }

    public setDir(vx: number, vy: number) {
        this.physBody.vx = vx;
        this.physBody.vy = vy;

        this.updateDir();
    }

    private updateDir() {
        if (this.physBody.vx == 0 && this.physBody.vy == 0) {
            this.stay();
        } else {
            this.walk();
        }
    }

    private stay() {
        this.anims.pause();
        this.setFrame(1);
    }

    private walk() {
        const dir = getDirection(this.physBody.vx, this.physBody.vy);

        const anim = `unit:${this._skin}:walk:${dir}`;
        if (this.anims.currentAnim?.key == anim) {
            this.anims.resume(this.anims.currentFrame);
        } else {
            this.play(anim);
        }
    }
}

enum Direction {
    LEFT = "left",
    RIGHT = "right",
    DOWN = "down",
    UP = "up"
}

function getDirection(vx: number, vy: number): Direction {
    let dir;

    if (Math.abs(vy)/Math.abs(vx) >= 0.9) {
        if (vy > 0) {
            dir = Direction.DOWN;
        }
        if (vy < 0) {
            dir = Direction.UP;
        }
    } else {
        if (vx > 0) {
            dir = Direction.RIGHT;
        }
        if (vx < 0) {
            dir = Direction.LEFT;
        }
    }

    return dir;
}

function addUnitToWorld(unit: Unit) {
    const worldScene = unit.scene as WorldScene;

    worldScene.add.existing(unit);

    const guid = unit.guid;

    worldScene.units[guid] = unit;
}

function deleteUnitFromWorld(unit: Unit) {
    const worldScene = unit.scene as WorldScene;

    unit.destroy();

    const guid = unit.guid;

    delete worldScene.units[guid];
}

function isPlayer(unit: Unit) {
    const worldSession = (unit.scene as WorldScene).worldSession;

    return worldSession.playerGuid == unit.guid;
}

function hasRole(unit: Unit, role: Role) {
    return unit.roles && unit.roles.findIndex(r => r == role) != -1;
}

export {
    Snapshot,
    SnapshotState,
    addUnitToWorld,
    deleteUnitFromWorld,
    isPlayer,
    hasRole
}
