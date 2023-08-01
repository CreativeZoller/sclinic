import { Injectable } from '@angular/core';
import { findSpans as generateTokenIterator } from 'unicode-default-word-boundary';
import { WordBreakProperty } from 'unicode-default-word-boundary/lib/gen/WordBreakProperty'
import { property as WordBreakPropertyMapper } from 'unicode-default-word-boundary/lib/findBoundaries'
import { TextToken } from "../models/text-token.model";


@Injectable()
export class TokenizerService {

    /**
     * Collects all tokens from a text and returns it in an array.
     *
     * This includes whitespaces and other word boundary tokens as well,
     * so if those are not needed, you need to filter them out manually!
     */
    private getAllTokens(text: string): TextToken[] {
        return Array.from(generateTokenIterator(text)).map((basicSpan) => ({
            start: basicSpan.start,
            end: basicSpan.end,
            text: basicSpan.text,
        }));
    }

    /**
     * Checks wether the given token is not empty or consists of only whitespaces
     */
    private isTokenValidWord(word: string): boolean {
        return !Array.from(word)
            .map(WordBreakPropertyMapper)
            .every(wb => (
                wb === WordBreakProperty.CR
                || wb === WordBreakProperty.LF
                || wb === WordBreakProperty.Newline
                || wb === WordBreakProperty.WSegSpace
            ));
    }

    /**
     * Splits the given text into words (tokens), and returns these words (tokens) with some related information.
     *
     * (Ignores tokens consisting only of whitespaces)
     */
    public tokenizeText(text: string): TextToken[] {
        return this.getAllTokens(text)
            .filter(token => this.isTokenValidWord(token.text));
    }
}
