import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { ClipboardModule } from 'ngx-clipboard';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ApiModule } from '../api/api.module';
import { CoreModule } from "./modules/core/core.module";
import { AppCommonModule } from "./modules/app-common/app-common.module";
import { TranslateModule } from "@ngx-translate/core";


@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        ClipboardModule,
        InlineSVGModule.forRoot(),
        // TODO refactor / remove
        TranslateModule.forRoot(),
        ApiModule,
        NgbModule,
        CoreModule.forRoot(),
        AppCommonModule.forRoot(),
        AppRoutingModule,
    ],
    bootstrap: [AppComponent],
})
export class AppModule { }
