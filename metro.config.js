// Learn more https://docs.expo.dev/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname, {
  // Required for all Metro web projects.
  isCSSEnabled: true,
});

// 1. A fix for the 'import.meta' syntax error.
config.resolver.sourceExts.push('mjs');

// 2. A fix for packages using "exports" field with conditions.
// This is the key change that should resolve the issue.
config.resolver.unstable_conditionNames = [
  'browser',
  'require',
  'react-native',
];

module.exports = config;
