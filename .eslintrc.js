module.exports = {
  env: {
    node: true,
    es6: true,
    jest: true,
  },
  extends: ['airbnb-base/legacy', 'prettier'],
  parserOptions: {
    sourceType: 'module',
  },
  plugins: ['prettier'],
  rules: {
    'vars-on-top': 0,
    'no-param-reassign': 0,
    'prettier/prettier': ['error'],
  },
};
