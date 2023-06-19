// Control of variables
var recognition = window.plugins.speechRecognition;
var silenceTimeout = 2000;
var silenceTimer;
var userVoice = '';

// Options the speech recognition
var options = {
    language: "pt-BR",
    showPopup: false,
    showPartial: true
}

// Function to listen
var startListening = function() {
    // hide talk button
    $('#btn-speak-chatgpt').addClass('display-none');
    // unhide speaking button
    $('#microphoneListeningGPT').removeClass('display-none');

    recognition.startListening(
        function(data) {
            // Data return
            console.log(data);
            console.log('UserVoice: ' + data[0]);
            // Put in the variable the most correct sentence understood by the assistant
            userVoice = data[0];
            // Clear the time between spoken phrases
            clearTimeout(silenceTimer);
            silenceTimer = setTimeout(() => {
                stopListening();
            }, silenceTimeout);
        },
        function(err) {
            app.dialog.alert('There was an error' + err);
        },
        options
    );
    // Clear the time between spoken phrases
    silenceTimer = setTimeout(() => {
        stopListening();
    }, silenceTimeout);
}

// funcção para parar de ouvir
var stopListening = function() {
    // Function call "stop listening"
    recognition.stopListening();

    // Clear the time between spoken phrases
    clearTimeout(silenceTimer);

    // Emit an end-of-speech event
    var event = new Event('speechend');
    document.dispatchEvent(event);
}

// "finished talking" event
document.addEventListener('speechend', function() {
    console.log('User finished talking!');
    // Hide microphone listening
    $('#microphoneListeningGPT').addClass('display-none');
    // Calls the chatGPT API
    callAPI(userVoice);
});

// Function to call the chatGPT API
function callAPI(question) {
    //Unhide her thinking icon
    $("#thinkingGPT").removeClass('display-none');

    // Create connection with chatGPT
    var apiKey = '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';
    var apiURL = 'https://api.openai.com/v1/chat/completions';

    $.ajax({
        url: apiURL,
        type: 'POST',
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + apiKey
        },
        data: JSON.stringify({
            "model": "gpt-3.5-turbo",
            "messages": [{ "role": "user", "content": question }],
            "temperature": 0.2
        }),
        // Successful connection to chat
        success: function (response) {
            // Answer in console
            console.log(response);

            var respWriting = response.choices[0].message.content;
            var respSpoken = response.choices[0].message.content;

            // Trigger function for assistant to speak
            speak(respWriting, respSpoken, false);

            // Unhide and hide buttons
            $("#thinkingGPT").addClass('display-none');
            $("#btn-speak-chatgpt").removeClass('display-none');
        },
        // Error connecting to chat
        error: function (xhr, textStatus, errorThrown) {
            console.log('Erro na chamada a API');

            // Unhide and hide buttons
            $("#thinkingGPT").addClass('display-none');
            $("#btn-speak-chatgpt").removeClass('display-none');
        }
    })
}

// Clicked the button to talk to chatgpt
$('#btn-speak-chatgpt').on('click', function() {
    // Function to start listening
    startListening();
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
        typeSpeed: 25,
        showCursor: false,
        onComplete: function(self) {
            toastBottom = app.toast.create({
            text: 'Speech completed successfully!',
            closeTimeout: 2000,
            });
            toastBottom.open();
        }
    });
}