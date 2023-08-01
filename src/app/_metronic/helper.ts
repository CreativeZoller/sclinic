import { DrawerComponent, MenuComponent, ScrollComponent, ScrollTopComponent, StickyComponent, ToggleComponent } from "./kt/components";


export function reinitMetronicComponents() {
    setTimeout(() => {
        ToggleComponent.reinitialization();
        ScrollTopComponent.reinitialization();
        DrawerComponent.reinitialization();
        StickyComponent.bootstrap();
        MenuComponent.reinitialization();
        ScrollComponent.reinitialization();
    }, 200);
}
