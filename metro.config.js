// Learn more https://docs.expo.dev/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname, {
  isCSSEnabled: true,
});

// 1. A fix for the 'import.meta' syntax error.
config.resolver.sourceExts.push('mjs', 'cjs');

// 2. A fix for packages using "exports" field with conditions.
config.resolver.unstable_conditionNames = [
  'browser',
  'require',
  'react-native',
];

// 3. A fix for SVG files.
config.resolver.assetExts = config.resolver.assetExts.filter(ext => ext !== 'svg');
config.resolver.sourceExts.push('svg');

module.exports = config;
