import { babel } from '@rollup/plugin-babel';

const config = {
  input: 'src/Stats.js',
  output: {
    file: 'build/stats.js',
    format: 'umd',
    name: 'Stats',
  },
  plugins: [
    babel({ babelHelpers: 'bundled' })
  ]
};

export default config;