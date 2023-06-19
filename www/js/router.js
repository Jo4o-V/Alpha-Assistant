document.addEventListener('deviceready', onDeviceReady, false);

var app = new Framework7({
    // App root element
    el: '#app',
    // App Name
    name: 'Alpha Assistant',
    // App Id
    id: 'br.com.alpha.assistant',
    // Enable swipe panel
    panel: {
      swipe: true,
    },
    // Long tap
    touch: {
      tapHold: true,
    },
    // Add default routes
    routes: [
      {
        path: '/index/',
        url: 'index.html',
        on: {
          pageInit: function(e, page) {
            $.getScript('js/index.js');
            $.getScript('js/chatgpt.js');
          },
        }
      },
      {
        path: '/memory/',
        url: 'memory.html',
        on: {
          pageInit: function(e, page) {
            $.getScript('js/memory.js');
          }
        }
      },
    ],
  });
  
  function onDeviceReady() {
    var mainView = app.views.create('.view-main', {url:'/index/'});
  }
