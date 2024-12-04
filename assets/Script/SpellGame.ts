import PlayerControl from "./PlayerControl";
import TextToSpeech from "./TextToSpeech";

const { ccclass, property } = cc._decorator;

@ccclass('SpellGame')
export default class SpellGame extends cc.Component {
    @property(PlayerControl)
    player: PlayerControl = null;

    @property(cc.Button)
    startButton: cc.Button = null;

    @property(TextToSpeech)
    textToSpeech: TextToSpeech = null;

    @property(cc.Label)
    score : cc.Label = null;

    @property(cc.Node)
    spellBox: cc.Node = null;

    @property([cc.Node])
    lifeHearts: cc.Node[] = new Array(3);

    @property
    speed: number = 10;

    private lifeCounter: number = 3;
    private _currentWord: string | string[];
    public get currentWord(): string | string[] {
        return this._currentWord;
    }
    public set currentWord(string){
        this._currentWord = string;
    }
    gameinProgress: boolean = false;

    start() {
       // this.textToSpeech.speakString("Welcome to the game! Press the start button to begin the game. Listen carefully and Try to catch the correct spelling for the word in the correct order by moving the Bee. Wrong catches will reduce your life. You have three lives. Good Luck!");
        
       this.textToSpeech.speakString("Welcome. Press Start to begin the game");
       this.scheduleOnce(()=>{
            this.startButton.node.on(cc.Node.EventType.TOUCH_END, this.startGame, this);
        }, 5);
        this.score.string = "0";
    }

    startGame() {

        if(!this.gameinProgress){
        this.lifeCounter = 3;
        this.startButton.node.active = false;
        this.player.enablePlayer();
        this.textToSpeech.generateRandomWord();
        this.currentWord = this.textToSpeech.getStringToSpeak();
        this.schedule(this.generateLetters, 1);
        this.gameinProgress = true;
        }
    }

    getRandomPosition(): cc.Vec2 {
        const x = Math.random() * this.spellBox.width - this.spellBox.width / 2;
        const y = Math.random() * this.spellBox.height - this.spellBox.height / 2;
        return cc.v2(x, y);
    }

 
    generateLetters() {
        const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const randomLetter = alphabet[Math.floor(Math.random() * alphabet.length)];
    // Create a new letter node
    const letterNode = new cc.Node();
    const letterLabel = letterNode.addComponent(cc.Label);
    letterLabel.string = randomLetter;

    // Set the position of the letter node
    letterNode.setPosition(this.getRandomPosition());
  
    // Add the letter node to the scene
    this.node.addChild(letterNode);

    // Add collision detection
    letterNode.addComponent(cc.BoxCollider);
    this.scheduleOnce(() => {
        letterNode.destroy();
    },this.speed);
    letterNode.on(cc.Node.EventType.TOUCH_END, (evt) => {
       this.checkLetter(letterNode, randomLetter);
    });
    }

    public checkLetter(letterNode: cc.Node, randomLetter: string = letterNode.getComponent(cc.Label).string) {

       
            if (this.currentWord.length > 0 && randomLetter === this.currentWord[0].toUpperCase()) {
            // Correct letter
            this.currentWord = this.currentWord.slice(1);
            
            } else {
            // Incorrect letter
            this.loseLife();
            }
            if(this.currentWord.length == 0)
            {
                this.unschedule(this.generateLetters);
                this.score.string = ""+ parseInt(this.score.string) + 1;
                this.textToSpeech.speakString("Good Job!");
                this.scheduleOnce(()=>{
                    this.gameinProgress = false;
                    this.startGame();      
                },2);
                
            }
            // Remove the letter node after it is hit
            letterNode.destroy();
    }
    update() {
  
        if (this.lifeCounter <= 0) {
            this.stopGame();
            this.unschedule(this.generateLetters);
            this.score.string = "Game Over! Your Score is: " + this.score.string;
        }
    }

    loseLife() {
        this.lifeCounter--;
        this.lifeHearts[this.lifeCounter].active = false;
        if (this.lifeCounter <= 0) {
            this.stopGame();
        }
    }

    stopGame() {
        this.gameinProgress = false;
        this.player.disablePlayer();
        this.startButton.node.active = true;
    }
}