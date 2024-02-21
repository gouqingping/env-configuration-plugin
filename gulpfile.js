const gulp = require('gulp');
const babel = require('gulp-babel')
const uglify = require('gulp-uglify');
const typescript = require('gulp-typescript');
const tsProject = typescript.createProject('tsconfig.json');

gulp.task('build', () => {
  return gulp.src('core/**/*.ts')
    .pipe(tsProject())
    .pipe(gulp.dest('lib'));
});

gulp.task('compress', () => {
  return gulp.src('lib/**/*.js')
    .pipe(babel({ presets: ['@babel/preset-env'] }))
    .pipe(uglify())
    .pipe(gulp.dest('lib'));
});

gulp.task('default', gulp.series('build', 'compress'));