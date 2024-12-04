import SpellGame from "./SpellGame";
const { ccclass, property } = cc._decorator;

@ccclass
export default class PlayerControl extends cc.CircleCollider {

    @property(SpellGame)
    game: SpellGame = null;
    @property
    speed: number = 1000; // Speed of the node movement

   
    minX: number = -500; // Minimum X boundary
    
    maxX: number = 500; // Maximum X boundary

    private _leftPressed: boolean = false;
    private _rightPressed: boolean = false;
    private _upPressed: boolean = false;
    private _downPressed: boolean = false;
   
    minY: number = -900;
   
    maxY: number = 900;

    onLoad() {
       this.enablePlayer();
    }

    onCollisionEnter(other: cc.Collider, self: cc.Collider): void {
        console.log('on collision enter');  
        if(this.game.checkLetter(other.node))
        {
            this.node.color = cc.Color.GREEN;
        }
        else
        {
            this.node.color = cc.Color.RED;
        }
        this.scheduleOnce(()=>{
            this.node.color = cc.Color.WHITE;
        }, 0.5);

    }
    enablePlayer()
    {
        this.node.setPosition(0, 0);
        const parent = this.node.parent;
        if (parent) {
            const parentWidth = parent.width;
            const parentHeight = parent.height;

            this.minX = -parentWidth / 2;
            this.maxX = parentWidth / 2;
            this.minY = -parentHeight / 2;
            this.maxY = parentHeight / 2;
        }
        // Register mouse event listeners
        this.node.on(cc.Node.EventType.MOUSE_MOVE, this.onMouseMove, this);
         // Register keyboard event listeners
         cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
         cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
 
     // Register touch event listeners
     this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
     this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
     }

    onMouseMove(event: cc.Event.EventMouse) {
        const mouseLocation = event.getLocation();
        const nodeLocation = this.node.convertToNodeSpaceAR(mouseLocation);
        if (nodeLocation.x < 0) {
            this._leftPressed = true;
            this._rightPressed = false;
        } else {
            this._rightPressed = true;
            this._leftPressed = false;
        }
        if (nodeLocation.y > 0) {
            this._upPressed = true;
            this._downPressed = false;
        } else {
            this._downPressed = true;
            this._upPressed = false;
        }
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
            pos.y += this.speed * dt;
        }

        if (this._downPressed) {
            pos.y -= this.speed * dt;
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
