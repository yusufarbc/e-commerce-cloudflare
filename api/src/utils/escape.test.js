import { describe, it, expect } from 'vitest';
import { escapeMarkup, stripLineBreaks } from './escape.js';

describe('escapeMarkup', () => {
    it('escapes markup and quote characters', () => {
        expect(escapeMarkup(`<img src=x onerror="a('b')">&`))
            .toBe('&lt;img src=x onerror=&quot;a(&apos;b&apos;)&quot;&gt;&amp;');
    });

    it('turns null and undefined into an empty string and keeps numbers', () => {
        expect(escapeMarkup(null)).toBe('');
        expect(escapeMarkup(undefined)).toBe('');
        expect(escapeMarkup(0)).toBe('0');
    });
});

describe('stripLineBreaks', () => {
    it('prevents a value from starting a new MIME header', () => {
        expect(stripLineBreaks('Ali\r\nBcc: x@example.com')).toBe('Ali Bcc: x@example.com');
    });
});
