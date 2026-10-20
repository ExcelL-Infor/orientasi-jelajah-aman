const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Tambahkan ekstensi .wasm agar dikenali oleh Metro bundler (diperlukan expo-sqlite untuk web)
config.resolver.assetExts.push('wasm');

module.exports = config;