const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')


module.exports = {
    entry:'./src/index.js',
    output:{
        filename:'bundle.js',
        path:path.resolve(__dirname,'dist')
    },
    devtool:'source-map',//可以将错误显示在chrome上
    resolve:{
        // 配置模块
        modules:[path.resolve(__dirname,''),path.resolve(__dirname,'node_modules')]//先找根目录的模块，再去找node_modules里的模块
    },
    devServer: {
        open:true,
      },
    plugins:[
        new HtmlWebpackPlugin({
            template:path.resolve(__dirname,'public/index.html')//配置模板，放到index.html上面
        })
    ]
}