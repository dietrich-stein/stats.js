import { babel } from '@rollup/plugin-babel';
import terser from '@rollup/plugin-terser';

const config = {
  input: 'src/stats.js',
  output: [
    {
      file: 'build/stats.js',
      format: 'es'
    },
    {
      file: 'build/stats.min.js',
      format: 'es',
      plugins: [
        terser()
      ]      
    }
  ],
  plugins: [
    babel({
      presets: ['@babel/preset-env'],
      babelHelpers: 'bundled'
    })
  ]
};

export default config;