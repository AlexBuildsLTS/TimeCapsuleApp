module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./'],
          alias: {
            '@/app': './app',
            '@/assets': './assets',
            '@/components': './components',
            '@/config': './config',
            '@/constants': './constants',
            '@/hooks': './hooks',
            '@/services': './services',
            '@/store': './store',
            '@/types': './types',
          },
        },
      ],
      'react-native-reanimated/plugin',
    ],
  };
};
