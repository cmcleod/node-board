function HtmlWidget(parent, opts){
  Widget.apply(this, arguments);
  this.widgets = [];
  this.html = '<h1>Hello</h1>' || opts.text;
  this.body.innerHTML += this.html;
}

HtmlWidget.prototype = Object.create(Widget.prototype, {constructor: {value: HtmlWidget }});

HtmlWidget.prototype.settings = function() {
  var s = Widget.prototype.settings.call(this);
  s.html = this.html;
  return s;
};

HtmlWidget.prototype.setHtml = function(html) {
  this.html = html;
  this.body.innerHTML = html;
};

registerWidget(
  HtmlWidget,
  'HTML',
  'A simple widget that will render any HTML'
);