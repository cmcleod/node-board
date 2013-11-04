var TO_INAC = 15000;

function boot(){
  var nb = window.nb = new NodeBoard();
  nb.setupConnection();
  nb.addWidgetTypes(availableWidgets)
  nb.load();
  startInactivityListener();
}

function startInactivityListener(e){
  var d = new Date();
  window.active = true;
  document.body.classList.add('active');
  window.lastActivity = d.getTime();
  window.lastPos = {x: 0, y: 0};

  document.addEventListener('mousemove', function (e){
    if(e.pageX != window.lastPos.x && e.pageY != window.lastPos.y){
      window.lastPos.x = e.pageX;
      window.lastPos.y = e.pageY;
      window.lastActivity = (new Date()).getTime();
      if (!window.active) {
        window.active = true;
        document.body.classList.add('active');
      }
    }
  });
  setTimeout(checkActivity, TO_INAC);
}
  
function checkActivity(){
  if (!window.editing && window.lastActivity + TO_INAC < (new Date()).getTime()) {
    if (window.active) {
      window.active = false;
      document.body.classList.remove('active');
    } 
  }
  setTimeout(checkActivity, TO_INAC);
}


