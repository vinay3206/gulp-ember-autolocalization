// through2 is a thin wrapper around node transform streams
var through = require('through2');
var gutil = require('gulp-util');
var PluginError = gutil.PluginError;


// Consts
const PLUGIN_NAME = 'gulp-ember-autolocalization';


var replaceSpecialChars=function(text) {
	var chars=['.',':','?','!','&nbsp;'];
	chars.forEach(function(c) {
		text=text.split(c).join('');
	});
	return text.trim();
};


var isHandlebarExpression=function(text){
		var index=text.search("{{");
		if(index==-1){
			return false;
		}
		return true;
		
};


var handlebarExpressionHandler=function(input,helper){
	var temp=input;
	temp=temp.replace(/{{([^{}]+)}}/g,"!");
	var texts=temp.split('!');
	texts.forEach(function(text){
		text=text.trim();
		if(text){
			text=replaceSpecialChars(text);
			input=input.split(text).join("{{"+helper+" '"+text+"'}}");
		}
	});
	return input;
};

var hasText=function(input){
	input=input.replace(/{{([^{}]+)}}/g,"");
	input=input.trim();
	return input?true:false;
};


var localize=function(text,helper){
		if(!isHandlebarExpression(text)){
			return "{{"+helper+" '"+text+"'}}";
		}
		else{
			return hasText(text)?handlebarExpressionHandler(text,helper):text;
		}
	};



var replaceHelper=function (node,helper) {
		if(node.type=='text' && node.content){
			node.content=localize(node.content,helper);
		}
		if(node.children){
		    var nodes = node.children;
		    for (var i = 0, m = nodes.length; i < m; i++) {
		        var n = nodes[i];
		        if (n.type=='text' && n.content) {
		            // do some swappy text to html here?
		            n.content=localize(n.content,helper);
		        } else {
		            replaceHelper(n,helper);
		        }
		    }
		}
	};

var process=function(input,helper){
		var text=input.replace(/<(?:.|\n)*?>/gm,"*");
		text=text.trim();
		var texts=text.split('*');
		var uniqueArray = texts.filter(function(elem, pos) {
    			return texts.indexOf(elem) == pos;
		});
		uniqueArray.forEach(function(t){
			t=t.trim();
			if(t){
				if(!isHandlebarExpression(t)){
					t=replaceSpecialChars(t);
				}
				var lt=localize(t,helper);
				input=input.split(t).join(lt);
			}
		});
		return input;
							
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
				// if something goes wrong return the file unchanged with original source
				file.contents = new Buffer(src);
				this.push(file);
			}
			else{
				file.contents = new Buffer(result);
				this.push(file);
			}
		} catch (err) {
			this.emit('error', new gutil.PluginError('gulp-ember-autolocalization', err, {fileName: file.path}));
		}
	});
};