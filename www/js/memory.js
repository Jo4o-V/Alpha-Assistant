// Searchbar initialization
var searchbar = app.searchbar.create({
    el: '.searchbar',
    searchContainer: '.list',
    searchIn: '.item-title',
    on: {
      search(sb, query, previousQuery) {
        console.log(query, previousQuery);
      }
    }
})

// Local database - WebSQL
// Create the bank if it doesn't exist or open the bank if it exists
var db = window.openDatabase("BankOfMemories", "1.0", "BankOfMemories", 25000000);

// Request to create a table in the database
db.transaction(createTable, 
  // Error Callback
  function(err) {
    app.dialog.alert('Error creating table: ' + err);
  },
  // Success Callback
  function() {
    console.log('Success creating table creation transaction.');
  });

// Function responsible for creating table in the database
// tx - trasection execute
function createTable(tx) {
  tx.executeSql("CREATE TABLE IF NOT EXISTS memories (id INTEGER primary key, written_question varchar(255), spoken_question varchar(255), written_response varchar(255), spoken_response varchar(255))");
}

// List database items
function listMemories() {
  db.transaction(selectAll,
    function(err) {
      app.dialog.alert('Error when performing the select all transaction: ' + err);
    },
    function() {
      console.log('Success when carrying out the transaction select all!');
    });
}

