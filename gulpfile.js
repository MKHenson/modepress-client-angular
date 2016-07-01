var gulp = require('gulp');
var fs = require('fs');
var ts = require('gulp-typescript');
var uglify = require("gulp-uglify");
var download = require('gulp-download');
var rename = require('gulp-rename');

// CONFIG
// ==============================
var outDir = "./dist";
var tsConfig = JSON.parse(fs.readFileSync('tsconfig.json'));
var tsFiles = tsConfig.files;
var tsConfigGulp = {
    "module": tsConfig.compilerOptions.module,
    "removeComments": tsConfig.compilerOptions.removeComments,
    "noEmitOnError": tsConfig.compilerOptions.noEmitOnError,
    "declaration": tsConfig.compilerOptions.declaration,
    "sourceMap": tsConfig.compilerOptions.sourceMap,
    "preserveConstEnums": tsConfig.compilerOptions.preserveConstEnums,
    "target": tsConfig.compilerOptions.target,
    "noImplicitAny": tsConfig.compilerOptions.noImplicitAny,
    "allowUnreachableCode": tsConfig.compilerOptions.allowUnreachableCode,
    "allowUnusedLabels": tsConfig.compilerOptions.allowUnusedLabels,
    "outFile": tsConfig.compilerOptions.outFile
};

/**
 * Checks to see that all TS files listed exist
 */
gulp.task('check-files', function() {
    // Make sure the files exist
    for (var i = 0, l = tsFiles.length; i < l; i++ )
        if(!fs.existsSync(tsFiles[i]))
        {
            console.log("File does not exist:" + tsFiles[i] );
            process.exit();
        }
});

/**
 * Builds each of the ts files into JS files in the output folder
 */
gulp.task('generate-definions', ['check-files'], function() {

     return gulp.src(tsFiles, { base: "." })
        .pipe(ts( tsConfigGulp ))
        .dts
        .pipe(gulp.dest("./src/definitions/generated"));
});

/**
 * Builds each of the ts files into JS files in the output folder
 */
gulp.task('ts-code', ['check-files', 'generate-definions'], function() {
    return gulp.src(tsFiles, { base: "." })
        .pipe(ts( tsConfigGulp ))
        .pipe(gulp.dest(outDir));
});

/**
 * Builds each of the ts files into JS files in the output folder. Also performs an uglify on the code to make it compact.
 */
gulp.task('ts-code-release', ['check-files', 'generate-definions'], function() {
    return gulp.src(tsFiles, { base: "." })
        .pipe(ts( tsConfigGulp ))
        .pipe(uglify())
        .pipe(gulp.dest(outDir));
});

/**
 * This function downloads a definition file from github and writes it to a destination
 * @param {string} url The url of the file to download
 * @param {string} dest The destination folder to move the file to
 */
function getDefinition(url, dest, name) {
    return new Promise(function(resolve, reject) {
        download(url)
            .pipe(rename(name))
            .pipe(gulp.dest(dest))
            .on('error', function(err) {
                throw(err)
            })
            .on('end', function() {
                resolve(true);
            })
    });
}

/**
 * Downloads the definition files used in the development of the application and moves them into the definitions folder
 */
gulp.task('install-definitions', function () {
     return Promise.all([
            getDefinition("https://raw.githubusercontent.com/MKHenson/users/dev/src/definitions/custom/definitions.d.ts", "src/definitions/required/", "users.d.ts"),
            getDefinition("https://raw.githubusercontent.com/MKHenson/modepress/dev/server/src/definitions/custom/modepress-api.d.ts", "src/definitions/required/", "modepress-api.d.ts")
         ]);
});

gulp.task('install', [ 'install-definitions']);
gulp.task('build-all', [ 'ts-code']);
gulp.task('build-all-release', [ 'ts-code-release ']);