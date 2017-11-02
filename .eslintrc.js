module.exports = {
  env: {
    node: true
  },
  extends: ['airbnb-base/legacy', 'prettier'],
  parserOptions: {
    sourceType: 'module'
  },
  plugins: ['prettier'],
  rules: {
    'vars-on-top': 0,
    'prettier/prettier': ['error']
  },
};
