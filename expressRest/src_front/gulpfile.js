const babelify = require('babelify')
const browserify = require('browserify')
const buffer = require('vinyl-buffer')
const source = require('vinyl-source-stream')
const gulp = require('gulp');
const sass = require('gulp-sass');
const babel = require('gulp-babel');
const watch = require("gulp-watch");
const uglify = require('gulp-uglify');
const plumber = require('gulp-plumber');
const sourcemaps = require('gulp-sourcemaps');
const browserSync = require('browser-sync').create()

gulp.task('es6', function () {
    browserify({entries: './es6/app.es6', debug: true})
        .transform(babelify)
        .bundle()
        .on('error', err => console.log('Error : ' + err.message))
        .pipe(source('app.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true}))
        // .pipe(uglify())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('../public/javascripts'))
        .pipe(browserSync.reload({stream: true}))
});

gulp.task('sass', function(){
    gulp.src('./sass/*.scss')
      .pipe(sass())
      .pipe(gulp.dest('../public/stylesheets'));
  });

// gulp.task('copy', () => {
//     gulp.src('./src/index.html').pipe(gulp.dest("./dest"));
//     gulp.src('./src/view/**/*.html').pipe(gulp.dest("./dest/pages"));
//     gulp.src('./src/lib/js/**/*').pipe(gulp.dest("./dest/js"));
//     gulp.src('./src/lib/css/**/*').pipe(gulp.dest("./dest/css"));
//     gulp.src('./src/lib/fonts/**/*').pipe(gulp.dest("./dest/fonts"));
//     gulp.src('./src/assets/**/*').pipe(gulp.dest("./dest/assets"));
// });

// gulp.task('browserSync', () => {
//     browserSync.init({
//         server: {
//             baseDir: "dest",
//             index: "index.html"
//         }
//     });
// });

// gulp.task('browserSync-reload', () => {
//     browserSync.reload();
// });

gulp.task('watch', () => {
    watch(['./src/sass/**'], (evt) => gulp.start("sass"));
    watch(['./src/es6/**'], (evt) => gulp.start("es6"));
    // watch(['./src/lib/**'], (evt) => gulp.start("copy"));
    // watch(['./src/**/*.html'], (evt) => gulp.start("copy"));
    // watch(['./dest/**/*'], (evt) => gulp.start('browserSync-reload'));
});

gulp.task('default', ['es6', 'sass', /*'copy',*/ 'watch'/*, 'browserSync'*/]);