import babel from 'rollup-plugin-babel';

export default {
  entry: 'src/Stats.js',
  output: {
    file: 'build/stats.js',
    format: 'umd',
    name: 'Stats',
  },
  plugins: [
     babel(),
  ],
};
