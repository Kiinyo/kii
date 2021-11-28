Kii.Audio = function () {
    this.Playing = null;

    this.play = function (filename) {
        let audio = new Audio("audio/" + filename);
        audio.play();
        return audio;
    }
    this.stop = function (audio) {
        audio.pause();
        audio.remove();
    }
}