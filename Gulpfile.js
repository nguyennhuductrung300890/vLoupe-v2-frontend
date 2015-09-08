//File: Gulpfile.js
'use strict';

var gulp    = require('gulp'),
    connect = require('gulp-connect-multi')(),
    stylus  = require('gulp-stylus'),
    nib     = require('nib'),
    jshint  = require('gulp-jshint'),
    stylish = require('jshint-stylish'),
    historyApiFallback = require('connect-history-api-fallback'),
    inject  = require('gulp-inject'),
    wiredep = require('wiredep').stream,
    templateCache = require('gulp-angular-templatecache'),
    gulpif  = require('gulp-if'),
    minifyCss = require('gulp-minify-css'),
    useref  = require('gulp-useref'),
    uglify  = require('gulp-uglify');

gulp.task('server', connect.server({
  root:['app'],
  port: 1337,
  livereload: true,
  open: {
    browser: 'chrome' // if not working OS X browser: 'Google Chrome' 
  }
}));

gulp.task('jshint', function() {
  return gulp.src('./app/scripts/**/*.js')
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(jshint.reporter('fail'));
});

gulp.task('css', function() {
  gulp.src('./app/stylesheets/main.styl')
  .pipe(stylus({ use: nib() }))
  .pipe(gulp.dest('./app/stylesheets'))
  .pipe(connect.reload());
});

gulp.task('html', function() {
  gulp.src('./app/**/*.html')
    .pipe(connect.reload());
});

gulp.task('watch', function() {
  gulp.watch(['./app/**/*.html'], ['html']);
  gulp.watch(['./app/stylesheets/**/*.styl'], ['css', 'inject']);
  gulp.watch(['./app/scripts/**/*.js', './Gulpfile.js'], ['jshint', 'inject']);
  gulp.watch(['./bower.json'], ['wiredep']);

});

gulp.task('inject', function() {
  var sources = gulp.src([ './app/scripts/**/*.js', './app/stylesheets/**/*.css']);
  return gulp.src('index.html', { cwd: './app' })
    .pipe(inject(sources, {
      read: false,
      ignorePath: '/app'
    }))
    .pipe(gulp.dest('./app'));
});

gulp.task('wiredep', function() {
  gulp.src('./app/index.html')
  .pipe(wiredep({
    directory: './app/lib'
  }))
  .pipe(gulp.dest('./app'));
});

gulp.task('templates', function() {
  gulp.src('./app/views/**/*.tpl.html')
    .pipe(templateCache({
      root: 'views/',
      module: 'blog.templates',
      standlone: true
    }))
    .pipe(gulp.dest('./app/scripts'));
});

gulp.task('compress', function() {
  gulp.src('./app/index.html')
  .pipe(useref.assets())
  .pipe(gulpif('*.js', uglify({mangle: false })))
  .pipe(gulpif('*.css', minifyCss()))
  .pipe(gulp.dest('./dist'));
});

gulp.task('copy', function() {
  gulp.src('./app/index.html')
    .pipe(useref())
    .pipe(gulp.dest('./dist'));
  gulp.src('./app/lib/fontawesome/fonts/**')
    .pipe(gulp.dest('./dist/fonts'));
});

gulp.task('server-dist', function() {
  connect.server({
    root: './dist',
    hostname: '0.0.0.0.',
    port: 8080,
    livereload :true,
    middleware: function(connect, opt) {
      return [ historyApiFallback ];
    }
  });
});

gulp.task('default', ['server', 'inject', 'wiredep', 'watch']);
gulp.task('build', ['templates', 'compress', 'copy']);
