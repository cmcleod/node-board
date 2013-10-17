
function boot(){
  window.socket = io.connect(window.location.origin); // Establish Web Socket connection

  socket.on('settings', function (data) {
    localStorage.clear();
    localStorage.setItem(data.name,data.settings);
    window.boardName = data.name;
    buildWidgets(data.settings);   // Load settings then Build widgets
  });
  window.socket.emit('load', {name: window.boardName});
}

function buildWidgets(settings){
  var oldRoot = window.rootWidget;
  window.rootWidget = createWidget(null, settings);
  if(oldRoot) document.body.removeChild(oldRoot);
  document.body.appendChild(window.rootWidget.getElem());
}

function createWidget(parent,settings){
  var fn = window[settings.type];
  if(typeof fn === 'function'){
    var widget = new fn(parent,settings);
    if(settings.widgets)
      for(var i = 0; i < settings.widgets.length; i++)
        createWidget(widget,settings.widgets[i]);
    
    return widget;
  }
  else {
    console.log('create widget error', parent, settings);
    return null;
  }
}

function saveSettings(){
  var settings = window.rootWidget.settings();
  localStorage.setItem(window.boardName,settings);

  if (window.socket) {
    window.socket.emit('save', {settings: settings});
  }
}