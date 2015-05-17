var assert = require('assert');
var es = require('event-stream');
var File = require('vinyl');
var emberLoc = require('./index.js');

describe('ember-loc', function() {
  describe('in buffer mode', function() {

    it('should add helper with normal html input', function(done) {

      // create the fake file
      var fakeFile = new File({
        contents: new Buffer('<h1>hello</h1>')
      });

      // Create a prefixer plugin stream
      var stream = emberLoc('loc');

      // write the fake file to it
      stream.write(fakeFile);

      // wait for the file to come back out
      stream.once('data', function(file) {
        // make sure it came out the same way it went in
        assert(file.isBuffer());

        // check the contents
        assert.equal(file.contents.toString('utf8'), "<h1>{{loc 'hello'}}</h1>");
        done();
      });

    });

    it('should not add helper with normal handlebar input', function(done) {

      // create the fake file
      var fakeFile = new File({
        contents: new Buffer('<h1>{{name}}</h1>')
      });

      // Create a prefixer plugin stream
      var stream = emberLoc('loc');

      // write the fake file to it
      stream.write(fakeFile);

      // wait for the file to come back out
      stream.once('data', function(file) {
        // make sure it came out the same way it went in
        assert(file.isBuffer());

        // check the contents
        assert.equal(file.contents.toString('utf8'), '<h1>{{name}}</h1>');
        done();
      });

    });

    it('should not add helper with only one handlebar expression witout any HTML tag', function(done) {

      // create the fake file
      var fakeFile = new File({
        contents: new Buffer('{{hello}}')
      });

      // Create a prefixer plugin stream
      var stream = emberLoc('loc');

      // write the fake file to it
      stream.write(fakeFile);

      // wait for the file to come back out
      stream.once('data', function(file) {
        // make sure it came out the same way it went in
        assert(file.isBuffer());

        // check the contents
        assert.equal(file.contents.toString('utf8'), '{{hello}}');
        done();
      });

    });

    it('should not add helper with normal text input without any HTML tag', function(done) {

      // create the fake file
      var fakeFile = new File({
        contents: new Buffer('hello')
      });

      // Create a prefixer plugin stream
      var stream = emberLoc('loc');

      // write the fake file to it
      stream.write(fakeFile);

      // wait for the file to come back out
      stream.once('data', function(file) {
        // make sure it came out the same way it went in
        assert(file.isBuffer());

        // check the contents
        assert.equal(file.contents.toString('utf8'), "{{loc 'hello'}}");
        done();
      });

    });
    
    it('should add helper to text with mixed handlerbar and text', function(done) {

      // create the fake file
      var fakeFile = new File({
        contents: new Buffer('<div>hello {{isHello}}</div>')
      });

      // Create a prefixer plugin stream
      var stream = emberLoc('loc');

      // write the fake file to it
      stream.write(fakeFile);

      // wait for the file to come back out
      stream.once('data', function(file) {
        // make sure it came out the same way it went in
        assert(file.isBuffer());

        // check the contents
        assert.equal(file.contents.toString('utf8'), "<div>{{loc 'hello'}} {{isHello}}</div>");
        done();
      });

    });
    
    it('should  add helper with if else block in template', function(done) {

      // create the fake file
      var fakeFile = new File({
        contents: new Buffer('<div>{{#if isText}} <h1>nay</h1> {{else}} <h1>yay</h1>{{/if}}</div>')
      });

      // Create a prefixer plugin stream
      var stream = emberLoc('loc');

      // write the fake file to it
      stream.write(fakeFile);

      // wait for the file to come back out
      stream.once('data', function(file) {
        // make sure it came out the same way it went in
        assert(file.isBuffer());

        // check the contents
        assert.equal(file.contents.toString('utf8'), "<div>{{#if isText}} <h1>{{loc 'nay'}}</h1> {{else}} <h1>{{loc 'yay'}}</h1>{{/if}}</div>");
        done();
      });

    });

    

    
   /* it('should not add helper with complicated handlebars expression', function(done) {

      // create the fake file
      var fakeFile = new File({
        contents: new Buffer('<div>{{#if isText}} nay {{else}} yay {{/if}}</div>')
      });

      // Create a prefixer plugin stream
      var stream = emberLoc('loc');

      // write the fake file to it
      stream.write(fakeFile);

      // wait for the file to come back out
      stream.once('data', function(file) {
        // make sure it came out the same way it went in
        assert(file.isBuffer());

        // check the contents
        assert.equal(file.contents.toString('utf8'), '<div>{{#if isText}} {{loc nay}} {{else}} {{loc yay}} {{/if}}</div>');
        done();
      });

    });
    */


    it('input linkto helper', function(done) {

      // create the fake file
      var fakeFile = new File({
        contents: new Buffer("<div>{{#link-to 'user.signin' tagName='a'}}Click here{{/link-to}}</div>")
      });

      // Create a prefixer plugin stream
      var stream = emberLoc('loc');

      // write the fake file to it
      stream.write(fakeFile);

      // wait for the file to come back out
      stream.once('data', function(file) {
        // make sure it came out the same way it went in
        assert(file.isBuffer());

        // check the contents
        assert.equal(file.contents.toString('utf8'), "<div>{{#link-to 'user.signin' tagName='a'}}{{loc 'Click here'}}{{/link-to}}</div>");
        done();
      });

    });
    
    it('input with helper', function(done) {

      // create the fake file
      var fakeFile = new File({
        contents: new Buffer("{{#with bakingSession.feedbackDetails}}this is a text{{/with}}")
      });

      // Create a prefixer plugin stream
      var stream = emberLoc('loc');

      // write the fake file to it
      stream.write(fakeFile);

      // wait for the file to come back out
      stream.once('data', function(file) {
        // make sure it came out the same way it went in
        assert(file.isBuffer());

        // check the contents
        assert.equal(file.contents.toString('utf8'), "{{#with bakingSession.feedbackDetails}}{{loc 'this is a text'}}{{/with}}");
        done();
      });

    });
    
     it('input each helper', function(done) {

      // create the fake file
      var fakeFile = new File({
        contents: new Buffer('{{#each imageUrl in allImagesUrl}}'+
	  '<div class="default-img-div"  {{action openVideoModel imageUrl.level target="view"}}>'+  
	    '<img {{bind-attr src=imageUrl.image}} width="136" height="84" alt="" class="img-thumbnail cursor-pointer"/>'+
	    "<span class='cursour-pointer video-link-text'>Show Video"+
	    '</span>'+
	  '</div>'+
	  '{{else}}'+
	   "<h4 class='width134'>No Image</h4>"+
	'{{/each}}')});

      // Create a prefixer plugin stream
      var stream = emberLoc('loc');

      // write the fake file to it
      stream.write(fakeFile);

      // wait for the file to come back out
      stream.once('data', function(file) {
        // make sure it came out the same way it went in
        assert(file.isBuffer());

        // check the contents
        assert.equal(file.contents.toString('utf8'),'{{#each imageUrl in allImagesUrl}}'+
	  '<div class="default-img-div"  {{action openVideoModel imageUrl.level target="view"}}>'+  
	    '<img {{bind-attr src=imageUrl.image}} width="136" height="84" alt="" class="img-thumbnail cursor-pointer"/>'+
	    "<span class='cursour-pointer video-link-text'>{{loc 'Show Video'}}"+
	    '</span>'+
	  '</div>'+
	  '{{else}}'+
	   "<h4 class='width134'>{{loc 'No Image'}}</h4>"+
	'{{/each}}');
        done();
      });

    });



it('action attribute', function(done) {

      // create the fake file
      var fakeFile = new File({
        contents: new Buffer('<div class="default-img-div t_feedback-img"  {{action openVideoModel imageUrl.level target="view"}}></div>')
      });

      // Create a prefixer plugin stream
      var stream = emberLoc('loc');

      // write the fake file to it
      stream.write(fakeFile);

      // wait for the file to come back out
      stream.once('data', function(file) {
        // make sure it came out the same way it went in
        assert(file.isBuffer());

        // check the contents
        assert.equal(file.contents.toString('utf8'), '<div class="default-img-div t_feedback-img"  {{action openVideoModel imageUrl.level target="view"}}></div>');
        done();
      });

    });
    
    
    it('bind-attr attribute', function(done) {

      // create the fake file
      var fakeFile = new File({
        contents: new Buffer('<img {{bind-attr src=imageUrl.image}} width="136" height="84" alt="" class="img-thumbnail cursor-pointer"/>')
      });

      // Create a prefixer plugin stream
      var stream = emberLoc('loc');

      // write the fake file to it
      stream.write(fakeFile);

      // wait for the file to come back out
      stream.once('data', function(file) {
        // make sure it came out the same way it went in
        assert(file.isBuffer());

        // check the contents
        assert.equal(file.contents.toString('utf8'), '<img {{bind-attr src=imageUrl.image}} width="136" height="84" alt="" class="img-thumbnail cursor-pointer"/>');
        done();
      });

    });
    
    
    it('mixed text and handlebars syntac', function(done) {

      // create the fake file
      var fakeFile = new File({
        contents: new Buffer("<p>Hello, my name is {{name}}. I am from {{hometown}}. I have " +
             "{{kids.length}} children:</p>" +
             "<ul>{{#kids}}<li>{{name}} is {{age}}</li>{{/kids}}</ul>")
      });

      // Create a prefixer plugin stream
      var stream = emberLoc('loc');

      // write the fake file to it
      stream.write(fakeFile);

      // wait for the file to come back out
      stream.once('data', function(file) {
        // make sure it came out the same way it went in
        assert(file.isBuffer());

        // check the contents
        assert.equal(file.contents.toString('utf8'), "<p>{{loc 'Hello, my name is'}} {{name}}. {{loc 'I am from'}} {{hometown}}. {{loc 'I have'}} " +
             "{{kids.length}} {{loc 'children'}}:</p>" +
             "<ul>{{#kids}}<li>{{name}} {{loc 'is'}} {{age}}</li>{{/kids}}</ul>");
        done();
      });

    });
    
    
    it('testing nbsp charector', function(done) {

      // create the fake file
      var fakeFile = new File({
        contents: new Buffer('<h1>hellw how r u &nbsp;&nbsp;</h1>')
      });

      // Create a prefixer plugin stream
      var stream = emberLoc('loc');

      // write the fake file to it
      stream.write(fakeFile);

      // wait for the file to come back out
      stream.once('data', function(file) {
        // make sure it came out the same way it went in
        assert(file.isBuffer());

        // check the contents
        assert.equal(file.contents.toString('utf8'),"<h1>{{loc 'hellw how r u'}} &nbsp;&nbsp;</h1>");
        done();
      });

    });
    
    
    

  });
});