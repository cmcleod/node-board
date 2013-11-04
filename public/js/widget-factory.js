
function WidgetFactory(){
	this.widgets =  {};
  this.add = function(name,constructor, description) {
    this.widgets[name] = {
      description: description,
      constructor: constructor
    }
  };

	this.create = function(name, parent, settings) {

	};
}