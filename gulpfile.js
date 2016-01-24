var gulp = require('gulp');
var nodemon = require('gulp-nodemon');
var gulpts = require('gulp-typescript');
var sourcemaps = require('gulp-sourcemaps');
var tsproject = gulpts.createProject('src/tsconfig.json');
var tslint = require('gulp-tslint');
var stylish = require('tslint-stylish');


var outputDir = '../build';



// run nodemon on server file changes
gulp.task('nodemon', function (cb) {
    return nodemon({
        script: outputDir+'/www.js',
        watch: [outputDir+'/*.js',outputDir+'/**/*.js']
    });
});

// TypeScript build for /src folder, pipes in .d.ts files from typings folder 
// var tsConfigSrc = tsb.create('src/tsconfig.json');
gulp.task('tscomp', function () {
   var tsResult = gulp.src(['typings/**/*.ts', 'src/**/*.ts'])
        .pipe(sourcemaps.init())
        .pipe(gulpts(tsproject));
   
   return tsResult.js
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(outputDir));

});


// TypeScript build for /src folder, pipes in .d.ts files from typings folder 
gulp.task('tscomp-deploy', function () {
   var tsResult = gulp.src(['typings/**/*.ts', 'src/**/*.ts'])
        .pipe(gulpts(tsproject));
   
   return tsResult.js
        .pipe(gulp.dest(outputDir));

});


// TSLint our TypeScript
gulp.task('tslint', function() {
    return gulp.src(['src/**/*.ts'])
        .pipe(tslint())
        .pipe(tslint.report(stylish, {
            emitError: false,
            sort: true,
            bell: true
        }))
});


// package.json for server modules
gulp.task('package.json', function() {
   return gulp.src(['package.json','.env','.gitignore'])
    .pipe(gulp.dest(outputDir)); 
});


// // if a file change is detected, run the TypeScript or LESS compile gulp tasks
gulp.task('watch', function () {
    gulp.watch('src/**/*.ts', ['tscomp']);
    //gulp.watch('tests/**/*.ts', ['buildTests']);
}); 

gulp.task('build', ['tslint', 'tscomp', 'package.json']);
gulp.task('build-deploy', ['tslint', 'tscomp-deploy', 'package.json']);
gulp.task('bd',['build-deploy']);
gulp.task('default', ['build']);
