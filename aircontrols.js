
var screen_width = $(window).width();
var screen_third = parseInt(screen_width / 3);


const video = document.getElementById("myvideo");
const canvas_webcam = document.getElementById("canvas_webcam");
const context = canvas_webcam.getContext("2d");
let trackButton = document.getElementById("trackbutton");
let updateNote = document.getElementById("updatenote");

let isVideo = false;
let model = null;

const modelParams = {
    flipHorizontal: true,   // flip e.g for video
    imageScaleFactor: 0.2,// 0.2,// 0.7,  // reduce input image size for gains in speed.
    maxNumBoxes: 1,        // maximum number of boxes to detect
    iouThreshold: 0.79,      // ioU threshold for non-max suppression
    scoreThreshold: 0.79,// 0.79,    // confidence threshold for predictions.
}

function startVideo() {
    handTrack.startVideo(video).then(function (status) {
        console.log("video started", status);
        if (status) {
            updateNote.innerText = "Video started. Now tracking"
            isVideo = true
            runDetection();

        } else {
            updateNote.innerText = "Please enable video"
        }
    });
}

function toggleVideo() {
    if (!isVideo) {
        updateNote.innerText = "Starting video";
        startVideo();
        $('#trackbutton').html('Stop');
        $('#intro').hide();
        $('#ui').show();
        $('#canvas_game').show();

        if (screen_width < 480) {
            $('#keys_pressed').hide();
            $('#canvas_webcam').hide();
        }



        var fileref = document.createElement('script');
        fileref.setAttribute("type", "text/javascript");
        fileref.setAttribute("src", "Full%20Screen%20Mario_files/index.js?v=2");
        document.getElementsByTagName("head")[0].appendChild(fileref);


    } else {
        updateNote.innerText = "Stopping video";
        handTrack.stopVideo(video);
        isVideo = false;
        updateNote.innerText = "Video stopped";
        $('#trackbutton').html('Start');
    }
}



var searching = false;
var option_found = false;
var options = ['left', 'right'];
var current_x = 0;
var current_y = 0;
var i = 0;
var option_timeout = false;
var videoInterval = 90;


function runDetection() {
    model.detect(video).then(predictions => {



        model.renderPredictions(predictions, canvas_webcam, context, video);
        if (isVideo && player) {


            setTimeout(() => {
                runDetection(video)
            }, videoInterval);




            if (predictions && predictions[0]) {


                current_x = ((predictions[0].bbox[0] * ($(window).width() - predictions[0].bbox[2])) / $('#canvas_webcam').width());
                current_y = ((predictions[0].bbox[1] * $(window).height() - predictions[0].bbox[3]) / $('#canvas_webcam').height());




                $('#cursor').css('left', current_x + 'px').css('top', current_y + 'px').show();





                if (searching == false) {
                    searching = true;




                    if (current_x > 0 && current_x < screen_third) {
                        current_option = 'left';
                        option_found = true;
                    } else if (current_x > (screen_third * 2) && current_x < screen_width) {
                        current_option = 'right';
                        option_found = true;
                    } else {
                        current_option = '';
                    }


                    var keys_pressed = '';


                    if (option_found) {



                        if (current_option == 'left') {
                            keys_pressed = 'left';

                            player.keys.run = -1;
                            FullScreenMario.prototype.keyDownLeft(player, false);

                        } else if (current_option == 'right') {
                            keys_pressed = 'right';

                            player.keys.run = 1;
                            FullScreenMario.prototype.keyDownRight(player, false);

                        }



                        //jump
                        if (predictions[0].bbox[3] > 140) {
                            if (keys_pressed) {
                                keys_pressed += ' + ';
                            }
                            keys_pressed += 'jump';

                            player.keys.jump = 1;
                            FullScreenMario.prototype.keyDownUp(player, false);

                        }


                    }

                    $('#keys_pressed').html(keys_pressed);


                    searching = false;
                    option_found = false;
                }







            } else {


                $('#cursor').hide();
                keys_pressed = '';


                player.keys.run = 0;
                player.keys.jump = 0;
                FullScreenMario.prototype.keyUpLeft(player, false);
                FullScreenMario.prototype.keyUpRight(player, false);
                FullScreenMario.prototype.keyUpUp(player, false);
            }






        }
    });
}

handTrack.load(modelParams).then(lmodel => {
    model = lmodel
    updateNote.innerText = "Loaded Model!";
    trackButton.disabled = false;

    $('#gif').html('<img src="mario.gif">');

    setTimeout(function () {
        $('#trackbutton').html('Start Webcam').css('background', 'green');
    }, 1000);


});