// Function Sellect All
function selectAll(tx) {
  tx.executeSql('SELECT * FROM memories ORDER BY id', [], 
  function(tx, data) {
    //console.log(data);
    var rows = data.rows.length;

    // If the number of rows is greater than 0
    if(rows == 0) {
      $("#withMemories").addClass('display-none');
      $("#noMemories").removeClass('display-none');
    } else {

      $("#withMemories").removeClass('display-none');
      $("#noMemories").addClass('display-none');
      
      // Informing the number of lines in the tag
      $("#amountLearned").html(rows);
      $('#listOfQuestions').empty();

      var base = [];

      // Scroll through all bank lines
      for(i = 0; i < rows; i++) {
        // Add the data into the array
        base.push({
          written_question: data.rows.item(i).written_question,
          spoken_question: data.rows.item(i).spoken_question,
          written_response: data.rows.item(i).written_response,
          spoken_response: data.rows.item(i).spoken_response,
        })  
        // Save Base in LocalStorage
        localStorage.setItem('base', JSON.stringify(base));

        // Visual memory items that are built dynamically based on memory items saved in the database
        $('#listOfQuestions').append(`
        <li class="margin-bottom">
          <div><i data-id="${data.rows.item(i).id}" data-writtenQuestion="${data.rows.item(i).written_question}" data-spokenQuestion="${data.rows.item(i).spoken_question}" data-writtenResponse="${data.rows.item(i).written_response}" data-spokenResponse="${data.rows.item(i).spoken_response}" class="menu mdi mdi-menu txt-primary"></i></div>
          <a href="#" data-id="${data.rows.item(i).id}" data-writtenQuestion="${data.rows.item(i).written_question}" data-spokenQuestion="${data.rows.item(i).spoken_question}" data-writtenResponse="${data.rows.item(i).written_response}" data-spokenResponse="${data.rows.item(i).spoken_response}" data-popup=".response-popup" class="border-bottom item-link item-content popup-open">
            <div class="item-inner">
              <div class="item-title-row">
                <div class="item-title fw-bold txt-primary"><i class="mdi mdi-pencil margin-right"></i>${data.rows.item(i).written_question}</div>
                <div class="item-after">
                  <span class="badge padding-left padding-right color-blue">Id: 0${data.rows.item(i).id}</span>
                </div>
              </div>
              <div class="item-subtitle txt-primary"><i class="mdi mdi-microphone margin-right"></i>${data.rows.item(i).spoken_question}</div>
            </div>
          </a>
        </li>`)
      }

      // Clicked on a list item
      $(".item-link").on("click", function() {
        // Clear fields
        $("#inputSpoken").val("");
        $("#inputWritten").val("");
        // Recover information
        var itemId = $(this).attr('data-id');
        localStorage.setItem('itemId', itemId);
        var itemWrittenQuestion = $(this).attr('data-writtenQuestion');
        var itemSpokenQuestion = $(this).attr('data-spokenQuestion');
        var itemWrittenResponse = $(this).attr('data-writtenResponse');
        var itemSpokenResponse = $(this).attr('data-spokenResponse');

        // Feeding tags with database data
        $("#itemIdResponse").html('Id: 0'+ itemId);

        // Feed field if response is not null
        if(itemWrittenResponse !== null && itemWrittenResponse !== "null") {
          $("#inputWritten").val(itemWrittenResponse);
        }
        if(itemSpokenResponse !== null && itemSpokenResponse !== "null") {
          $("#inputSpoken").val(itemSpokenResponse);
        }

        // $("#inputWritten").focus();
      });

      // Long tap list item
      $(".menu").on("click", function() {
        
        // Recover information
        var itemId = $(this).attr('data-id');
        localStorage.setItem('itemId', itemId);
        var itemWrittenQuestion = $(this).attr('data-writtenQuestion');
        var itemSpokenQuestion = $(this).attr('data-spokenQuestion');
        var itemWrittenResponse = $(this).attr('data-writtenResponse');
        var itemSpokenResponse = $(this).attr('data-spokenResponse');

        // Open memory upgrade popup
        app.dialog.create({
          title: 'Choices',
          text: 'Choose one of the options below: ',
          buttons: [
            {
              text: '<i class="mdi mdi-refresh"></i> Update memory',
              color: 'blue',
              onClick: function() {
                $('#fabSave').addClass('display-none');
                $('#fabUpdate').removeClass('display-none');

                $('#writtenQuestion').val(itemWrittenQuestion);
                $('#questionUnderstood').val(itemSpokenQuestion);

                app.popup.open('.question-popup');
              }
            },
            {
              text: '<i class="mdi mdi-delete"></i> Delete memory',
              color: 'red',
              onClick: function() {
                app.dialog.confirm('Are you sure you want to delete the memory -- <strong>Id: '+ itemId +'. Pergunta: '+itemWrittenQuestion+'</strong>?', 'Confirmation', function() {
                  deleteMemory();
                });
              }
            },
            {
              text: 'Cancel',
              color: 'gray',
              onClick: function() {
                
              }
            }
          ],
          verticalButtons: true
        }).open()
      });

      // The focus of the written answer field has gone
      $("#inputWritten").on('blur', function() {
        $("#inputSpoken").val($("#inputWritten").val());
      });

      // Clicked the button for assistant to speak
      $("#speakAnswer").on('click', function() {
        // Retrieve input value Spoken response
        var heSpeaks = $("#inputSpoken").val();

        // Text to Speech
        TTS.speak({
          text: heSpeaks,
          locale: 'pt-BR',
          rate: 0.75
        }, function () {
            console.log('Assistant spoke.');
        }, function (error) {
            app.dialog.alert('There was an error: ' + error);
        });
      });

      // Clicked the button for response save
      $("#saveResponse").on('click', function() {
        // Recover id
        var id = localStorage.getItem('itemId');
        // Retrieve input value Spoken response
        var heSpeak = $("#inputSpoken").val().toLowerCase();
        // Retrieve input value Spoken response
        var heWritten = $("#inputWritten").val().toLowerCase();

        // Initiate transaction with database
        db.transaction(updateTable,
          function(err) {
            app.dialog.alert('Error updating table: ' + err);
          },
          function() {
            console.log('Success when updating table');
          });

          function updateTable(tx) {
            tx.executeSql("UPDATE memories SET written_response='" + heSpeak + "', spoken_response='" + heWritten + "' WHERE id='" + id + "' ");
          } 
          
          // Toast Save
          toastSave();
          // Clear fields
          $("#inputSpoken").val("");
          $("#inputWritten").val("");
          // Close Popup
          app.popup.close('.response-popup');
          // Update page 
          app.views.main.router.refreshPage();
      });  
    }
  },
  function(err) {
    app.dialog.alert('Error when pulling database data: ' + err);
  })
}
// List memories
listMemories();

