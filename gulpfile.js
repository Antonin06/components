const gulp = require("gulp");
const {series} = require("gulp");
const sass = require("gulp-sass")(require("node-sass"));
const cleanCSS = require("gulp-clean-css");
const uglify = require("gulp-uglify");
const browserSync = require('browser-sync').create();

let scssFiles = "./scss/**/*.scss";
// let jsFiles = "./js/**/*.js";
let jsFiles = [
	"./js/**/*.js",

	"./node_modules/bootstrap/dist/js/bootstrap.bundle.js",
];

let dist = "./dist";

function buildCss() {
	return gulp.src(scssFiles)
		.pipe(sass().on("error", sass.logError))
		.pipe(cleanCSS([{level: {1: {specialComments: 0}}}, {compatibility: "ie8"}]))
		.pipe(gulp.dest(dist))
}

function buildCssDev() {
	return gulp.src(scssFiles)
		.pipe(sass().on("error", sass.logError))
		.pipe(gulp.dest(dist))
		.pipe(browserSync.stream());
}

function buildJs() {
	return gulp.src(jsFiles)
		.pipe(uglify())
		.pipe(gulp.dest(dist));
}

function buildJsDev() {
	return gulp.src(jsFiles)
		.pipe(gulp.dest(dist))
		.pipe(browserSync.stream());
}

function watchChanges() {
	browserSync.init({
		server: {
			baseDir: "./",
			index: "./index.html",
		}
	});
	gulp.watch(scssFiles, buildCssDev);
	gulp.watch(jsFiles, buildJsDev);
	gulp.watch('./*.html').on('change',browserSync.reload);
}


exports.watch = watchChanges;
exports.build = series(buildCss,buildJs)

