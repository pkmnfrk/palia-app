import path from "path";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";
import TerserWebpackPlugin from "terser-webpack-plugin";
import DotenvWebpackPlugin from "dotenv-webpack";

export default function(_env, argv) {
  const isProduction = argv.mode === "production";
  const isDevelopment = !isProduction;

  return {
    mode: isProduction ? "production" : "development",
    devtool: isDevelopment && "cheap-module-source-map",
    entry: "./src/index.js",
    output: {
      path: path.resolve("./dist"),
      filename: "assets/js/[name].[contenthash:8].js",
      publicPath: "/",
      clean: true,
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        cacheDirectory: true,
                        cacheCompression: false,
                        envName: isProduction ? "production" : "development",
                    }
                }
            },
            {
                test: /\.css$/,
                use: [
                    isProduction ? MiniCssExtractPlugin.loader : "style-loader",
                    "css-loader",
                ]
            },
            {
                test: /\.(png|jpg|gif)$/i,
                use: {
                    loader: "url-loader",
                    options: {
                        limit: 8192,
                        name: "static/media/[name].[hash:8].[ext]",
                    }
                }
            }
        ]
    },
    resolve: {
        extensions: [".js", ".jsx"],
    },
    plugins: [
        isProduction && new MiniCssExtractPlugin({
            filename: "assets/css/[name].[contenthash:8].css",
            chunkFilename: "assets/css/[name].[contenthash:8].chunk.css",
        }),
        new HtmlWebpackPlugin({
            template: path.resolve("./public/index.html"),
            inject: true,
        }),
        new DotenvWebpackPlugin({
            systemvars: true,
        }),
    ].filter(Boolean),
    optimization: {
        minimize: isProduction,
        minimizer: [
            new TerserWebpackPlugin({
                terserOptions: {
                    compress: {
                        comparisons: false,
                    },
                    mangle: {
                        safari10: true,
                    },
                    output: {
                        comments: false,
                        ascii_only: true,
                    },
                    warnings: false,
                }
            })
        ]
    },
    devServer: {
        compress: true,
        historyApiFallback: true,
        // open: true,
        // overlay: true,

    }
  };
}