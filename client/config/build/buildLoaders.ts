import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { RuleSetRule } from 'webpack';

export function buildLoaders(isDev: boolean): RuleSetRule[] {
  return [
    {
      test: /\.(pdf|txt)$/,
      use: 'file-loader',
    },
    {
      test: /\.tsx?$/,
      use: 'ts-loader',
      exclude: /node_modules/,
    },
    {
      test: /\.css$/i,
      use: [isDev ? 'style-loader' : MiniCssExtractPlugin.loader,  'css-loader'],
      
    },
  ];
}

// {
//   test: /\.css$/i,
//   use: [isDev ? 'style-loader' : MiniCssExtractPlugin.loader,  {
//     loader: 'css-loader',
//     options:{
//        modules: {
//         localIdentName: isDev ? '[path][name]__[local]' : '[hash:base64:8]'
//     },
//     }
//   }],
// },