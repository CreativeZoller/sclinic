import { Routes } from '@angular/router';
import { CC_BASE_ROUTE, DASHBOARD_ROUTE, MASTER_DATA_BASE_ROUTE, MEDICAL_MANAGEMENT_BASE_ROUTE, SCHEDULE_BASE_ROUTE, SYSTEM_BASE_ROUTE } from "./app.config";


export const mainRoutes: Routes = [
    {
        path: MASTER_DATA_BASE_ROUTE,
        loadChildren: () => import('./modules/feature/master-data/master-data-routing.module').then((m) => m.MasterDataRoutingModule),
        data: { layout: 'light-sidebar' },
    },
    {
        path: SYSTEM_BASE_ROUTE,
        loadChildren: () => import('./modules/feature/system/system-routing.module').then((m) => m.SystemRoutingModule),
        data: { layout: 'light-sidebar' },
    },
    {
        path: MEDICAL_MANAGEMENT_BASE_ROUTE,
        loadChildren: () => import('./modules/feature/medical-management/medical-management-routing.module').then((m) => m.MedicalManagementRoutingModule),
        data: { layout: 'light-sidebar' },
    },
    {
        path: CC_BASE_ROUTE,
        loadChildren: () => import('./modules/feature/call-center/call-center-routing.module').then((m) => m.CcRoutingModule),
        data: { layout: 'light-sidebar' },
    },
    {
        path: DASHBOARD_ROUTE,
        loadChildren: () => import('./modules/feature/dashboard/dashboard-routing.module').then((m) => m.DashboardRoutingModule),
        data: { layout: 'light-sidebar' },
    },
    {
        path: SCHEDULE_BASE_ROUTE,
        loadChildren: () => import('./modules/feature/schedule/schedule-routing.module').then((m) => m.ScheduleRoutingModule),
        data: { layout: 'light-sidebar' }
    }
];
