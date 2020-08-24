import { Config } from '@stencil/core';

// https://stenciljs.com/docs/config

export const config: Config = {
  srcDir: 'src/popup',
  globalStyle: 'src/popup/global/app.css',
  globalScript: 'src/popup/global/app.ts',
  taskQueue: 'async',
  buildEs5: false,
  outputTargets: [
    {
      type: 'www',
      dir: 'dist/popup',
      serviceWorker: null,
    },
  ],
};
