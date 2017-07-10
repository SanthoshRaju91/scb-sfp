(function() {
  // create the editor
  var JSONcontainer = document.getElementById("jsoneditor");
  var options = {
    "mode": "code",
    "search": true
  };
  var JsonEditor = new JSONEditor(JSONcontainer, options);

  // set json
  var json = {
      "Array": [1, 2, 3],
      "Boolean": true,
      "Null": null,
      "Number": 123,
      "Object": {"a": "b", "c": "d"},
      "String": "Hello World"
  };
  JsonEditor.set(json);

  var ObjectContainer = document.getElementById("jsoneditor1");
  var OBJOptions = {
    "mode": "tree",
    "search": true
  };

  var ObjectEditor = new JSONEditor(ObjectContainer, OBJOptions);

  // get json
  var json = JsonEditor.get();

  $('#convertToObject').click(function() {
    ObjectEditor.set(json);
  });

}());