// Record question
$("#recordQuestion").on('click', function() {
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
              // Putting what she understands in the input (questionUnderstood) tag
              $('#questionUnderstood').val(text);
          })
      },
      // Error
      function(error) {
          app.dialog.alert('There was an error: ' + error);
      },
  options)
});

// Save question
$('#saveQuestion').on("click", function() {
  // Get field values - Input tags
  var writtenQuestion = $('#writtenQuestion').val().toLowerCase();
  var spokenQuestion = $('#questionUnderstood').val().toLowerCase();

  // Validation for fields will not be saved empty
  if(writtenQuestion == "" || writtenQuestion == " " || spokenQuestion == "" || spokenQuestion == " ") {
    app.dialog.alert('Please fill in all fields!');
  } else {
    db.transaction(insert,
      // Callback Error
      function(err) {
        app.dialog.alert('Error performing insert transaction: ' + err);
      },
      // Callback Success
      function() {
        console.log('Success when performing insert transaction!');
        
        // Toast to inform user about successful save
        toastSave();

          // Clear Inputs
          $('#writtenQuestion').val("");
          $('#questionUnderstood').val("")

          // Focus on written question field
          $('#writtenQuestion').focus();

          // Update page
          app.views.main.router.refreshPage();
      });
  }
  function insert(tx) {
    tx.executeSql(`INSERT INTO memories (written_question, spoken_question) VALUES ('${writtenQuestion}', '${spokenQuestion}')`);
  }
});

// Erase memories
$("#eraseMemories").on("click", function() {
  app.dialog.confirm('Are you sure you want to delete ALL Memories?', '<strong>Remove Memories</strong>',
  function() {
    db.transaction(deleteDatabase,
      function(err) {
      app.dialog.alert('Error when performing the bank deletion transaction: ' + err);
      }, 
      function() {
        app.views.main.router.refreshPage();
    })

    function deleteDatabase(tx) {
      tx.executeSql('DROP TABLE memories', [],
      function(){
        // Delete localstorage database
        localStorage.removeItem('base');
        app.dialog.alert('Who are you... Who am I... Nothing else makes sense...', '<strong>Erased Memories</strong>');
      },
      function(err) {
        app.dialog.alert('Failed to erase memories: ' + err);
      });
    }
  })
})

// Function to delete all memory
function deleteMemory() {
  db.transaction(deleteM, 
    function(err) {
      app.dialog.alert('Error deleting item: ' + err);
    },
    function() {
      console.log('Success when deleting table item!');
      app.views.main.router.refreshPage();
    }) 
}

function deleteM(tx) {
  var id = localStorage.getItem('itemId');
  tx.executeSql('DELETE FROM memories WHERE id="' + id + '" ');
}

// Clicked the button for response save
$("#updateQuestion").on('click', function() {
  // Recover id
  var id = localStorage.getItem('itemId');
  // Retrieve input value Spoken response
  var speak = $("#questionUnderstood").val().toLowerCase();
  // Retrieve input value Spoken response
  var written = $("#writtenQuestion").val().toLowerCase();

  // Initiate transaction with database
  db.transaction(updateTbl,
    function(err) {
      app.dialog.alert('Error updating table: ' + err);
    },
    function() {
      console.log('Success when updating table');
    });

    function updateTbl(tx) {
      tx.executeSql("UPDATE memories SET spoken_question='" + speak + "', written_question='" + written + "' WHERE id='" + id + "' ");
    } 
    
    // Toast Save
    toastSave();
    // Clear fields
    $("#questionUnderstood").val("");
    $("#writtenQuestion").val("");
    // Close Popup
    app.popup.close('.question-popup');
    // Update page 
    app.views.main.router.refreshPage();
});

$('.cancel').on('click', function() {
  app.popup.close('.question-popup');
  app.views.main.router.refreshPage();
});

// Function to create save toast
function toastSave() {
  // Toast to inform user about successful save
  toastSaveBd = app.toast.create({
    icon: '<i class="mdi mdi-content-save"></i>',
    text: 'Memory saved successfully!',
    position: 'center',
    closeTimeout: 2000,
  });
  toastSaveBd.open();
}