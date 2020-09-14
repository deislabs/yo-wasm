const defaultProvider = {
  prompts() { return []; },
  instructions() { return []; },
  releaseTemplate() { return 'release.yml'; }
}

module.exports = defaultProvider;
