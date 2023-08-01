import PackageJson from "../../package.json";

export const environment = {
    production: true,
    appVersion: `v${PackageJson.version}`,
    appBuildDateTime: 'WEBPACK_BUILD_DATE_TIME',
    isMockEnabled: true,
    apiUrl: 'http://ekarton3-api.ap4.hu',
    authenticationApiBasePath: ":11001",
    masterdataApiBasePath: ":11071",
    resourceApiBasePath: ":11031",
    medicalApiBasePath: ":11041",
    dictionaryApiBasePath: ":11021",
    utilityApiBasePath: ":11101",
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
