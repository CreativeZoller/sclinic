import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, distinctUntilChanged, map, Observable, shareReplay, switchMap } from 'rxjs';
import { TokenizerService } from './tokenizer.service';
import { TextToken } from "../models/text-token.model";
import { Espells } from "espells"
import { TextTokenSpellcheckResult } from "../models/text-token-spellcheck-result.model";
import { LanguageService } from "../../../core/language/services/language.service";


@Injectable()
export class SpellcheckerService {

    private httpClient = inject(HttpClient);
    private languageService = inject(LanguageService);
    private tokenizerSvc = inject(TokenizerService);

    public lang$ = this.languageService.getActiveLanguage$();

    // TODO OPTIMIZE: https://stackoverflow.com/questions/61598927/get-the-full-word-that-cursor-is-touching-or-within-javascript
    // TODO OPTIMIZE: webworkerben fusson a spellcheck mert ha sokáig tartana valamiért akkor lefagyhat tőle a UI

    /**
     * Official punctuation marks used in English, German, Hungarian and Slovak languages.
     */
    public punctuationMarks: string[] = [
        ".",
        "?",
        "¿",
        "!",
        "¡",
        "?!",
        "…",
        "...",

        ",",
        ";",
        ":",
        "-",
        "–",
        "—",

        "\"",
        "'",
        "„",
        "‘",
        "’",
        "”",
        "“",
        "»",
        "«",
        "′",
        "″",

        "/",
        "\\",
        "+",
        "·",
        "×",
        "*",
        "=",
        "≈",
        "%",
        "§",
        "°",
        "~",

        "@",
        "&",
        "#",
        "♯",
        "$",
        "€",

        "(",
        ")",
        "[",
        "]",
        "{",
        "}",
    ]

    private spellChecker$: Observable<Espells> = this.lang$.pipe(
        switchMap((lang) => {
            const affFileUrl = `/assets/spellchecker/dictionaries/${lang}/${lang}.aff`;
            const dicFileUrl = `/assets/spellchecker/dictionaries/${lang}/${lang}.dic`;

            const affFile$ = this.httpClient.get(affFileUrl, { responseType: 'text' });
            const dicFile$ = this.httpClient.get(dicFileUrl, { responseType: 'text' });

            return combineLatest([affFile$, dicFile$])
        }),
        map(([affFile, dicFile]) => {
            return new Espells({ aff: affFile, dic: dicFile });
        }),
        distinctUntilChanged(),
        shareReplay(1),
    )

    public checkText$(text: string): Observable<TextTokenSpellcheckResult[]> {
        const tokens = this.tokenizerSvc.tokenizeText(text);

        return this.spellChecker$.pipe(
            map((spellChecker) => {
                // Spell checker doesn't handle punctuation marks, so we need to allow them manually
                const isPunctuationMark = (token: TextToken): boolean => {
                    return this.punctuationMarks.some(mark => token.text.toLowerCase() === mark.toLowerCase())
                }

                // Spell checker doesn't handle numbers, so we need to allow them manually
                const isNumber = (token: TextToken): boolean => {
                    return /^[0-9]*$/.test(token.text);
                }

                const spellcheckResultCache = new Map<string, boolean>();
                const isSpellcheckValid = (token: TextToken): boolean => {
                    if (spellcheckResultCache.has(token.text)) {
                        return spellcheckResultCache.get(token.text)!
                    } else {
                        const isCorrect = spellChecker.lookup(token.text).correct;
                        spellcheckResultCache.set(token.text, isCorrect);

                        return isCorrect;
                    }
                }

                return tokens.map(t => ({
                    ...t,
                    isCorrect: isPunctuationMark(t) || isNumber(t) || isSpellcheckValid(t)
                }))
            }),
            distinctUntilChanged(),
            shareReplay(1),
        )
    }

    public checkWord$(word: string): Observable<boolean> {
        return this.spellChecker$.pipe(
            map((spellChecker) => spellChecker.lookup(word).correct),
            distinctUntilChanged(),
            shareReplay(1),
        )
    }
}
