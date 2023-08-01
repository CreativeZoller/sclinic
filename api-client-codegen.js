const package = require("./package.json");
const { exec } = require("child_process");
const fs = require("fs").promises;
const path = require("path");
const cliColor = require("cli-color");


/**
 * Fill this array with the data of the endpoints
 */
const apiDescriptors = [
    { name: "authentication", defaultBasePath: "/api/authentication", swaggerUrl: "http://localhost:11001/swagger/v1/swagger.json"},
    { name: "masterdata", defaultBasePath: "/api/masterdata", swaggerUrl: "http://localhost:11071/swagger/v1/swagger.json"},
    { name: "resource", defaultBasePath: "/api/resource", swaggerUrl: "http://localhost:11031/swagger/v1/swagger.json"},
    { name: "medical", defaultBasePath: "/api/medical", swaggerUrl: "http://localhost:11041/swagger/v1/swagger.json"},
    { name: "invoice", defaultBasePath: "/api/invoice", swaggerUrl: "http://localhost:11051/swagger/v1/swagger.json"},
    { name: "dictionary", defaultBasePath: "/api/dictionary", swaggerUrl: "http://localhost:11021/swagger/v1/swagger.json"},
    { name: "utility", defaultBasePath: "/api/utility", swaggerUrl: "http://localhost:11101/swagger/v1/swagger.json"},
]

async function exists(path) {
    try {
        await fs.access(path)
        return true
    } catch (e) {
        /* Ignore */
    }

    return false
}

const commands = apiDescriptors.map(({name: apiName, defaultBasePath, swaggerUrl: url}) => {
    return async () => {
        const folder = path.resolve(`./src/api/generated/${apiName}`);
        console.log(`> ${cliColor.inverse(apiName)} -- Processing`)

        if (await exists(folder)) {
            console.log(`> ${cliColor.inverse(apiName)} -- Removing old files`)
            await fs.rm(folder, { recursive: true, force: true, maxRetries: 2 });
        }

        const CliSpinner = (await import("ora")).default

        // Execute command asynchronously
        await new Promise((resolve, reject) => {
            const spinner = CliSpinner({
                spinner: {
                    interval: 125,
                    frames: [ "∙∙∙", "●∙∙", "∙●∙", "∙∙●", "∙∙∙" ],
                },
                prefixText: `> ${cliColor.inverse(apiName)} -- Generating client`
            })
            spinner.start();

            const genProcess = exec(
                `docker run --rm --net=host -v ${__dirname}:/local swaggerapi/swagger-codegen-cli-v3 generate \
                -i ${url} \
                -l typescript-angular \
                -o /local/src/api/generated/${apiName} \
                --type-mappings Date=string \
                --disable-examples \
                --reserved-words-mappings function=function delete=delete \
                --additional-properties ngVersion=${package.dependencies["@angular/core"]} modelPropertyNaming=original supportsES6=true`,
                { stdio: "pipe", shell: true },
                (error) => {
                    spinner.stop();
                    console.log(`> ${cliColor.inverse(apiName)} -- Generating client`);

                    if (error) reject(error);
                    else resolve();
                }
            );

            genProcess.stderr.pipe(process.stderr)
            // Do not pollute with unnecessary logs!
            // genProcess.stdout.pipe(process.stdout)
        });

        await fs.writeFile(
            path.resolve(folder, "api.module.ts"),
`import { NgModule } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BASE_PATH } from './variables';
import { APIS } from './api/api';


@NgModule({
    imports: [
    ],
    providers: [
        { provide: BASE_PATH, useValue: (environment?.apiUrl ?? "") + (environment?.${apiName}ApiBasePath ?? "${defaultBasePath}") },
        ...APIS,
    ]
})
export class ${apiName.substring(0, 1).toUpperCase() + apiName.substring(1).toLowerCase()}ApiModule { }`
        );


        console.log(`> ${cliColor.inverse(apiName)} -- Removing unnecessary files`);
        await fs.rm(path.resolve(folder, ".gitignore"), { recursive: true, force: true, maxRetries: 2 });
        await fs.rm(path.resolve(folder, ".npmignore"), { recursive: true, force: true, maxRetries: 2 });
        await fs.rm(path.resolve(folder, ".swagger-codegen-ignore"), { recursive: true, force: true, maxRetries: 2 });
        await fs.rm(path.resolve(folder, "git_push.sh"), { recursive: true, force: true, maxRetries: 2 });
        await fs.rm(path.resolve(folder, "ng-package.json"), { recursive: true, force: true, maxRetries: 2 });
        await fs.rm(path.resolve(folder, ".swagger-codegen"), { recursive: true, force: true, maxRetries: 2 });
        // await fs.rm(path.resolve(folder, "api.module.ts"), { recursive: true, force: true, maxRetries: 2 });
        await fs.rm(path.resolve(folder, "index.ts"), { recursive: true, force: true, maxRetries: 2 });

        console.log(`> ${cliColor.inverse(apiName)} -- Finished`)
    }
});

async function generateApiModuleFile() {
    await fs.writeFile(
        path.resolve("./src/api/generated/api.module.ts"),
`import { NgModule } from '@angular/core';
${apiDescriptors.map(({name: apiName}) => `import { ${apiName.substring(0, 1).toUpperCase() + apiName.substring(1).toLowerCase()}ApiModule } from './${apiName}/api.module';`).join("\n")}


@NgModule({
    imports: [
        ${apiDescriptors.map(({name: apiName}) => `${apiName.substring(0, 1).toUpperCase() + apiName.substring(1).toLowerCase()}ApiModule,`).join("\n        ")}
    ],
})
export class ApiModule { }`
    );
}

async function generateModelsFile() {
    const modelLinesWithoutApiName = [];
    const modelLines = [];
    (await Promise.all(apiDescriptors.map(({name: apiName}) => {
        return fs.readFile(`./src/api/generated/${apiName}/model/models.ts`, {encoding: "utf-8"}).then((content) => {
            return { apiName, content: content.replace(/\r/g, "") };
        })
    }))).forEach((modelsFileContent) => {
        modelsFileContent.content.split("\n").filter(line => line.startsWith("export *")).forEach((line) => {
            if (!modelLinesWithoutApiName.includes(line)) {
                modelLinesWithoutApiName.push(line);
                modelLines.push(line.replace("export * from './", `export * from './${modelsFileContent.apiName}/model/`));
            }
        });
    })

    await fs.writeFile(
        path.resolve("./src/api/generated/models.ts"),
        modelLines.join("\n")
    );
}

async function generateServicesFile() {
    const serviceLinesWithoutApiName = [];
    const serviceLines = [];
    (await Promise.all(apiDescriptors.map(({name: apiName}) => {
        return fs.readFile(`./src/api/generated/${apiName}/api/api.ts`, {encoding: "utf-8"}).then((content) => {
            return { apiName, content: content.replace(/\r/g, "") };
        })
    }))).forEach((apisFileContent) => {
        apisFileContent.content.split("\n").filter(line => line.startsWith("export *")).forEach((line) => {
            if (!serviceLinesWithoutApiName.includes(line)) {
                serviceLinesWithoutApiName.push(line);
                serviceLines.push(line.replace("export * from './", `export * from './${apisFileContent.apiName}/api/`));
            }
        });
    })

    await fs.writeFile(
        path.resolve("./src/api/generated/services.ts"),
        serviceLines.join("\n")
    );
}

(async () => {
    for (const command of commands) {
        await command();
    }

    await generateApiModuleFile();
    await generateModelsFile();
    await generateServicesFile();

    console.log(`\n${cliColor.green.bold("> Finished!")}`);
})();

