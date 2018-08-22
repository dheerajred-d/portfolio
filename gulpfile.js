'use strict';
/*!
GULP DEPENDENCIES
 npm install -g gulp gulp-sass browser-sync gulp-autoprefixer gulp-clean gulp-concat gulp-htmlmin gulp-inject-partials gulp-newer
 sudo npm link gulp gulp-sass browser-sync gulp-autoprefixer gulp-clean gulp-concat gulp-htmlmin gulp-inject-partials gulp-newer
*/
const gulp = require('gulp'),
    sass = require('gulp-sass'),
    browserSync = require('browser-sync'),
    reload = browserSync.reload,
    autoprefixer = require('gulp-autoprefixer'),
    clean = require('gulp-clean'),
    concat = require('gulp-concat'),
    newer = require('gulp-newer'),
    injectPartials = require('gulp-inject-partials'),
    htmlmin = require('gulp-htmlmin'),



    SOURCEPATHS = {
        sassSource: 'src/scss/*.scss',
        sassApp: 'src/scss/app.scss',
        htmlSource: 'src/*.html',
        htmlPartials: 'src/partials/*.html',
        jsSource: 'src/js/*.js',
        imgSource: 'src/img/**'
    },
    APPPATHS = {
        root: 'app/',
        css: 'app/css',
        js: 'app/js',
        img: 'app/img'
    };


// Tasks


// clean-html

gulp.task('clean-html', function () {
    return gulp.src(APPPATHS.root + '*.html', { read: false, force: true })
        .pipe(clean());
});

// clean-scripts

gulp.task('clean-scripts', function () {
    return gulp.src(APPPATHS.js + '/*.js', { read: false, force: true })
        .pipe(clean());
});



gulp.task('move-images', function () {
    return gulp.src(SOURCEPATHS.imgSource)
        .pipe(newer(APPPATHS.img))
        .pipe(gulp.dest(APPPATHS.img))
    //   gulp.dest(APPPATHS.img)
});
// sass watch 
gulp.task('sass-compile', function () {
    return gulp.src(SOURCEPATHS.sassApp)
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        // outputStyle : expanded for neat version.
        //outputStyle : compressed for minified css version.
        .pipe(sass({ outputStyle: 'expanded', sourcemap: true }).on('error', sass.logError))
        .pipe(gulp.dest(APPPATHS.css));
});

// scripts
gulp.task('scripts', ['clean-scripts'], function () {
    gulp.src(SOURCEPATHS.jsSource)
        .pipe(concat('main.js'))

        .pipe(gulp.dest(APPPATHS.js))
})


// copy partials and html
gulp.task('copy-htmlPartials', function () {
    return gulp.src(SOURCEPATHS.htmlSource)
        .pipe(injectPartials())
        .pipe(gulp.dest(APPPATHS.root))
});


// End of production tasks
// serve 
gulp.task('serve', ['sass-compile'], function () {
    browserSync.init([APPPATHS.css + '/*.css', APPPATHS.root + '/*.html', APPPATHS.js + '/*.js'], {
        server: {
            baseDir: APPPATHS.root
        }
    })
});



//   watch 
gulp.task('watch', ['serve', 'sass-compile', 'clean-html', 'clean-scripts', 'scripts', 'move-images', 'copy-htmlPartials'], function () {
    gulp.watch([SOURCEPATHS.sassSource, SOURCEPATHS.sassApp], ['sass-compile']);
    //
    gulp.watch([SOURCEPATHS.jsSource], ['scripts']);
    gulp.watch([SOURCEPATHS.htmlSource, SOURCEPATHS.htmlPartials], ['copy-htmlPartials']);
});



// default t1ask 
gulp.task('default', ['watch']);

