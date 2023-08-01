// Modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalsModule, WidgetsModule } from 'src/app/_metronic/partials';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDateFnsModule } from '@angular/material-date-fns-adapter';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTreeModule } from '@angular/material/tree';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule} from '@angular/material/menu';
import { MatTabsModule } from '@angular/material/tabs';
import { NgxMaskModule } from 'ngx-mask';
import { FullCalendarModule } from '@fullcalendar/angular'; // must go before plugins
import { NgxPopperjsModule } from 'ngx-popperjs';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { DragDropModule } from '@angular/cdk/drag-drop';
import { VirtualScrollerModule } from '@iharbeck/ngx-virtual-scroller';
import { NgLetModule } from 'ng-let';
import { DynamicComponentModule } from "../../components/dynamic-component/dynamic-component.module";

// Components
import { TableComponent } from 'src/app/components/table/table/table.component';
import { PaginationComponent } from 'src/app/components/table/pagination/pagination.component';
import { FullcalendarComponent } from 'src/app/components/fullcalendar/fullcalendar.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { UtilityModule } from '../core/utility/utility.module';
import { DynamicTableCellComponentDirective } from "../../components/table/table/dynamic-table-cell-component.directive";
import { ResourceModule } from "../core/resource/resource.module";


@NgModule({
    declarations: [
        TableComponent,
        DynamicTableCellComponentDirective,
        PaginationComponent,
        FullcalendarComponent,
    ],
    exports: [
        // Components
        TableComponent,
        DynamicTableCellComponentDirective,
        PaginationComponent,
        FullcalendarComponent,
        // Modules
        InlineSVGModule,
        MatDatepickerModule,
        MatDateFnsModule,
        MatFormFieldModule,
        MatInputModule,
        MatTreeModule,
        MatIconModule,
        MatMenuModule,
        WidgetsModule,
        ModalsModule,
        NgxMaskModule,
        FullCalendarModule,
        MatTabsModule,
        NgxPopperjsModule,
        FormsModule,
        ReactiveFormsModule,
        MatProgressBarModule,
        CKEditorModule,
        DynamicComponentModule,
        NgLetModule,
    ],
    providers: [],
    imports: [
        CommonModule,
        UtilityModule,
        InlineSVGModule,
        MatDatepickerModule,
        MatDateFnsModule,
        MatFormFieldModule,
        MatInputModule,
        MatTreeModule,
        MatIconModule,
        MatMenuModule,
        WidgetsModule,
        ModalsModule,
        NgxMaskModule.forRoot(),
        FullCalendarModule,
        MatTabsModule,
        NgxPopperjsModule,
        FormsModule,
        ReactiveFormsModule,
        MatProgressBarModule,
        CKEditorModule,
        DynamicComponentModule,
        DragDropModule,
        VirtualScrollerModule,
        NgLetModule,
        ResourceModule
    ]
})

export class _SharedModule { }
