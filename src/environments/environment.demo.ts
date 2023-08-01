import PackageJson from "../../package.json";

export const environment = {
    production: true,
    appVersion: `v${PackageJson.version}`,
    appBuildDateTime: 'WEBPACK_BUILD_DATE_TIME',
    isMockEnabled: true,
    apiUrl: 'http://swiss-uat.artofinfo.eu',
    authenticationApiBasePath: "/api/authenticationwebservice",
    masterdataApiBasePath: "/api/masterdatamanagementcontroller",
    resourceApiBasePath: "/api/resourcemanagementcontroller",
    medicalApiBasePath: "/api/medicalmanagementcontroller",
    invoiceApiBasePath: "/api/invoicemanagementcontroller",
    dictionaryApiBasePath: "/api/dictionaryproviderwebservice",
    utilityApiBasePath: "/api/utilitywebservice11101",
    appThemeName: 'Metronic',
    appPurchaseUrl: 'https://1.envato.market/EA4JP',
    appDemos: {
        swiss: {
            title: 'Swiss Clinic',
            description: 'Default Dashboard',
            published: true,
            thumbnail: './assets/media/demos/demo1.png',
        },
    },
};
