// Index route start
// Commands import
$.getScript('js/commands.js');

// Check if the bank is in localStorage
if(localStorage.getItem('base') !== null && localStorage.getItem('base') !== "") {
    base = JSON.parse(localStorage.getItem('base'));
    baseActive = true;
} else {
    console.log('No database yet!');
    baseActive = false;
}

// Permission check to use device microphone with Speechrecognition
window.plugins.speechRecognition.hasPermission(
    // Successful permission
    function(permission){
        // Without permission
        if(!permission) {
            // Request permission
            window.plugins.speechRecognition.requestPermission(
                // Success
                function(havePermission) {
                    app.dialog.alert('Permission granted: ' + havePermission);
                },
                // Error
                function(error) {
                    app.dialog.alert('Request Permission Error: ' + error);
                })
        }
    },
    // Permission error
    function(error) {
        app.dialog.alert('hasPermission: error: ' + error);
    })

// Click the "talk" button
$("#btn-speak").on('click', function() {
    let options = {
        language: "pt-BR",
        showPopup: false,
        showPartial: true
    }

    // Assistant listening
    window.plugins.speechRecognition.startListening(
        // Success
        function(data) {
            $.each(data, function(index, text) {
                // Putting what she understands in the p (question) tag
                $('#question').html("").append(text);
                // Taking the value of what she understood
                var question = $('#question').html().toLowerCase();
                console.log('Ela entendeu: ' + question);

                // Check existence of bank
                if(baseActive) {
                    $.each(base, function(index, item) {
                        if(question == item.spoken_question) {
                            speak(item.written_response, item.spoken_response, false);
                        }
                    });
                }
               
                // Check if the command
                $.each(commands, function(index, item) {
                    if(question == item.prohibited) {
                        // If you have special command
                        if(item.special) {
                            // Run command
                            item.special();
                        } else {
                            // Otherwise speak normally
                            speak(item.written_return, item.spoken_return, item.route);
                        }
                    }
                });
            })
        },
        // Error
        function(error) {
            app.dialog.alert('There was an error: ' + error);
        },
    options)
});

function speak(written_response, spoken_response, route) {
    // Text to Speech
    TTS.speak({
        text: spoken_response,
        locale: 'pt-BR',
        rate: 1.5
    }, function () {
       console.log('The assistant spoke: ' + written_response);
       if(route) {
        app.views.main.router.navigate(route);
       }
    }, function (error) {
        app.dialog.alert('There was an error: ' + error);
    });

     // If she speaks, her answer will be written on the screen
     var typed = new Typed('#response', {
        strings: [written_response + '^5000', ''],
        showCursor: false,
        typeSpeed: 25,
        onComplete: function(self) {
            toastBottom = app.toast.create({
            text: 'Speech completed successfully!',
            closeTimeout: 2200,
            });
            toastBottom.open();
        }
    });
}