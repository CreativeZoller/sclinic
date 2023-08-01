import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpellcheckerService } from './services/spellchecker.service';
import { TokenizerService } from './services/tokenizer.service';


@NgModule({
    imports: [
        CommonModule,
    ],
})
export class SpellcheckingModule {

    public static forRoot(): ModuleWithProviders<SpellcheckingModule> {
        return {
            ngModule: SpellcheckingModule,
            providers: [
                SpellcheckerService,
                TokenizerService,
            ],
        };
    }
}
