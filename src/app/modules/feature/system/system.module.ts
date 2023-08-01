import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SharedModule } from "../../shared/shared.module";
import { UserListComponent } from "./users/components/list/user-list.component";
import { UserFormComponent } from "./users/components/form/user-form.component";
import { UserRoleListFieldComponent } from "./users/components/user-role/list-field/user-role-list-field.component";
import { UserRoleFormComponent } from "./users/components/user-role/form/user-role-form.component";
import { ClinicsModule } from "../master-data/clinics/clinics.module";
import { RoleListComponent } from "./roles/components/list/role-list.component";
import { RoleFormComponent } from "./roles/components/form/role-form.component";
import { AuthorityListComponent } from "./authorities/components/list/authority-list.component";
import { AuthoritySelectionListFieldComponent } from "./authorities/components/selection-list-field/authority-selection-list-field.component";
import { AuthorityFormComponent } from "./authorities/components/form/authority-form.component";
import { AuthorityFunctionTreeFieldComponent } from "./authorities/components/authority-function/authority-function-tree-field/authority-function-tree-field.component";
import { FunctionListComponent } from "./functions/components/list/function-list.component";
import { FunctionFormComponent } from "./functions/components/form/function-form.component";
import { ConfigurationListComponent } from "./configurations/components/list/configuration-list.component";
import { ConfigurationFormComponent } from "./configurations/components/form/configuration-form.component";
import { DivisionNumberListComponent } from "./division-numbers/components/list/division-number-list.component";
import { DivisionNumberFormComponent } from "./division-numbers/components/form/division-number-form.component";


@NgModule({
    declarations: [
        UserListComponent,
        UserFormComponent,
        UserRoleListFieldComponent,
        UserRoleFormComponent,
        RoleListComponent,
        RoleFormComponent,
        AuthorityListComponent,
        AuthoritySelectionListFieldComponent,
        AuthorityFormComponent,
        AuthorityFunctionTreeFieldComponent,
        FunctionListComponent,
        FunctionFormComponent,
        ConfigurationListComponent,
        ConfigurationFormComponent,
        DivisionNumberListComponent,
        DivisionNumberFormComponent,
    ],
    imports: [
        CommonModule,
        SharedModule,
        // TODO áttenni a user-role moduljába amint elkészült
        ClinicsModule,
    ],
    exports: [
        UserListComponent,
        UserFormComponent,
        UserRoleListFieldComponent,
        UserRoleFormComponent,
        RoleListComponent,
        RoleFormComponent,
        AuthorityListComponent,
        AuthoritySelectionListFieldComponent,
        AuthorityFormComponent,
        AuthorityFunctionTreeFieldComponent,
        FunctionListComponent,
        FunctionFormComponent,
        ConfigurationListComponent,
        ConfigurationFormComponent,
        DivisionNumberListComponent,
        DivisionNumberFormComponent,
    ],
})
export class SystemModule { }
