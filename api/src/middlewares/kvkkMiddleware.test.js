import { describe, it, expect } from 'vitest';
import { maskIp, sanitizeString, sanitizeObject } from './kvkkMiddleware.js';

describe('maskIp', () => {
    it('zeroes the last IPv4 octet and the IPv6 interface identifier', () => {
        expect(maskIp('203.0.113.42')).toBe('203.0.113.0');
        expect(maskIp('2001:db8:85a3:8d3:1319:8a2e:370:7348')).toBe('2001:db8:85a3:8d3::');
        expect(maskIp('')).toBe('0.0.0.0');
    });
});

describe('sanitizeString', () => {
    it('masks e-mail addresses and Turkish mobile numbers in free text', () => {
        expect(sanitizeString('ali@example.com 0555 123 45 67'))
            .toBe('[MASKED_EMAIL] [MASKED_PHONE]');
    });
});

describe('sanitizeObject', () => {
    it('replaces values of personal-data keys whole, including names and addresses', () => {
        const out = sanitizeObject({
            fullName: 'Ali Veli',
            adres: 'Atatürk Cad. No: 1',
            items: [{ email: 'a@b.co', sku: 'X-1' }],
            note: 'call 05551234567',
        });
        expect(out).toEqual({
            fullName: '[MASKED]',
            adres: '[MASKED]',
            items: [{ email: '[MASKED]', sku: 'X-1' }],
            note: 'call [MASKED_PHONE]',
        });
    });
});
