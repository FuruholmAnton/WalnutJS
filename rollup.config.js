import typescript from 'rollup-plugin-typescript';
import serve from 'rollup-plugin-serve';
import postcss from 'rollup-plugin-postcss';
import sass from 'rollup-plugin-sass';
import sourcemaps from 'rollup-plugin-sourcemaps';
// import autoprefixer from 'autoprefixer';
// import eslint from 'rollup-plugin-eslint';

export default {
    input: 'src/index.js',
    output: {
        file: 'app/index.js',
        format: 'cjs',
    },
    sourceMap: true,
    plugins: [
        // eslint(),

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
            output: 'app/bundle.css',
        }),
        typescript(),
        serve('app'),
    ],
};
