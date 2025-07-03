const { TestEnvironment } = require('jest-environment-node');

class BrowserTestEnvironment extends TestEnvironment {
  constructor(config, context) {
    super(config, context);
    this.testPath = context.testPath;
    this.docblockPragmas = context.docblockPragmas;
  }

  async setup() {
    await super.setup();

    this.global.console = console;

    process.env.PUPPETEER_DISABLE_HEADLESS_WARNING = 'true';
  }

  async teardown() {
    await super.teardown();
  }

  getVmContext() {
    return super.getVmContext();
  }
}

module.exports = BrowserTestEnvironment;
