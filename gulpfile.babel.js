import glob from 'glob';
import gulp from 'gulp';
import gutil from 'gulp-util';
import gulpIf from 'gulp-if';
import babel from 'gulp-babel';
import plumber from 'gulp-plumber';
import less from 'gulp-less';
import prefix from 'gulp-autoprefixer';
import minify from 'gulp-cssnano';
import uglify from 'uglifyify';
import concat from 'gulp-concat';
import browserify from 'browserify';
import babelify from 'babelify';
import source from 'vinyl-source-stream';
import buffer from 'vinyl-buffer';
import eventStream from 'event-stream';

const MODULES_PATH = './node_modules';
const SRC_PATH = `app/assets`;
const DIST_PATH = `public/assets`;

const sharedBuildConfig = {
	less: {
		src: [`${SRC_PATH}/stylesheets/*.less`],
		dist: `${DIST_PATH}/stylesheets/`
	},
	js: {
		src: `${SRC_PATH}/javascripts/*.js`,
		dist: `${DIST_PATH}/javascripts/`
	}
};

const babelOptions = {
	presets: [
		'es2015',
		'stage-0',
		'react'
	]
};

const prefixOptions = {
	cascade: false,
	browsers: [
		'last 3 versions'
	]
};

gulp.task('images', () => {
	gulp.src(sharedBuildConfig.img.src)
		.pipe(gulp.dest(sharedBuildConfig.img.dist));
});

gulp.task('stylesheets', () => {
	gulp.src(sharedBuildConfig.less.src)
		.pipe(plumber())
		.pipe(less())
		.pipe(prefix(prefixOptions))
		.pipe(gulpIf(gutil.env.type === 'production', minify()))
		.pipe(plumber.stop())
		.pipe(gulp.dest(sharedBuildConfig.less.dist));
});

gulp.task('javascripts', () => {
	let bundle;
	let sourceFilePaths = glob.sync(sharedBuildConfig.js.src);
	let streams = sourceFilePaths.map((entry) => {
		let dist = entry.replace(`${SRC_PATH}/javascripts/`, '');
		if(gutil.env.type === 'production') {
			bundle = browserify({ entries: [entry] })
				.transform(babelify)
				.transform(uglify)
				.bundle();
		} else {
			bundle = browserify({ entries: [entry] })
				.transform(babelify)
				.bundle();
		}
		return bundle
			.pipe(plumber())
			.pipe(source(dist))
			.pipe(buffer())
			.pipe(plumber.stop())
			.pipe(gulp.dest(sharedBuildConfig.js.dist));
	});

	return eventStream.merge.apply(null, streams);
});

gulp.task('set-env', () => {
	return process.env.NODE_ENV = 'production';
});

gulp.task('watch', () => {
	gulp.watch(`${SRC_PATH}/stylesheets/**/*.less`, ['stylesheets']);
	gulp.watch(`${SRC_PATH}/javascripts/**/*.js`, ['javascripts']);
});

gulp.task('build', [ 'stylesheets', 'javascripts' ]);

gulp.task('default', [ 'watch', 'build' ]);
