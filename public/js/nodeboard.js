
function NodeBoard() {
  var widgets = {},
  settings = {},
  socket = null,
  name = null,
  rootWidget = null;

  this.load = function(boardName) {
    this.name = boardName || 'default';
    socket.emit('load', {name: boardName});
  };

  this.save = function(){
    var widgetData = this.rootWidget.settings();
    console.log('Saving', widgetData);
    socket.emit('save', {settings: widgetData});
  };

  this.clearNotifications = function(){
    var notifications = document.getElementById('notification-area');
    notifications.innerHTML = '';
  }

  this.setNotification = function(type, message){
      var status = document.getElementById('connection-status');
      if(!status){
        var notifications = document.getElementById('notification-area');
        status = document.createElement('div');
        status.id = 'connection-status';
        status.className = 'notification ' + type;
        status.innerHTML = message;
        notifications.appendChild(status);
      }
      else {
        status.className = 'notification ' + type;
        status.innerHTML = message;
      }
  }

  this.setupConnection = function(){
    socket = io.connect(window.location.origin); // Establish Web Socket connection

    socket.on('settings', function (data) {
      console.log('Settings received', data);
      name = data.name;
      this.buildBoard(data.settings);   // Load settings then Build widgets
    }.bind(this));

    socket.on('error',function(){
      this.setNotification('error', 'Lost Connection to Host');
    }.bind(this));

    socket.on('connect', function () {
      this.setNotification('success', 'Connected');
      setTimeout(this.clearNotifications.bind(this), 3000);
    }.bind(this));

    socket.on('connecting', function () {
      this.setNotification('info', 'Connecting');
    }.bind(this));

    socket.on('connect_failed', function () {
      this.setNotification('error', 'Could not connect to Host');
    });

    socket.on('reconnect_failed', function () {
      this.setNotification('error', 'Could not reconnect to Host');
    });

    socket.on('reconnect', function () {
      this.setNotification('success', 'Reconnected!');
      setTimeout(this.clearNotifications.bind(this), 3000);
    }.bind(this));

    socket.on('reconnecting', function () {
      this.setNotification('warning', 'Reconnecting');
    }.bind(this));


  };

  this.buildBoard = function (widgetData){
    var oldRoot = rootWidget;
    rootWidget = this.createWidget(null, widgetData);
    if(oldRoot) document.body.removeChild(oldRoot);
    document.body.appendChild(rootWidget.getElem());
  }

  this.availableWidgets = function(){
    return widgets;
  }

  this.addWidgetTypes = function(w){
    for(var i =0, l = w.length; i < l; i++){
      widgets[w[i].constructor.name] = w[i];
    }
  }
      
  this.createWidget = function(parent,widgetData){
    if(widgets[widgetData.type] && typeof widgets[widgetData.type].constructor === 'function'){
      var widget = new widgets[widgetData.type].constructor(parent,widgetData);
      if(widgetData.widgets)
        for(var i = 0; i < widgetData.widgets.length; i++)
          this.createWidget(widget,widgetData.widgets[i]);
      
      return widget;
    }
    else {
      console.log('Widget Type does not exist', fn, widgetData.type, widgetData);
      return null;
    }
  }
}

