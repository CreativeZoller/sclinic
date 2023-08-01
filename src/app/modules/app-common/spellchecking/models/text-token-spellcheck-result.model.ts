import { TextToken } from "./text-token.model";


export interface TextTokenSpellcheckResult extends TextToken {
    /**
     * Wether the spelling of the word is correct or not.
     */
    readonly isCorrect: boolean;
}
