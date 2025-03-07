const path = require('path');

module.exports = {
  entry: './src/main.tsx', // Punto di ingresso del tuo codice
  output: {
    filename: 'bundle.js', // Nome del file di output
    path: path.resolve(__dirname, 'dist'), // Cartella di destinazione
  },
  module: {
    rules: [
      {
        test: /\.[jt]sx?$/, // Rileva i file .ts
        use: 'babel-loader', // Usa Babel per compilare TypeScript
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'], // Rileva anche i file .ts
  },
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 9000,
  },
  mode: 'development', // Usa la modalità di sviluppo per il debug
};
