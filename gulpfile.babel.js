// generated on 2016-02-03 using generator-gulp-webapp 1.1.1
import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import browserSync from 'browser-sync';
import del from 'del';
import { stream as wiredep } from 'wiredep';

let browserify = require('browserify');
let source = require('vinyl-source-stream');
let tsify = require('tsify');
let paths = {
    pages: ['app/*.html'],
};

let ts = require('gulp-typescript');
let tsProject = ts.createProject('tsconfig.json');
let concat = require('gulp-concat');

const $ = gulpLoadPlugins();
const reload = browserSync.reload;

gulp.task('walnutStyles', () => {
  return gulp.src('app/walnut/*.scss')
    .pipe($.plumber())
    .pipe($.sourcemaps.init())
    .pipe($.sass.sync({
      outputStyle: 'expanded',
      precision: 10,
      includePaths: ['.'],
    }).on('error', $.sass.logError))
    .pipe($.autoprefixer({ browsers: ['> 1%', 'last 2 versions', 'Firefox ESR'] }))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest('app/walnut/styles'))
    .pipe(reload({ stream: true }));
});
gulp.task('styles', () => {
  return gulp.src('app/styles/*.scss')
    .pipe($.plumber())
    .pipe($.sourcemaps.init())
    .pipe($.sass.sync({
      outputStyle: 'expanded',
      precision: 10,
      includePaths: ['.'],
    }).on('error', $.sass.logError))
    .pipe($.autoprefixer({ browsers: ['> 1%', 'last 2 versions', 'Firefox ESR'] }))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest('.tmp/styles'))
    .pipe(reload({ stream: true }));
});

// gulp.task('scripts', () => {
//   return gulp.src('app/walnut/**/*.js')
//     .pipe(
//         concat('walnut.js'))
//     .pipe($.plumber())
//     .pipe($.sourcemaps.init())
//     .pipe($.babel())
//     .pipe($.sourcemaps.write('.'))
//     .pipe(gulp.dest('.tmp/scripts'))
//     .pipe(reload({stream: true}));
// });

gulp.task('typescript', function() {
    return browserify({
        basedir: '.',
        debug: true,
        entries: ['app/walnut/Walnut.class.ts'],
        cache: {},
        packageCache: {},
    })
    .plugin(tsify)
    .bundle()
    .on('error', function(err) {
      // print the error (can replace with gulp-util)
      console.log(err.message);
      // end this stream
      this.emit('end');
    })
    .pipe(source('walnut.js'))
    .pipe(gulp.dest('app/walnut'));
});


gulp.task('html', ['styles', 'scripts'], () => {
  return gulp.src('app/*.html')
    .pipe($.useref({ searchPath: ['.tmp', 'app', '.'] }))
    .pipe($.if('*.js', $.uglify()))
    .pipe($.if('*.css', $.cssnano()))
    .pipe($.if('*.html', $.htmlmin({ collapseWhitespace: true })))
    .pipe(gulp.dest('dist'));
});

gulp.task('images', () => {
  return gulp.src('app/walnut/images/**/*')
    .pipe($.if($.if.isFile, $.cache($.imagemin({
      progressive: true,
      interlaced: true,
      // don't remove IDs from SVGs, they are often used
      // as hooks for embedding and styling
      svgoPlugins: [{ cleanupIDs: false }],
    }))
    .on('error', function(err) {
      console.log(err);
      this.end();
    })))
    .pipe(gulp.dest('dist/images'));
});

gulp.task('fonts', () => {
  return gulp.src(require('main-bower-files')('**/*.{eot,svg,ttf,woff,woff2}', function(err) {})
    .concat('app/fonts/**/*'))
    .pipe(gulp.dest('.tmp/fonts'))
    .pipe(gulp.dest('dist/fonts'));
});

gulp.task('extras', () => {
  return gulp.src([
    'app/*.*',
    '!app/*.html',
  ], {
    dot: true,
  }).pipe(gulp.dest('dist'));
});

gulp.task('clean', del.bind(null, ['.tmp', 'dist']));

gulp.task('serve', ['walnutStyles', 'styles', 'typescript', 'fonts'], () => {
  browserSync({
    notify: false,
    port: 9000,
    server: {
      baseDir: ['.tmp', 'app'],
      routes: {
        '/bower_components': 'bower_components',
      },
    },
  });

  gulp.watch([
    'app/*.html',
    'app/walnut/**/*.js',
    'app/walnut/images/**/*',
    '.tmp/fonts/**/*',
  ]).on('change', reload);

  gulp.watch('app/styles/**/*.scss', ['styles']);
  gulp.watch('app/walnut/**/*.scss', ['walnutStyles']);
  gulp.watch('app/walnut/**/*.ts', ['typescript']);
  gulp.watch('app/fonts/**/*', ['fonts']);
  gulp.watch('bower.json', ['wiredep', 'fonts']);
});

gulp.task('serve:dist', () => {
  browserSync({
    notify: false,
    port: 9000,
    server: {
      baseDir: ['dist'],
    },
  });
});

gulp.task('serve:test', ['scripts'], () => {
  browserSync({
    notify: false,
    port: 9000,
    ui: false,
    server: {
      baseDir: 'test',
      routes: {
        '/scripts': '.tmp/scripts',
        '/bower_components': 'bower_components',
      },
    },
  });

  gulp.watch('app/scripts/**/*.js', ['scripts']);
  gulp.watch('test/spec/**/*.js').on('change', reload);
  gulp.watch('test/spec/**/*.js', ['lint:test']);
});

// inject bower components
gulp.task('wiredep', () => {
  gulp.src('app/styles/*.scss')
    .pipe(wiredep({
      ignorePath: /^(\.\.\/)+/,
    }))
    .pipe(gulp.dest('app/styles'));

  gulp.src('app/*.html')
    .pipe(wiredep({
      ignorePath: /^(\.\.\/)*\.\./,
    }))
    .pipe(gulp.dest('app'));
});

gulp.task('distScript', () => {
  return gulp.src('app/walnut/**/*.js')
    .pipe(
        concat('walnut.js'))
    .pipe($.plumber())
    .pipe($.sourcemaps.init())
    .pipe($.babel())
    .pipe($.uglify())
    .pipe(gulp.dest('walnut/'))
    .pipe(reload({ stream: true }));
});

gulp.task('distStyles', () => {
  return gulp.src('app/walnut/*.scss')
    .pipe($.plumber())
    .pipe($.sass.sync({
      outputStyle: 'compressed',
      precision: 10,
      includePaths: ['.'],
    }).on('error', $.sass.logError))
    .pipe($.autoprefixer({ browsers: ['> 1%', 'last 2 versions', 'Firefox ESR'] }))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest('walnut/styles'))
    .pipe(reload({ stream: true }));
});

gulp.task('distImages', () => {
  return gulp.src('app/walnut/images/**/*')
    .pipe($.if($.if.isFile, $.cache($.imagemin({
      progressive: true,
      interlaced: true,
      // don't remove IDs from SVGs, they are often used
      // as hooks for embedding and styling
      svgoPlugins: [{ cleanupIDs: true }],
    }))
    .on('error', function(err) {
      console.log(err);
      this.end();
    })))
    .pipe(gulp.dest('walnut/images'));
});

gulp.task('build', ['distScript', 'distStyles', 'distImages'], () => {
  // return gulp.src('dist/**/*').pipe($.size({title: 'build', gzip: true}));
});

gulp.task('default', ['clean'], () => {
  gulp.start('build');
});
