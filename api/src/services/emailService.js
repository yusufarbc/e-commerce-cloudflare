import { config, currentEnv } from '../config.js';
import { escapeMarkup as esc, stripLineBreaks } from '../utils/escape.js';

/**
 * Service for sending transactional emails via Cloudflare Workers Email Sending API.
 * Uses the `cloudflare:email` module with the EMAIL binding configured in wrangler.toml.
 */
export class EmailService {
    /**
     * Creates an instance of EmailService.
     * @param {Object} emailConfig - Email configuration with sender/replyTo.
     */
    constructor(emailConfig) {
        const senderString = emailConfig?.sender || 'E-Market <siparis@ecommerceflaredev.web.tr>';
        const replyToString = emailConfig?.replyTo || 'siparis@ecommerceflaredev.web.tr';

        this.sender = this._parseSenderString(senderString);
        this.replyTo = this._parseSenderString(replyToString);
    }

    /**
     * Helper to parse sender strings like "Name <email@domain.com>"
     * @private
     */
    _parseSenderString(str) {
        const match = str.match(/^(.*?)\s*<(.*?)>$/);
        if (match) {
            return { name: match[1].trim(), email: match[2].trim() };
        }
        return { name: "E-Market", email: str.trim() };
    }

    /**
     * Sends an email through the provider selected by EMAIL_PROVIDER:
     * "cloudflare" (default, Workers send_email binding) or "resend" (Resend REST API,
     * key in the RESEND_API_KEY secret). Failures are logged, never thrown, so an
     * e-mail problem cannot fail an order.
     * @private
     */
    async _sendMail(mail) {
        const provider = (currentEnv?.EMAIL_PROVIDER || 'cloudflare').toLowerCase().trim();
        if (provider === 'resend') {
            return this._sendViaResend(mail);
        }
        return this._sendViaCloudflare(mail);
    }

