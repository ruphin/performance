import filesize from 'rollup-plugin-filesize';
import uglify from 'rollup-plugin-uglify';
import { uglifier } from 'uglify-es';
import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import * as path from 'path';

function getConfig({ name, input, dest, format, uglified = false, transpiled = false }) {
  return {
    input: input,
    output: { exports: 'named', file: dest, format, name: name },
    plugins: [
      transpiled && resolve(),
      transpiled &&
        babel({
          presets: [['env', { modules: false }]],
          plugins: ['external-helpers']
        }),
      uglified &&
        uglify(
          {
            warnings: true,
            toplevel: !transpiled,
            sourceMap: true,
            compress: { passes: 2 },
            mangle: { properties: false, keep_classnames: true, keep_fnames: true },
            keep_classnames: true,
            keep_fnames: true
          },
          uglifier
        ),
      filesize()
    ].filter(Boolean)
  };
}

const config = [
  getConfig({ name: 'LoginApp', input: 'src/index.js', dest: './index.js', format: 'es', transpiled: false, uglified: true }),
  getConfig({ name: 'LoginApp', input: 'src/index.js', dest: './index.nomodule.js', format: 'iife', transpiled: true, uglified: true })
];

export default config;
