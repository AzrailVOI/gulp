import * as del from 'del'
import gulp from 'gulp'
import babel from 'gulp-babel'
import cleanCSS from 'gulp-clean-css'
import concat from 'gulp-concat'
import pug from 'gulp-pug'
import gulpSass from 'gulp-sass'
import uglify from 'gulp-uglify'
import * as dartSass from 'sass'

const sass = gulpSass(dartSass)

const paths = {
	styles: {
		src: 'src/styles/**/*.scss',
		dest: 'dist/css/'
	},
	scripts: {
		src: 'src/scripts/**/*.js',
		dest: 'dist/js/'
	},
	pug: {
		src: 'src/**/*.pug',
		dest: 'dist/'
	}
}
export function clean() {
	return del.deleteAsync(['dist'])
}

export const styles = () => {
	return gulp
		.src(paths.styles.src, { sourcemaps: true })
		.pipe(sass.sync().on('error', sass.logError))
		.pipe(cleanCSS())
		.pipe(concat('main.min.css'))
		.pipe(gulp.dest(paths.styles.dest, { sourcemaps: '../sourcemaps/' }))
}

export const scripts = () => {
	return gulp
		.src(paths.scripts.src, { sourcemaps: true })
		.pipe(babel())
		.pipe(uglify())
		.pipe(concat('main.min.js'))
		.pipe(gulp.dest(paths.scripts.dest, { sourcemaps: '../sourcemaps/' }))
}

export const pugCompile = () => {
	return gulp
		.src(paths.pug.src)
		.pipe(
			pug({
				pretty: true,
				doctype: 'html'
			})
		)
		.pipe(gulp.dest(paths.pug.dest))
}

export const watch = () => {
	gulp.watch(paths.styles.src, styles)
	gulp.watch(paths.scripts.src, scripts)
	gulp.watch(paths.pug.src, pugCompile)
}

export const build = gulp.parallel(styles, scripts, pugCompile)
export default gulp.series(clean, build, watch)