    /**
     * Sends an email via the Resend API (https://resend.com/docs/api-reference/emails/send-email).
     * The sender domain must be verified in Resend.
     * @private
     */
    async _sendViaResend({ toEmail, toName, subject, htmlContent }) {
        const apiKey = currentEnv?.RESEND_API_KEY;
        if (!apiKey) {
            console.warn('[Email] Email skipped: RESEND_API_KEY secret is not set');
            return;
        }

        try {
            const response = await fetch('https://api.resend.com/emails', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    from: `${this.sender.name} <${this.sender.email}>`,
                    to: [toName ? `${stripLineBreaks(toName)} <${stripLineBreaks(toEmail)}>` : stripLineBreaks(toEmail)],
                    reply_to: this.replyTo.email,
                    subject,
                    html: htmlContent,
                }),
            });
            if (!response.ok) {
                console.error('[Email] Resend rejected the email: HTTP %s', response.status);
                return;
            }
            console.log('[Email] Email sent successfully via Resend.');
        } catch (error) {
            console.error('[Email] Failed to send email via Resend:', error);
        }
    }

    /**
     * Sends an email via Cloudflare Workers Email Routing Send Email API.
     * @private
     */
    async _sendViaCloudflare({ toEmail, toName, subject, htmlContent }) {
        const env = currentEnv;
        if (!env || !env.EMAIL) {
            console.warn('[Email] Email skipped: Cloudflare EMAIL binding is not configured in c.env');
            return;
        }

        try {
            const { EmailMessage } = await import("cloudflare:email");
            
            // Build raw RFC 822 / MIME format message
            // Use TextEncoder for UTF-8 safe Base64 subject encoding
            const subjectBytes = new TextEncoder().encode(subject);
            let binaryStr = '';
            subjectBytes.forEach(byte => { binaryStr += String.fromCharCode(byte); });
            const subjectBase64 = btoa(binaryStr);

            const rawMime = [
                `From: ${this.sender.name} <${this.sender.email}>`,
                `To: ${stripLineBreaks(toName || toEmail)} <${stripLineBreaks(toEmail)}>`,
                `Reply-To: ${this.replyTo.email}`,
                // The send_email binding rejects a message without these ("invalid message-id").
                `Date: ${new Date().toUTCString()}`,
                `Message-ID: <${crypto.randomUUID()}@${this.sender.email.split('@')[1]}>`,
                `Subject: =?utf-8?B?${subjectBase64}?=`,
                `MIME-Version: 1.0`,
                `Content-Type: text/html; charset=utf-8`,
                ``,
                htmlContent
            ].join('\r\n');

            const message = new EmailMessage(
                this.sender.email,
                toEmail,
                rawMime
            );

            await env.EMAIL.send(message);
            console.log('[Email] Email sent successfully via Cloudflare Send Email API.');
        } catch (error) {
            console.error('[Email] Failed to send email via Cloudflare:', error);
        }
    }

    /**
     * Creates a common email template with header, content, and footer.
     * @private
     */
    _createEmailTemplate(title, content, headerColor = '#191919') {
        return `
<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Arial, sans-serif; background-color: #F4F4F4;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #F4F4F4; padding: 20px 0;">
        <tr>
            <td align="center">
                <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #FFFFFF; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                    <!-- Header -->
                    <tr>
                        <td style="background-color: ${headerColor}; padding: 25px 30px; text-align: center;">
                            <h1 style="margin: 0; color: #FFFFFF; font-size: 22px; font-weight: 600;">${title}</h1>
                        </td>
                    </tr>
                    <!-- Content -->
                    <tr>
                        <td style="padding: 30px; color: #191919; line-height: 1.6;">
                            ${content}
                        </td>
                    </tr>
                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #191919; padding: 20px 30px; text-align: center;">
                            <p style="margin: 0 0 8px 0; color: #4f46e5; font-size: 14px; font-weight: 600;">E-MARKET</p>
                            <p style="margin: 0; color: #666666; font-size: 12px;">
                                Bu e-posta otomatik olarak gönderilmiştir. Yanıtlamayınız.<br>
                                Sorularınız için: <a href="mailto:${this.replyTo.email}" style="color: #4f46e5;">${this.replyTo.email}</a>
                            </p>
                            <p style="margin: 10px 0 0 0; color: #666666; font-size: 11px;">
                                © ${new Date().getFullYear()} E-Market. Tüm hakları saklıdır.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;
    }

    /**
     * Sends order confirmation email to customer.
     */
    async sendOrderConfirmation(toEmail, toName, orderDetails) {
        console.log('[Email] Sipariş Onayı gönderiliyor: %s - Sipariş: %s', toEmail, orderDetails.id);

        const orderLink = `${config.clientUrl}/siparis-takip?token=${orderDetails.trackingToken}`;

        const content = `
            <p>Sayın <strong>${esc(toName)}</strong>,</p>
            <p>Siparişiniz başarıyla alındı ve hazırlanıyor. Teşekkür ederiz!</p>
            
            <div style="background-color: #F4F4F4; padding: 20px; border-radius: 6px; margin: 25px 0; border-left: 4px solid #4f46e5;">
                <p style="margin: 5px 0;"><strong>Sipariş No:</strong> #${esc(orderDetails.orderNumber)}</p>
                <p style="margin: 5px 0;"><strong>Toplam Tutar:</strong> <span style="font-size: 18px; color: #191919; font-weight: bold;">₺${Number(orderDetails.total).toFixed(2)}</span></p>
            </div>

            <p>Siparişinizin detaylarını, kargo takibini ve faturanızı görüntülemek için aşağıdaki butona tıklayın:</p>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="${orderLink}" style="background-color: #dc2a12; color: #FFFFFF; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block; font-size: 16px;">Siparişimi Görüntüle</a>
            </div>

            <p style="color: #666666; font-size: 13px;">Bizi tercih ettiğiniz için teşekkür ederiz.</p>
        `;

        await this._sendMail({
            toEmail,
            toName,
            subject: `Siparişiniz Onaylandı ✅ - #${orderDetails.orderNumber}`,
            htmlContent: this._createEmailTemplate('Siparişiniz Onaylandı!', content)
        });
    }

    /**
     * Sends order cancellation email notification to customer.
     */
    async sendCancellationNotification(toEmail, toName, details) {
        const isRefunded = details.refundStatus === 'SUCCESS';
        const refundMessage = isRefunded
            ? 'Ödeme iadeniz bankanıza iletilmiştir. Banka prosedürlerine göre 3-7 iş günü içinde hesabınıza yansıyacaktır.'
            : 'Ödeme iadesi hakkında detaylı bilgi için lütfen bizimle iletişime geçiniz.';

        const reasonHtml = details.cancelReason
            ? `<div style="background-color: #F4F4F4; padding: 15px; border-left: 4px solid #dc2a12; margin: 20px 0; color: #191919;">
                 <strong style="display:block; margin-bottom:5px; color: #dc2a12;">İptal Nedeni:</strong>
                 ${esc(details.cancelReason)}
               </div>`
            : '';

        const content = `
            <p>Sayın <strong>${esc(toName)}</strong>,</p>
            <p><strong>#${esc(details.orderNumber)}</strong> numaralı siparişiniz iptal edilmiştir.</p>
            
            ${reasonHtml}
            
            <div style="background-color: #F4F4F4; padding: 20px; border-radius: 6px; margin: 25px 0; border-left: 4px solid #4f46e5;">
                <h3 style="margin: 0 0 10px 0; color: #191919; font-size: 16px;">İade Durumu</h3>
                <p style="margin: 0; color: #666666;">${refundMessage}</p>
            </div>

            <p style="color: #666666;">Yaşanan aksaklık için özür diler, anlayışınız için teşekkür ederiz.</p>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="${config.clientUrl}" style="background-color: #191919; color: #4f46e5; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Ana Sayfaya Dön</a>
                <br><br>
                <a href="${config.clientUrl}/siparis-takip?token=${details.trackingToken}" style="background-color: #dc2a12; color: #FFFFFF; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Sipariş Detayı</a>
            </div>
        `;

        await this._sendMail({
            toEmail,
            toName,
            subject: `Sipariş İptali - #${details.orderNumber}`,
            htmlContent: this._createEmailTemplate('Sipariş İptal Bilgilendirmesi', content, '#dc2a12')
        });
    }

    /**
     * Sends internal seller notification for a newly completed order.
     */
    async sendSellerNewOrderNotification(order) {
        const recipient = config.orderNotificationEmail || 'siparis@ecommerceflaredev.web.tr';
        if (!recipient) {
            console.warn('[Email] Seller notification skipped: recipient missing');
            return;
        }

        const orderItems = Array.isArray(order?.kalemler) ? order.kalemler : [];
        const itemRows = orderItems.map((item, index) => {
            const productName = item.urunAdSnapshot || item.urun?.ad || '-';
            const color = item.secilenRenk || '-';
            const qty = Number(item.adet || 0);
            const unitPrice = Number(item.urunFiyatSnapshot || item.fiyat || 0);
            const lineTotal = Number(item.toplamFiyat || (qty * unitPrice));

            return `
                <tr>
                    <td style="padding: 10px; border-bottom: 1px solid #eee;">${index + 1}</td>
                    <td style="padding: 10px; border-bottom: 1px solid #eee;">${esc(productName)}</td>
                    <td style="padding: 10px; border-bottom: 1px solid #eee;">${esc(color)}</td>
                    <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${qty}</td>
                    <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">₺${unitPrice.toFixed(2)}</td>
                    <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right; font-weight: bold;">₺${lineTotal.toFixed(2)}</td>
                </tr>
            `;
        }).join('');

        const content = `
            <p>Yeni bir sipariş alındı.</p>

            <div style="background-color: #F4F4F4; padding: 20px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #4f46e5;">
                <p style="margin: 5px 0;"><strong>Sipariş No:</strong> #${esc(order.siparisNumarasi || '-')}</p>
                <p style="margin: 5px 0;"><strong>Sipariş ID:</strong> ${esc(order.id || '-')}</p>
                <p style="margin: 5px 0;"><strong>Durum:</strong> ${esc(order.durum || '-')}</p>
                <p style="margin: 5px 0;"><strong>Ödeme Durumu:</strong> ${esc(order.odemeDurumu || '-')}</p>
                <p style="margin: 5px 0;"><strong>Toplam:</strong> <strong>₺${Number(order.toplamTutar || 0).toFixed(2)}</strong></p>
                <p style="margin: 5px 0;"><strong>Kargo:</strong> ₺${Number(order.kargoUcreti || 0).toFixed(2)}</p>
                <p style="margin: 5px 0;"><strong>Oluşturulma:</strong> ${order.olusturulmaTarihi ? new Date(order.olusturulmaTarihi).toLocaleString('tr-TR') : '-'}</p>
            </div>

            <h3 style="margin: 25px 0 10px 0;">Müşteri Bilgileri</h3>
            <div style="background-color: #F9F9F9; padding: 15px; border-radius: 6px;">
                <p style="margin: 4px 0;"><strong>Ad Soyad:</strong> ${esc(order.ad)} ${esc(order.soyad)}</p>
                <p style="margin: 4px 0;"><strong>E-posta:</strong> ${esc(order.eposta || '-')}</p>
                <p style="margin: 4px 0;"><strong>Telefon:</strong> ${esc(order.telefon || '-')}</p>
            </div>

            <h3 style="margin: 25px 0 10px 0;">Teslimat Adresi</h3>
            <div style="background-color: #F9F9F9; padding: 15px; border-radius: 6px;">
                <p style="margin: 4px 0;"><strong>Adres:</strong> ${esc(order.adres || '-')}</p>
                <p style="margin: 4px 0;"><strong>İlçe / Şehir:</strong> ${esc(order.ilce || '-')} / ${esc(order.sehir || '-')}</p>
                <p style="margin: 4px 0;"><strong>Posta Kodu:</strong> ${esc(order.postaKodu || '-')}</p>
                <p style="margin: 4px 0;"><strong>Ülke:</strong> ${esc(order.ulke || 'Türkiye')}</p>
            </div>

            <h3 style="margin: 25px 0 10px 0;">Sipariş Kalemleri</h3>
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border: 1px solid #eee; border-collapse: collapse;">
                <thead>
                    <tr style="background-color: #191919; color: #fff;">
                        <th style="padding: 10px; text-align: left;">#</th>
                        <th style="padding: 10px; text-align: left;">Ürün</th>
                        <th style="padding: 10px; text-align: left;">Renk</th>
                        <th style="padding: 10px; text-align: center;">Adet</th>
                        <th style="padding: 10px; text-align: right;">Birim</th>
                        <th style="padding: 10px; text-align: right;">Toplam</th>
                    </tr>
                </thead>
                <tbody>
                    ${itemRows || '<tr><td colspan="6" style="padding: 12px;">Kalem bulunamadı.</td></tr>'}
                </tbody>
            </table>
        `;

        await this._sendMail({
            toEmail: recipient,
            toName: 'E-Market Admin',
            subject: `Yeni Sipariş Alındı - #${order.siparisNumarasi || '-'}`,
            htmlContent: this._createEmailTemplate('Yeni Sipariş Bildirimi', content, '#191919')
        });
    }
}
