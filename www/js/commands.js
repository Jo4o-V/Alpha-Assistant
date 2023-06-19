// Assistant's native memory
commands = [
    {
        prohibited: 'acessar memórias',
        written_return: 'Acessando minhas memórias!',
        spoken_return: 'Acessando minhas memórias',
        route: '/memory/',
        special: false
    },
    {
        prohibited: 'qual é o seu nome',
        written_return: 'Meu nome é Alpha!',
        spoken_return: 'Meu nome é Alpha',
        route: false,
        special: false
    },
    {
        prohibited: 'enviar e-mail',
        written_return: 'Para quem gostaria de enviar?',
        spoken_return: 'Para quem gostaria de enviar?',
        route: false,
        special: function() {
            speak('Para quem gostaria de enviar?', 'Para quem gostaria de enviar?', false);
            app.dialog.alert('Disparou evento');
        }
    },
]