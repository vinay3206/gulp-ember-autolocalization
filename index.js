// through2 is a thin wrapper around node transform streams
var through = require('through2');
var gutil = require('gulp-util');
var HTML = require('html-parse-stringify');
var PluginError = gutil.PluginError;

// Consts
const PLUGIN_NAME = 'gulp-ember-autolocalization';


var isHandlebarExpression:function(text){
		// pass trimmed text
		if(/^[{{]/.test(text)){
			return true;
		}
		return false;
};


var localize=function(text,helper){
		var val=$.trim(text);
		if(val && !isHandlebarExpression(val))
			return "{{"+helper+" "+text+"}}";
		return text;
	};



var replaceHelper=function (node,helper) {
		if(node.type=='text'){
			node.content=localize(node.content,helper);
		}
	    var nodes = node.children;
	    for (var i = 0, m = nodes.length; i < m; i++) {
	        var n = nodes[i];
	        if (n.type=='text') {
	            // do some swappy text to html here?
	            n.content=localize(n.content,helper);
	        } else {
	            replaceHelper(n,helper);
	        }
	    }
	};

var process=function(input,helper){
		
		var nodes=HTML.parse(input);
		nodes.forEach($.proxy(function(val){
			replaceHelper(val,helper);
		},this));
		return HTML.stringify(nodes);
		
	};

module.exports = function (helper) {
	helper=helper||'loc';
	
	return through.obj(function (file) {
		if (file.isNull()) {
			throw new PluginError(PLUGIN_NAME, 'File is empty!');
			return;
		}

		if (file.isStream()) {
			throw new PluginError(PLUGIN_NAME, 'Streaming not supported!');
			return;
		}

		var src = file.contents.toString();

		try {
			var result = process(src,helper);

			if (!result) {
				throw new gutil.PluginError('gulp-ember-autolocalization\n', "Error occured", {
					fileName: file.path,
					showStack: false
				});
				return;

			}

			file.contents = new Buffer(result);
			this.push(file);
		} catch (err) {
			this.emit('error', new gutil.PluginError('gulp-ember-autolocalization', err, {fileName: file.path}));
		}
	});
};