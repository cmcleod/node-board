function ContainerWidget(parent, opts){
  Widget.apply(this, arguments);
  this.widgets = [];
}

ContainerWidget.prototype = Object.create(Widget.prototype, {constructor: {value: ContainerWidget }});

ContainerWidget.prototype.addWidget = function(widget) {
  this.widgets.push(widget);
  this.body.appendChild(widget.getElem());
};

ContainerWidget.prototype.deleteWidget = function(widget) {
  this.widgets.removeItem(widget);
  this.body.removeChild(widget.getElem());
};

ContainerWidget.prototype.settings = function() {
  var s = Widget.prototype.settings.call(this),
      l = this.widgets.length,
      w = this.widgets;

  s.widgets = new Array(l);

  for(var i = 0; i < l; i++){
    s.widgets[i] = w[i].settings();
  }

  return s;
};

registerWidget(
  ContainerWidget,
  'Container',
  'A container widget that contains widgets of any other type'
);