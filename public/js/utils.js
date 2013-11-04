Array.prototype.remove = function(from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};

Array.prototype.removeItem = function(item) {
  return this.remove(this.indexOf(item));
};

var availableWidgets = [];

function registerWidget(constructor, name, description){
  availableWidgets.push({
    name: name,
    constructor: constructor,
    description: description
  });
}