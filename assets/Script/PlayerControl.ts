const { ccclass, property } = cc._decorator;

@ccclass
export default class PlayerControl extends cc.Component {
    @property
    speed: number = 200; // Speed of the node movement

    @property
    minX: number = -500; // Minimum X boundary
    @property
    maxX: number = 500; // Maximum X boundary

    private _leftPressed: boolean = false;
    private _rightPressed: boolean = false;
    private _upPressed: boolean = false;
    private _downPressed: boolean = false;
    @property
    minY: number = -900;
    @property
    maxY: number = 900;

    onLoad() {
       this.enablePlayer();
    }

    enablePlayer()
    {
        this.node.setPosition(0, 0);
         // Register keyboard event listeners
         cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
         cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
 
     // Register touch event listeners
     this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
     this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
     }
    onDestroy() {
       this.disablePlayer();
    }

    disablePlayer()
    {
         // Unregister keyboard event listeners
         cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
         cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
 
         // Unregister touch event listeners
         this.node.off(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
         this.node.off(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    onKeyDown(event: cc.Event.EventKeyboard) {
        switch (event.keyCode) {
            case cc.macro.KEY.left:
                this._leftPressed = true;
                break;
            case cc.macro.KEY.right:
                this._rightPressed = true;
                break;
            case cc.macro.KEY.up:
                this._upPressed = true;
                break;
            case cc.macro.KEY.down:
                this._downPressed = true;
                break;
        }
    }

    onKeyUp(event: cc.Event.EventKeyboard) {
        switch (event.keyCode) {
            case cc.macro.KEY.left:
                this._leftPressed = false;
                break;
            case cc.macro.KEY.right:
                this._rightPressed = false;
                break;
            case cc.macro.KEY.up:
                this._upPressed = false;
                break;
            case cc.macro.KEY.down:
                this._downPressed = false;
                break;
        }
    }

    onTouchStart(event: cc.Event.EventTouch) {
        const touchLocation = event.getLocation();
        const nodeLocation = this.node.convertToNodeSpaceAR(touchLocation);
        if (nodeLocation.x < 0) {
            this._leftPressed = true;
        } else {
            this._rightPressed = true;
        }
        if (nodeLocation.y > 0) {
            this._upPressed = true;
        } else {
            this._downPressed = true;
        }
    }

    onTouchEnd(event: cc.Event.EventTouch) {
        this._leftPressed = false;
        this._rightPressed = false;
        this._upPressed = false;
        this._downPressed = false;
    }

    update(dt: number) {
        let pos = this.node.position;

        if (this._leftPressed) {
            pos.x -= this.speed * dt;
        }

        if (this._rightPressed) {
            pos.x += this.speed * dt;
        }

        
        if (this._upPressed) {
            pos.y -= this.speed * dt;
        }

        if (this._downPressed) {
            pos.y += this.speed * dt;
        }

  

        // Limit the position within the boundaries
        if (pos.x < this.minX) {
            pos.x = this.minX;
        }

        if (pos.x > this.maxX) {
            pos.x = this.maxX;
        }

         // Limit the position within the boundaries
         if (pos.y < this.minY) {
            pos.y = this.minY;
        }

        if (pos.y > this.maxY) {
            pos.y = this.maxY;
        }

        this.node.setPosition(pos);
    }
}
