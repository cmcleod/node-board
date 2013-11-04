
function Widget(parent, opts){
  opts = opts || {};
  this.parent = parent;

  this.elem = document.createElement('div');
  this.style = this.elem.style;
  this.classes = this.elem.classList;
  this.classes.add('widget');
  this.body = document.createElement('div');
  this.body.classList.add('widget-body');
  this.elem.appendChild(this.body);
  
  this.moveable = false;
  this.dragging = false;

  if(this.isRoot()){
    this.classes.add('root');
  }
  else {
    this.maximized = opts.maximized || false;
    this.width = opts.width || 200;
    this.height = opts.height || 200;
    this.x = opts.x || 10;
    this.y = opts.y || 10;
    this.parent.addWidget(this);

    this.elem.addEventListener('dblclick', function(e) {
      if(window.selectedWidget == this){
        window.selectedWidget = null;
        this.deselect();
      }
      else {
         if(window.selectedWidget) window.selectedWidget.deselect();
         this.select();
         window.selectedWidget = this;
      }
      e.stopPropagation();
    }.bind(this));

    this.buildMenu();
    this.resize();
  }
}

Widget.prototype.buildMenu = function() {
  var self = this;
  var menu = document.createElement('div'), e;
  this.menu = menu;
  menu.classList.add('menu');
  //menu.innerHTML += '<div class="add">&#10011;</div>';
  //menu.innerHTML += '<div class="edit">✎</div>';
  if(!this.isRoot()){
    e = document.createElement('div');
    e.innerHTML = (this.maximized)? 'm' : 'M';
    e.addEventListener('click', function(){
        self.maximized = !self.maximized;
        self.resize();
        this.innerHTML = (self.maximized)? 'm' : 'M';
    });
    menu.appendChild(e);
    e = document.createElement('div');
    e.innerHTML = '✕';
    e.addEventListener('click', this.confirmDelete.bind(this));
    menu.appendChild(e);
  }
  this.elem.appendChild(menu);
};

Widget.prototype.select = function() {
  //this.e.draggable({ snap: true, cursor: 'move', containment: 'parent', addClasses: false });
  //this.e.resizable({containment: "parent"});
  this.classes.add('selected');
};

Widget.prototype.deselect = function() {
  this.classes.remove('selected');
};

Widget.prototype.isRoot = function() {
  return this.parent === null;
};

Widget.prototype.confirmDelete = function() {
  var del = document.createElement('div'),
      cncl = document.createElement('div');
  del.className = 'btn delete';
  del.innerHTML = 'Delete';
  cncl.className = 'btn cancel';
  cncl.innerHTML = 'Cancel';

  cncl.addEventListener('click', function() {
    this.elem.removeChild(cncl);
    this.elem.removeChild(del);
    this.body.style.display = null;
    this.menu.style.display = null;
  }.bind(this));

  del.addEventListener('click', function() {
    this.parent.deleteWidget(this);
  }.bind(this));
  
  this.body.style.display = 'none';
  this.menu.style.display = 'none';
  this.elem.appendChild(del);
  this.elem.appendChild(cncl);
};

Widget.prototype.getElem = function() {
  return this.elem;
};

Widget.prototype.getParent = function() {
  return this.parent;
};

Widget.prototype.setSize = function(w,h) {
  this.width = w;
  this.height = h;
  this.resize();
};


Widget.prototype.resize = function() {
  if(this.isRoot()) return;
  var style = this.style;
  if(this.maximized){
    style.top = 0;
    style.left = 0;
    style.width = '100%';
    style.height = '100%';
    this.classes.remove('drsMoveHandle');
    this.classes.remove('w-drag');
  }
  else {
    this.classes.add('drsMoveHandle');
    this.classes.add('w-drag');
    style.top = this.x + 'px';
    style.left = this.y + 'px';
    style.width = this.width  + 'px';
    style.height = this.height + 'px';
  }
}


Widget.prototype.showMenu = function(show) {
  this.menu.style.display = (show)? 'block' : 'none';
};


Widget.prototype.settings = function() {
  var s = {
    type: this.constructor.name
  }

  if (!this.isRoot()){
    s.maximized = this.maximized;
    s.width = this.width;
    s.height = this.height;
    s.x = this.x;
    s.y = this.y;
  }

  return s;
};



var dragresize = new DragResize('dragresize',{ minWidth: 150, minHeight: 50, minLeft: 0, minTop: 0, maxLeft: 1000, maxTop: 1000 });

// Optional settings/properties of the DragResize object are:
//  enabled: Toggle whether the object is active.
//  handles[]: An array of drag handles to use (see the .JS file).
//  minWidth, minHeight: Minimum size to which elements are resized (in pixels).
//  minLeft, maxLeft, minTop, maxTop: Bounding box (in pixels).

// Next, you must define two functions, isElement and isHandle. These are passed
// a given DOM element, and must "return true" if the element in question is a
// draggable element or draggable handle. Here, I'm checking for the CSS classname
// of the elements, but you have have any combination of conditions you like:

dragresize.isElement = function(elm)
{
 if (elm.className && elm.className.indexOf('w-drag') > -1) return true;
};
dragresize.isHandle = function(elm)
{
 if (elm.className && elm.className.indexOf('drsMoveHandle') > -1) return true;
};

// You can define optional functions that are called as elements are dragged/resized.
// Some are passed true if the source event was a resize, or false if it's a drag.
// The focus/blur events are called as handles are added/removed from an object,
// and the others are called as users drag, move and release the object's handles.
// You might use these to examine the properties of the DragResize object to sync
// other page elements, etc.

dragresize.ondragfocus = function() { };
dragresize.ondragstart = function(isResize) { };
dragresize.ondragmove = function(isResize) { };
dragresize.ondragend = function(isResize) { };
dragresize.ondragblur = function() { };

// Finally, you must apply() your DragResize object to a DOM node; all children of this
// node will then be made draggable. Here, I'm applying to the entire document.
dragresize.apply(document);




