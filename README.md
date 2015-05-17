# gulp-ember-autoglobalization

This is a gulp plugin to process to add localization helper to handlebars template.

## Usage

First, install _gulp-ember-autolocalization_:

```shell
npm install gulp-ember-autolocalization
```

Then, add it to your `gulpfile.js` and pass localization helper name to function: 

```javascript
var autoLocalization = require('gulp-ember-autolocalization');

gulp.task('templates', function(){
  gulp.src(['client/templates/*.hbs'])
    .pipe(autoLocalization('loc'))
    .pipe(gulp.dest('build/templates/'));
});
```

gulp-auto-localization outputs a raw `Ember.Handlebars.template` with localization helper added to text 



#### helperName
Type: `String`

Specify your helper name while calling the function. Default value `loc` will be taken if nothing is passed. 


##Example input

```javascript
<div>hello {{isHello}}</div>
```

##Example input
Assuming helper passes is `loc`

```javascript
<div>{{loc 'hello'}} {{isHello}}</div>
```