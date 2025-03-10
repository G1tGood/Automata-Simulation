import { Config } from '@stencil/core';

export const config: Config = {
  namespace: 'automata-simulation',
  outputTargets: [
    {
      type: 'dist',
      esmLoaderPath: '../loader',
    },
    {
      type: 'dist-custom-elements',
    },
    {
      type: 'docs-readme',
    },
    {
      type: 'www',
      serviceWorker: null, // disable service workers
      copy: [
        { src: 'assets', dest: 'build/assets' }
      ]
    },
  ],
  testing: {
    browserHeadless: "new",
  },
};
