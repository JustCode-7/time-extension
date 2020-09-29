// eslint-disable-next-line no-undef
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: [
    'src/background',
    'src/content-scripts',
    'src/shared',
  ]
};
