# Alpha-Assistant
Assistente Virtual para dispositivos móveis. Projeto para o processo seletivo da Makers Fellowship.


--- Aplicação para dispositivos Móveis - Android e IOS
--- Versão compilada para Android

- Tecnologias utilizadas -
- Visual: 
    - HTML, CSS, JavaScript
    - Framework7: style e rotemamento

- Lógica: 
    - JavaScript, jQuery
    - WebSQL (Banco que fica do lado do cliente - está salvo no dispositivo. Banco relacional)

- Plugins: 
    - Speech Recogntion: plugin do Apache Cordova p/ reconhecimento de voz
    - Text to Speech: plugin do Apache Cordova p/ tranformar texto em fala

- API:
    - chatGPT

- Compilação:
    - Apache Cordova: (pega a estrutura HTML, CSS e JS compila para Android e IOS gerando um apk e ipa que pode ser instalado no aparelho).
    - O aplicativo roda sem dependência de rede, bem como tem acesso nativo as APIs do dispositivo

- Links:
    - Framework7: https://framework7.io/
    - Apache Cordova: https://cordova.apache.org/
    - Java jdk: https://www.oracle.com/java/technologies/javase/jdk17-archive-downloads.html (Necessário para manipular os pacotes de sdk do Android)
    - Android Studio: https://developer.android.com/studio (Necessário para obter o sdk das versões do Sistema Operacional Android)