var gulp = require('gulp');
var uglify = require('gulp-uglify');
var runSequence = require('run-sequence');
var autoprefixer = require('gulp-autoprefixer');
var sourcemaps = require('gulp-sourcemaps');
var browserSync = require('browser-sync');
var minifyCss = require('gulp-clean-css');
var htmlmin = require('gulp-html-minifier');
var imagemin = require('gulp-imagemin');
var compression = require('compression');
var purify = require('gulp-purifycss');
var babel = require("gulp-babel");
var workbox = require('workbox-build');

var paths = {
  html: ['./app/**/*.html'],
  scripts: ['./app/**/*.js', '!./app/sw.js'],
  styles: ['app/**/*.css'],
  json: ['app/**/*.json'],
  images: ['./app/**/*.{png,jpg,gif,svg}'],
  dest: './build'
};

gulp.task('generate-service-worker', () => {
  return workbox.injectManifest({
    globDirectory: paths.dest,
    globPatterns: [
      "**/*.{js,png,html,css,json}"
    ],
    swDest: `${paths.dest}/sw.js`,
    swSrc: `src-sw.js`,
  }).then(({warnings}) => {
    // In case there are any warnings from workbox-build, log them.
    for (const warning of warnings) {
      console.warn(warning);
    }
    console.info('Service worker generation completed.');
  }).catch((error) => {
    console.warn('Service worker generation failed:', error);
  });
});

gulp.task('minify', function () {
  gulp.src(paths.scripts)
    .pipe(babel())
    .pipe(uglify())
    .pipe(gulp.dest(paths.dest));
});

gulp.task('processCSS', function () {
  gulp.src(paths.styles)
    .pipe(minifyCss())
    .pipe(gulp.dest(paths.dest));
});

gulp.task('template', function () {
  gulp.src(paths.html)
    .pipe(htmlmin({ collapseWhitespace: true, removeComments: true }))
    .pipe(gulp.dest(paths.dest));
});

gulp.task('copy', function () {
  gulp.src(paths.json)
    .pipe(gulp.dest(paths.dest));
});

gulp.task('images', function () {
  gulp.src(paths.images)
    .pipe(imagemin([], {}))
    .pipe(gulp.dest(paths.dest));
});


gulp.task('default', (callback) => {
  runSequence('serve', 'generate-service-worker', callback);
});

gulp.task('watch', function () {
  gulp.watch(paths.styles, ['processCSS']);
  gulp.watch(paths.scripts, ['minify']);
});

gulp.task('serve', ['processCSS', 'minify', 'template', 'images', 'copy'], function () {
  browserSync.init({
    server: {
      baseDir: paths.dest,
      middleware: compression()
    },
    port: 4000
  });
  gulp.watch(paths.styles, ['processCSS']).on('change', browserSync.reload);
  gulp.watch(paths.scripts, ['minify']).on('change', browserSync.reload);
  gulp.watch(paths.html).on('change', browserSync.reload);
});
