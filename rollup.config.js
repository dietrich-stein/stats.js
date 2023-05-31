import { babel } from '@rollup/plugin-babel';

const config = {
  input: 'src/Stats.js', //  entry: 'src/Stats.js',
  output: {
    file: 'build/stats.js',
    //dir: 'output',
    format: 'umd', //'es', // umd
    name: 'Stats',
  },
  plugins: [
    babel({ babelHelpers: 'bundled' })
  ]
};

export default config;