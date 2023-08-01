import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { SCHEDULE_GENERATOR, SCHEDULE_PLANNER, SCHEDULE_PUBLISHING, SCHEDULE_TEMPLATE } from "src/app/app.config";
import { ScheduleGeneratorComponent } from "./generator/components/schedule-generator/schedule-generator.component";
import { ScheduleGenerateInitPageResolver } from "./generator/resolver/schedule-generate-init-page.resolver";
import { SchedulePlannerComponent } from "./planner/components/schedule-planner/schedule-planner.component";
import { SchedulePlannerInitPageResolver } from "./planner/resolver/schedule-planner-init-page.resolver";
import { SchedulePublishingComponent } from "./publishing/components/schedule-publishing/schedule-publishing.component";
import { SchedulePublishingInitPageResolver } from "./publishing/resolvers/schedule-publishing-init-page.resolver";
import { ScheduleModule } from "./schedule.module";
import { ScheduleTemplateListComponent } from "./template/components/list/schedule-template-list.component";
import { ScheduleTemplatesInitPageResolver } from "./template/resolver/schedule-templates-init-page.resolver";


const routes: Routes = [
    {
        path: SCHEDULE_TEMPLATE,
        component: ScheduleTemplateListComponent,
        resolve: {
            init: ScheduleTemplatesInitPageResolver
        }
    },
    {
        path: SCHEDULE_GENERATOR,
        component: ScheduleGeneratorComponent,
        resolve: {
            init: ScheduleGenerateInitPageResolver
        }
    },
    {
        path: SCHEDULE_PLANNER,
        component: SchedulePlannerComponent,
        resolve: {
            init: SchedulePlannerInitPageResolver,
        }
    },
    {
        path: SCHEDULE_PUBLISHING,
        component: SchedulePublishingComponent,
        resolve: {
            init: SchedulePublishingInitPageResolver
        }
    }
]

@NgModule({
    imports: [
        ScheduleModule,
        RouterModule.forChild(routes)
    ],
    exports: [
        ScheduleModule,
        RouterModule
    ],
})
export class ScheduleRoutingModule { }
