(function() {

  // create the editor
  var JSONcontainer = document.getElementById("jsoneditor");
  var options = {
    "mode": "code",
    "search": true
  };
  var JsonEditor = new JSONEditor(JSONcontainer, options);



  var ObjectContainer = document.getElementById("jsoneditor1");
  var OBJOptions = {
    "mode": "tree",
    "search": true
  };

  var ObjectEditor = new JSONEditor(ObjectContainer, OBJOptions);


  $('#convertToObject').click(function() {
    let json = JsonEditor.get();
    ObjectEditor.set(json);
  });

  $('#submit').click(function(){
    if ($('.ace_error').length > 0) {
        alert('Invalid JSON');
    } else {
      var translations = JsonEditor.get();

      $.post({
        url: 'http://localhost:3000/api/submit',
        data: JSON.stringify(translations),
        contentType: 'application/json',
        success: function(response){
          alert('ho gaya save');
        },
        error: function(response){
          alert('fat gaya, fir se save kar');
        }
      })
    }

  });

  $.get('http://localhost:3000/assets/translations.json')
  .done(function(response){
    json = response;

    JsonEditor.set(json);
  })



}());
