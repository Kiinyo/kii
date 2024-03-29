Kii.Engine.Audio = function () {
    this.Playing = null;
    // Loads an audio file to be used later
    // The filename uses the index.html
    // location as the root folder!
    // 
    // fn (filename: string) -> AudioFile
    this.load = function (filename) {
        let audio = new Audio(filename);
        return audio
    },
    // Plays the corresponding audio file with
    // the root directory being the one the index.html
    // file is in. Returns the audio object which can
    // later be manipulated.
    //
    // fn (audio: AudioFile)
    this.play = function (audio) {
        audio.play();
    }
    // Stops playing a particular audio object
    // that was generated by Audio.play
    // fn (audio: AudioFile)
    this.stop = function (audio) {
        audio.pause();
        audio.remove();
    }
}