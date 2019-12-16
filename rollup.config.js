// import serve from 'rollup-plugin-serve';
import postcss from 'rollup-plugin-postcss';
import sass from 'rollup-plugin-sass';
import babel from 'rollup-plugin-babel';
import uglify from 'rollup-plugin-uglify';
// import livereload from 'rollup-plugin-livereload';
// import sourcemaps from 'rollup-plugin-sourcemaps';
// import autoprefixer from 'autoprefixer';
// import eslint from 'rollup-plugin-eslint';

export default {
    input: 'src/Walnut.class.js',
    output: {
        file: 'build/walnut.js',
        format: 'es',
    },
    // sourcemap: true,
    plugins: [
        postcss({
            plugins: [
                // cssnext(),
                // yourPostcssPlugin()
            ],
            // sourceMap: false, // default value
            // extract: false, // default value
            extensions: ['.css', '.sss'], // default value
            // parser: sugarss
        }),
        sass({
            output: 'build/walnut.css',
        }),
        babel({ exclude: 'node_modules/**' }),
        uglify(),
    ],
};
