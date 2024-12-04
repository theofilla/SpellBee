//import randomWord from 'random-word';
const { ccclass, property } = cc._decorator;
@ccclass
export default class TextToSpeech extends cc.Component {
    @property protected stringToSpeak: string| string[] = "Hello, World!"; // The string to speak
    @property protected rate: number = 1; // The speed of speech
    @property protected pitch: number = 1; // The pitch of speech
    @property protected lang: string = 'en-IN'; // The language of speech
   
   
    public getStringToSpeak() {
        return this.stringToSpeak;
    }

    speakSyn = (text, { lang = 'en-US', pitch = 1, rate = 1 } = {}) => {
        let speechSynthesis = window.speechSynthesis
        let voices = speechSynthesis.getVoices();
        let voice = voices.find(i => i.lang === lang)
        let utterThis = new SpeechSynthesisUtterance(text)

        if (!voice)  {
            console.warn('Voice not found')
            voice = voices[0];
        }

        utterThis = Object.assign(utterThis, {
            voice,
            pitch,
            rate
        })

        speechSynthesis.speak(utterThis)
    }
    
    public speak() {

        this.speakSyn(this.stringToSpeak, { lang: this.lang, pitch: this.pitch, rate: this.rate } );
       }

    public generateRandomWord() {
        this.stringToSpeak = "hot";
        console.log(this.stringToSpeak);
        this.speak();   

    }
    public speakString(string: string) {
        this.stringToSpeak = string;
        this.speak();
    }

}
