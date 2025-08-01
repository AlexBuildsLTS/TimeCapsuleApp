// Polyfills for web compatibility
import 'react-native-url-polyfill/auto';
import 'react-native-get-random-values';

// Add any other polyfills needed for web
if (typeof global === 'undefined') {
  global = globalThis;
}
