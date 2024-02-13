module.exports = () => {
  return new Promise(resolve =>
    resolve({ System: ['OS', 'CPU'], Binaries: ['Node', 'npm'], options: { json: true } })
  );
};
