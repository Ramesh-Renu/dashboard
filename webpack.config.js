const webpack = require('webpack');
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { ModuleFederationPlugin } = require("webpack").container;
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  mode: 'development',
  entry: "./src/index.js",
  output: {
    publicPath: "auto",
    path: path.resolve(__dirname, "build"),
  },
  devServer: {
    port: 3001,
    hot: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    historyApiFallback: {
      index: "/index.html",
    },
    static: path.join(__dirname, "public"),
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        include: path.resolve(__dirname, "src"),
        exclude: path.resolve(__dirname, "node_modules"),
        use: ["babel-loader"],
      },
      {
        test: /\.(scss|css)$/,
        use: ["style-loader", "css-loader", {
          loader: "sass-loader",
          options: {
            implementation: require("sass"),
            sassOptions: {
              quietDeps: true,
            },
          },
        }],       
      },      
      {
        test: /\.(png|jpeg|gif|jpg|svg|ttf)$/i,
        type: "file-loader",
      },
      {
        test: /\.(svg|png|jpg|jpeg|gif|wav)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'assets/[name][ext][query]'
        }
      },
      {
        test: /\.(eot|ttf|woff|woff2|svg)$/i,
        type: "asset/resource",
        generator: {
          filename: "fonts/[name].[contenthash][ext][query]",
        }
      }
    ],
  },
  resolve: {
    alias: { 
      "@": path.resolve(__dirname, "src"), // Map @ to src/
      "assets": path.resolve(__dirname, "src/assets"),
      "constant": path.resolve(__dirname, "src/constant"),
      "pages": path.resolve(__dirname, "src/pages"),
      "services": path.resolve(__dirname, "src/services"),
      "styles": path.resolve(__dirname, "src/styles"),
      "utils": path.resolve(__dirname, "src/utils"),
    },
    extensions: ['.js', '.jsx', '.json'], // Resolve JS and JSX files
  },
  // optimization: {
  //   splitChunks: {
  //     chunks: 'all',
  //   },
  // },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css",
    }),
    new ModuleFederationPlugin({
      name: "OrionDashboardApp",
      filename: "orionDashboardApp_remote.js",
      exposes: {
        // "./Dashboard": "./src/App",
        "./Dashboard": "./src/pages/Dashboard/Dashboard", // Ensure this path is correct

        /** STYLES */
        "./Styles": "./src/styles/index.scss",
      },
      remotes: {
        BaseApp: "BaseApp@http://localhost:3000/baseapp_remote.js",
        CommonModule: "CommonModule@http://localhost:3002/commonModule_remote.js",
      },
      shared: require('./package.json').dependencies,
      // {
      //   react: { singleton: true, eager: true, requiredVersion: '^18.2.0' }, // Make sure both apps use the same version
      //   'react-dom': { singleton: true, eager: true, requiredVersion: '^18.2.0' },
      //   'react-router-dom': { singleton: true,  eager: true, requiredVersion: '^6.14.1' },
      //   'react-redux': { singleton: true, eager: true, requiredVersion: '^8.1.1' },
      // },
    }),
    new HtmlWebpackPlugin({
      template: "src/index.html",
    }),
  ],
};
