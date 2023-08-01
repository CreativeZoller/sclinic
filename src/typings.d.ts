declare var ClipboardJS: any;

declare module '@ckeditor/ckeditor5-build-classic' {
    const ClassicEditorBuild: any;

    export = ClassicEditorBuild;
}

declare module "mammoth/mammoth.browser" {
    import type MammothType from "mammoth";
    const mammoth: typeof MammothType;

    export = mammoth;
}
