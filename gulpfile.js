/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
"use strict";

var gulp = require('gulp');
var sass = require('gulp-sass');
var plumber = require('gulp-plumber');
var sourcemaps = require('gulp-sourcemaps');
var notify = require('gulp-notify');
var watch = require('gulp-watch');

var stylesheets = "public/css";

gulp.task('styles', function () {
    return gulp.src("sources/scss/**/*.*")
            .pipe(plumber({
                errorHandler: notify.onError(function (err) {
                    return {
                        title: "addStyles",
                        error: err.message
                    };
                })
            }))
            .pipe(sourcemaps.init())
            .pipe(sass())
            .pipe(sourcemaps.write())
            .pipe(gulp.dest(stylesheets));
});

gulp.task('content', function () {
    return gulp.src(["sources/**/*.*", "!sources/scss/**/*.*", "!sources/templates/**/*.*"], {since: gulp.lastRun('content')})
            .pipe(plumber({
                errorHandler: notify.onError(function (err) {
                    return {
                        title: "addStyles",
                        error: err.message
                    };
                })
            }))
            .pipe(gulp.dest('public'));
});

gulp.task('watch', function () {
    gulp.watch("sources/scss/**/*.*", gulp.series('styles'));
    gulp.watch(["sources/**/*.*", "!sources/scss/**/*.*"], gulp.series('content'));
});
