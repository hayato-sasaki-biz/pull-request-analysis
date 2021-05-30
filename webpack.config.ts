import path from "path";
import { TsconfigPathsPlugin } from "tsconfig-paths-webpack-plugin";
import webpack from "webpack";

import GasPlugin from "gas-webpack-plugin";
import CopyFilePlugin from "copy-webpack-plugin";

const config: webpack.Configuration = {
  mode: "production",
  entry: path.resolve(__dirname, "src/index.ts"),
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "index.js",
  },
  resolve: {
    extensions: [".ts", ".js"],
    plugins: [
      new TsconfigPathsPlugin({
        configFile: path.resolve(__dirname, "tsconfig.json"),
      }),
    ],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        loader: "ts-loader",
      },
    ],
  },
  plugins: [
    new GasPlugin(),
    new CopyFilePlugin({
      patterns: [
        {
          from: "src/appsscript.json",
          to: path.resolve(__dirname, "dist"),
        },
      ],
    }),
  ],
};
export default config;
