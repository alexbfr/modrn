// karma.conf.js
module.exports = function(config) {
    config.set({
        basePath: 'js',
        plugins: ["karma-jasmine", "karma-typescript"],
        frameworks: ['jasmine', 'karma-typescript'],
        files: [
            'source/**/*.ts'
        ],
        preprocessors: {
            "**/*.ts": "karma-typescript" // *.tsx for React Jsx
        },
        bundleOptions:{
            sourceMap: true
        },
        coverageOptions:{
            instrumentation : false
        },
        karmaTypescriptConfig: {
            coverageOptions: {
                instrumentation: false
            },
            compilerOptions: {
                target: "es6",
                lib: [
                    "dom",
                    "es2017",
                    "ESNext"
                ],
                moduleResolution: "Node",
                esModuleInterop: true,
            },
            reports: {}, // Disables the code coverage report
        },
    });
};