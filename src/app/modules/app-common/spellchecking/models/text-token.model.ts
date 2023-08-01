export interface TextToken {
    /**
     * Start index (inclusive) of the current token in the source text
     */
    readonly start: number;

    /**
     * End index (exclusive) of the current token in the source text
     */
    readonly end: number;

    /**
     * The token text
     */
    readonly text: string;
}
