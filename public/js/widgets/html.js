function HtmlWidget(parent, opts){
  Widget.apply(this, arguments);
  this.widgets = [];
  this.html = '<h1>Hello</h1>' || opts.text;
  this.elem.innerHTML += this.html;
}

HtmlWidget.prototype = Object.create(Widget.prototype, {constructor: {value: HtmlWidget }});

HtmlWidget.prototype.settings = function() {
  var s = Widget.prototype.settings.call(this);
  s.html = this.html;
  return s;
};