var gulp = require('gulp');
var sass = require('gulp-sass');
var connect = require('gulp-connect');
var rollup = require('rollup').rollup;
var commonjs = require('rollup-plugin-commonjs');
var nodeResolve = require('rollup-plugin-node-resolve');
var rollupEnv = require('rollup-plugin-env');
var rollupBabel = require('rollup-plugin-babel');

gulp.task('rollupapp', function() {
  return rollup({
    entry: 'app/js/plaster.js',
    plugins: [
      rollupEnv({
        NODE_ENV: 'production'
      }),
      nodeResolve({
        jsnext: true,
        main: true
      }),
      commonjs({
        include: 'node_modules/**'
      }),
      rollupBabel({
        babelrc: false,
        exclude: 'node_modules/**',
        presets: ['es2015-rollup', 'react']
      })
    ]
  }).then(function(bundle) {
    return bundle.write({
      format: 'iife',
      sourceMap: true,
      moduleName: 'plasterBundle',
      dest: 'app/compiled/plaster.js'
    });
  });
});

gulp.task('cssapp', function() {
  return gulp.src('app/scss/plaster.scss')
  .pipe(sass({
    outputStyle: 'compressed'
  }))
  .pipe(gulp.dest('app/compiled'));
});

gulp.task('cssdocs', function() {
  return gulp.src('docssrc/scss/plaster-docs.scss')
  .pipe(sass({
    outputStyle: 'compressed'
  }))
  .pipe(gulp.dest('docs/css'));
});

gulp.task('connectdocs', function() {
  connect.server({
    root: 'docs',
    livereload: false
  });
});

gulp.task('watchapp', ['rollupapp', 'cssapp'], function() {
  gulp.watch('app/js/*.js', ['rollupapp']);
  gulp.watch('app/scss/*.scss', ['cssapp']);
});

gulp.task('watchdocs', ['cssdocs'], function() {
  gulp.watch('docssrc/scss/*.scss', ['cssdocs']);
});

gulp.task('docs', ['connectdocs', 'watchdocs']);
