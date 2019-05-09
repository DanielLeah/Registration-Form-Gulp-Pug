/*jslint devel: true */

/*eslint no-console: "off", no-undef: "off" */

// terminal:
// npm init
// npm install gulp --save
//npm install --save-dev gulp-uglify
//npm install static-server --save
//node server.js
//npm install gulp-livereload --save-dev
//npm install gulp-concat --save-dev
//npm install gulp-minify-css --save-dev
//npm install gulp-autoprefixer --save-dev
//npm install gulp-plumber --save-dev
//npm install gulp-sourcemaps --save-dev //debugging
//npm install gulp-sass --save-dev

//PATHS
var JS_PATH = 'public/resources/js/**/*.js';
var DESTINATION_PATH = 'public/dist';
var CSS_PATH = 'public/resources/css/**/*.css';
var TEMPLATES_PATH = 'templates/**/*.hbs';
//Variables
var gulp = require('gulp');
var uglify = require('gulp-uglify');
var livereload = require('gulp-livereload');
var concat = require('gulp-concat');
var minifyCSS = require('gulp-minify-css');
var autoprefixer = require('gulp-autoprefixer');
var plumber = require('gulp-plumber');
var sourcemaps = require('gulp-sourcemaps');
var styleScss = require('gulp-sass');

//Handlebars
var handlebars = require('gulp-handlebars');
var handlebarsLib = require('handlebars');
var declare = require('gulp-declare');
var wrap = require('gulp-wrap');

//Styles css
gulp.task('styles', function(){
    console.log('starting styles task');
    return gulp.src(CSS_PATH)
        .pipe(plumber(function(err){
            console.log('style error task');
            console.log(err);
            this.emit('end');
        }))
        .pipe(sourcemaps.init())
        .pipe(autoprefixer())
        .pipe(concat('styles.css'))
        .pipe(minifyCSS())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(DESTINATION_PATH))
        .pipe(livereload());
});

//Styles scss
gulp.task('styles-scss', function(){
    console.log('starting styles task');
    return gulp.src('public/resources/scss/styles.scss')
        .pipe(plumber(function(err){
            console.log('style error task');
            console.log(err);
            this.emit('end');
        }))
        .pipe(sourcemaps.init())
        .pipe(autoprefixer())
        .pipe(styleScss({
            outputStyle: 'compressed'
        }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(DESTINATION_PATH))
        .pipe(livereload());
});

//Scripts
gulp.task('scripts', function(){
    console.log('starting scripts task');
    return gulp.src(JS_PATH)
        .pipe(plumber(function(err){
            console.log('scripts error task');
            console.log(err);
            this.emit('end');
        }))
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(concat('scripts.js'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(DESTINATION_PATH))
        .pipe(livereload());
});
//Handlebars
gulp.task('templates', function(){
    console.log('starting handlebars task');
    return gulp.src(TEMPLATES_PATH)
        .pipe(handlebars({
            handlebars: handlebarsLib
        }))
        .pipe(wrap('Handlebars.template(<%= contents %>)'))
        .pipe(declare({
            namespace: 'templates',
            noRediclare: true
        }))
        .pipe(concat('templates.js'))
        .pipe(gulp.dest(DESTINATION_PATH))
        .pipe(livereload());
});

//Default
gulp.task('default',gulp.series('scripts', 'styles-scss', 'templates', function(done){
    console.log('starting default task');
    done();
}));

//Watch
gulp.task('watch',gulp.series('default', function(){
    console.log('starting watch task');
    require('./server.js');
    livereload.listen();
    gulp.watch(JS_PATH, gulp.series('scripts'));
    gulp.watch('public/resources/scss/**/*.scss', gulp.series('styles-scss'));
    gulp.watch(TEMPLATES_PATH, gulp.series('templates'));
}));