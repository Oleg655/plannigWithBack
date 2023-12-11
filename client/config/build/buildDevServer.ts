import type { Configuration as DevserverConfiguration } from 'webpack-dev-server';

import { BuildOption } from './types/config';

export function buildDevServer(options: BuildOption): DevserverConfiguration {
  return {
    port: options.port,
    open: true,
    historyApiFallback: true,
    hot: true,
    proxy: {
      "/planning": {
        target: "http://localhost:5000",
        secure: false,
        changeOrigin: true,
        headers: {
          Connection: "keep-alive",
        },
      },
    },
  };
}
