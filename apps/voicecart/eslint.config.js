// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

/** Soft boundary: features should not import other features (cores/globals OK). */
const featureBoundary = {
  files: ['features/rn-feature-*/**/*.{ts,tsx}'],
  rules: {
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          {
            group: ['@voicecart/rn-feature-*', '!@voicecart/rn-feature-*-core'],
            message:
              'Feature packages must not import other features. Use your *-core, @voicecart/rn-theme, or @voicecart/rn-ui.',
          },
        ],
      },
    ],
  },
};

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ['dist/*'],
  },
  featureBoundary,
]);
