module.exports = {
  root: true,

  env: {
    node: true,
    browser: true,
    es2021: true
  },

  parserOptions: {
    ecmaVersion: 2021,
    parser: '@babel/eslint-parser',
    requireConfigFile: false,
    sourceType: 'module'
  },

  extends: [
    'airbnb-base',
    'plugin:vue/vue3-strongly-recommended'
  ],

  rules: {
    'no-new': 0,
    'comma-dangle': 0,
    radix: 0,
    'no-prototype-builtins': 0,
    'no-restricted-globals': 0,
    'no-underscore-dangle': 0,
    'vue/html-closing-bracket-newline': 0,
    'no-param-reassign': 0,
    'vue/block-order': ['error', {
      order: ['script', 'template', 'style']
    }],
    'import/no-unresolved': ['error', {
      ignore: ['^src/', '^styles/']
    }],
    'max-len': 150,
  },

  plugins: ['vue'],

  settings: {
    'import/resolver': {
      alias: {
        map: [
          ['src', './client/src/js'],
          ['styles', './client/src/styles']
        ],
        extensions: ['.js', '.vue', '.json', '.less']
      }
    }
  }
};
