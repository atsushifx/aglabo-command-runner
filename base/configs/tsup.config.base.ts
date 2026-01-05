// src: shared/configs/tsup.config.base.ts
// @(#) : tsup base configuration
//
// Copyright (c) 2025 atsushifx <https://github.com/atsushifx>
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

// libs
import process from 'node:process';
import { dirname } from 'path';
import path from 'path';
import { fileURLToPath } from 'url';

// types
import type { OnResolveArgs, OnResolveResult, Plugin as EsbuildPlugin } from 'esbuild';
import type { Options } from 'tsup';

// plugins
/**
 * alias -> absolute path convert plugin
 */
export const createAliasRewritePlugin = (aliases: Record<string, string>): EsbuildPlugin => ({
  name: 'alias-to-relative',
  setup(build) {
    build.onResolve({ filter: /.*/ }, (args) => {
      for (const key in aliases) {
        if (!args.path.startsWith(key)) { continue; }

        const mapped = args.path.replace(key, aliases[key]);
        const abs = path.resolve(mapped);

        return {
          path: abs, // return absolute path
        };
      }
      return null;
    });
  },
});

// ✅ __dirname for ESM
const __dirname = dirname(fileURLToPath(import.meta.url));

export const baseConfig: Options = {
  format: ['esm'],
  target: 'es2022',
  clean: true,
  dts: true,
  sourcemap: true,
  minify: false,
  splitting: false,
  shims: false,
  outDir: './lib',
  // overwrite it if sub-packages is necessary
  // entry: [  ],

  // 他の設定ファイルが自由に差し込めるよう空配列にしておく
  esbuildPlugins: [
    // 後で configs/tsup.config.esm.ts 側から上書きする
  ],
};
