import { describe, it, expect, vi, afterEach } from 'vitest';
import { initConfig } from '../config.js';
import { EmailService } from './emailService.js';

const mail = { toEmail: 'ali@example.com', toName: 'Ali\r\nBcc: x@example.com', subject: 'Sipariş', htmlContent: '<p>Merhaba</p>' };
const service = () => new EmailService({ sender: 'E-Market <siparis@example.com>', replyTo: 'destek@example.com' });

afterEach(() => vi.unstubAllGlobals());

describe('EmailService with EMAIL_PROVIDER=resend', () => {
    it('posts the message to the Resend API with the key from the secret', async () => {
        const fetchMock = vi.fn().mockResolvedValue(new Response('{"id":"1"}', { status: 200 }));
        vi.stubGlobal('fetch', fetchMock);
        initConfig({ EMAIL_PROVIDER: 'resend', RESEND_API_KEY: 're_test' });

        await service()._sendMail(mail);

        expect(fetchMock).toHaveBeenCalledOnce();
        const [url, init] = fetchMock.mock.calls[0];
        expect(url).toBe('https://api.resend.com/emails');
        expect(init.headers.Authorization).toBe('Bearer re_test');
        const body = JSON.parse(init.body);
        expect(body).toMatchObject({
            from: 'E-Market <siparis@example.com>',
            reply_to: 'destek@example.com',
            subject: 'Sipariş',
            html: '<p>Merhaba</p>',
        });
        expect(body.to[0]).not.toMatch(/[\r\n]/);
    });

    it('skips sending when the API key is missing', async () => {
        const fetchMock = vi.fn();
        vi.stubGlobal('fetch', fetchMock);
        initConfig({ EMAIL_PROVIDER: 'resend' });

        await service()._sendMail(mail);

        expect(fetchMock).not.toHaveBeenCalled();
    });

    it('does not throw when Resend rejects the message', async () => {
        vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('bad', { status: 422 })));
        initConfig({ EMAIL_PROVIDER: 'resend', RESEND_API_KEY: 're_test' });

        await expect(service()._sendMail(mail)).resolves.toBeUndefined();
    });
});

describe('EmailService with the Cloudflare binding', () => {
    it('builds a MIME message with Date, Message-ID and Reply-To', async () => {
        const send = vi.fn().mockResolvedValue(undefined);
        vi.doMock('cloudflare:email', () => ({
            EmailMessage: class { constructor(from, to, raw) { Object.assign(this, { from, to, raw }); } },
        }));
        initConfig({ EMAIL: { send } });

        await service()._sendMail(mail);

        expect(send).toHaveBeenCalledOnce();
        const { raw } = send.mock.calls[0][0];
        const headers = raw.split('\r\n\r\n')[0];
        expect(headers).toMatch(/^Date: .+ GMT$/m);
        expect(headers).toMatch(/^Message-ID: <[0-9a-f-]{36}@example\.com>$/m);
        expect(headers).toMatch(/^Reply-To: destek@example\.com$/m);
        expect(headers).not.toMatch(/^Bcc:/m);
    });
});

describe('EmailService default provider', () => {
    it('uses the Cloudflare binding and skips when it is absent', async () => {
        const fetchMock = vi.fn();
        vi.stubGlobal('fetch', fetchMock);
        initConfig({});

        await service()._sendMail(mail);

        expect(fetchMock).not.toHaveBeenCalled();
    });
});
