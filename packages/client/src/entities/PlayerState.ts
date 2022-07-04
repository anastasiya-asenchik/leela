import {Body, Vec2} from "@leela/common";
import Inventory from "./Inventory";
import WorldScene from "../world/WorldScene";

type Control = {dir: Vec2, tick: number};

const PLAYER_STATE = "player_state";

export default class PlayerState {
    public appliedControls: Control[];

    public lerpStartTime: number;
    public lerpDuration: number;

    public initialPos: Vec2;
    public predictedBody: Body;
    public targetPos: Vec2;
    public reconciledBody: Body;

    public ackTick: number;

    public errorTimer: number;

    public lastMoveInput: number;

    public speed: number;
    public run: boolean;

    public readonly inventory: Inventory;

    constructor(worldScene: WorldScene) {
        this.appliedControls = [];

        this.lerpStartTime = -1;
        this.lerpDuration = -1;

        this.initialPos = {x: 0, y: 0};
        this.predictedBody = new Body();
        this.targetPos = {x: 0, y: 0};
        this.reconciledBody = new Body();

        this.ackTick = null;

        this.errorTimer = -1;

        this.lastMoveInput = null;

        this.speed = 0;
        this.run = true;

        this.inventory = new Inventory(worldScene);
    }

    public destroy() {
        this.inventory.destroy();
    }
}

export {
    Control,
    PLAYER_STATE
}