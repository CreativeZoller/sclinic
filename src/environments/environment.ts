import PackageJson from "../../package.json";

export const environment = {
    production: false,
    appVersion: `v${PackageJson.version}`,
    appBuildDateTime: 'WEBPACK_BUILD_DATE_TIME',
    isMockEnabled: true,
    apiUrl: 'http://swiss-test-frontend.artofinfo.eu/api',
    authenticationApiBasePath: "/authenticationwebservice",
    masterdataApiBasePath: "/masterdatamanagementcontroller",
    resourceApiBasePath: "/resourcemanagementcontroller",
    medicalApiBasePath: "/medicalmanagementcontroller",
    dictionaryApiBasePath: "/dictionaryproviderwebservice",
    utilityApiBasePath: "/utilitywebservice11101",
    invoiceApiBasePath: "/invoicemanagementcontroller",
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

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
