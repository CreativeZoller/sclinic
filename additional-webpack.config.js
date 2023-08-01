const webpack = require("webpack");

module.exports = (config, options) => {
    // Need to polyfill some nodejs API-s
    config.resolve.fallback = {
        // Needed for "file-type"
        stream: require.resolve("stream-browserify"),
    };

    const appBuildDateTime = new Date().toISOString();
    config?.module?.rules?.push(
        {
            test: /\.[jt]s$/,
            loader: 'string-replace-loader',
            enforce: 'post',
            options: {
                search: 'WEBPACK_BUILD_DATE_TIME',
                replace: appBuildDateTime,
                flags: 'g'
            }
        }
    )

    config?.plugins?.push(
        // Note: "node:" imports not supported yet with angular
        new webpack.NormalModuleReplacementPlugin(/node:/, (resource) => {
            resource.request = resource.request.replace(/^node:/, '');
        }),
    );

    return config;
};
