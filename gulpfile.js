var gulp = require('gulp'),
    argv = require('yargs').argv,
    sass = require('gulp-sass')(require('sass')),
    sassVariables = require('gulp-sass-variables'),
    webpack = require('webpack-stream'),
    replace = require('gulp-replace'),
    fs = require('fs'),
    manifestBuilder = require('./src/js/util/manifest-builder');

var supportedTargets = require('./build/targets');
if (supportedTargets.indexOf(argv.target) === -1) {
    console.error(`Target "${argv.target}" is not supported. Please use one of the following targets: ${supportedTargets.join(', ')}. Example usage: gulp [task-name] --target=chrome`);
    process.exit();
}

var buildVersion = argv.buildVersion;
if (typeof buildVersion === 'undefined' || buildVersion === null || buildVersion === "") {
    buildVersion = require('./package.json').version;
}

gulp.task('sass-ui', function () {
    return gulp.src('src/sass/ui/*.scss')
        .pipe(sassVariables({
            $target: argv.target
        }))
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest(`dist/${argv.target}/ui/css`));
});

gulp.task('js-ui', function () {
    var pkg = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
    return gulp.src(['src/js/ui/*.js', 'src/assets/lib/*.js'])
        .pipe(replace('__VERSION__', pkg.version))
        .pipe(gulp.dest(`dist/${argv.target}/ui/js`));
});

gulp.task('html-ui', function () {
    return gulp.src(['src/html/ui/*.htm?(l)'])
        .pipe(gulp.dest(`dist/${argv.target}/ui`));
});

gulp.task('img', function () {
    return gulp.src(['src/assets/img/**/*'])
        .pipe(gulp.dest(`dist/${argv.target}/img`));
});

gulp.task('js', function () {
    var pkg = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
    var v = pkg.version;

    var paneHtml = fs.readFileSync('src/html/ui/pane.html', 'utf8')
        .replace(/^\uFEFF/, '') // Strip BOM
        .replace(/__VERSION__/g, v) // Replace version placeholder
        .replace(/`/g, '\\`') // Escape backticks
        .replace(/\$/g, '\\$'); // Escape dollar signs

    // Copy API Bridges
    if (argv.target == 'edge') {
        return gulp.src(['src/assets/lib/edge/*.js'])
            .pipe(gulp.dest(`dist/${argv.target}`))
            .on('end', function () {
                gulp.src(['src/js/*.js'])
                    .pipe(replace('__PANE_HTML__', paneHtml))
                    .pipe(gulp.dest(`dist/${argv.target}/js`));
            });
    }

    return gulp.src(['src/js/*.js'])
        .pipe(replace('__PANE_HTML__', paneHtml))
        .pipe(replace('__VERSION__', v))
        .pipe(gulp.dest(`dist/${argv.target}/js`));
});

gulp.task('ui', gulp.series(gulp.parallel('html-ui', 'js-ui', 'sass-ui')));

gulp.task('increment-version', function (cb) {
    if (argv.noinc) {
        console.log('Version increment skipped.');
        cb();
        return;
    }

    // Read package.json to get and increment version
    var pkg = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
    var versionParts = pkg.version.split('.');

    // Ensure we have at least 3 parts for x.y.z, otherwise pad with 0s
    while (versionParts.length < 3) versionParts.push("0");

    // Increment the last part
    versionParts[versionParts.length - 1] = parseInt(versionParts[versionParts.length - 1]) + 1;
    var newVersion = versionParts.join('.');

    // Update package.json back to disk
    pkg.version = newVersion;
    fs.writeFileSync('./package.json', JSON.stringify(pkg, null, 2));

    console.log('Build Version incremented to: ' + newVersion);
    cb();
});

gulp.task('manifest-only', function (cb) {
    var pkg = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
    var manifest = manifestBuilder.build(argv.target, pkg.version);
    var manifestJson = JSON.stringify(manifest, null, 2);
    fs.writeFile(`dist/${argv.target}/manifest.json`, manifestJson, cb);
});

gulp.task('manifest', gulp.series('increment-version', gulp.parallel('ui', 'img', 'js'), 'manifest-only'));

gulp.task('build', gulp.series('manifest'));
gulp.task('default', gulp.series('build'));
