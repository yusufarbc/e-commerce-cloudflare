import { config, currentEnv } from '../config.js';

/**
 * Service for handling email notifications via Brevo (Sendinblue) HTTP API.
 * Replaces nodemailer SMTP transport for Cloudflare Workers edge compatibility.
 */
export class EmailService {
    /**
     * Creates an instance of EmailService.
     * @param {Object} smtpConfig - SMTP configuration object (preserved for structure).
     */
    constructor(smtpConfig) {
        // We will parse the sender string into {name, email}
        const senderString = smtpConfig?.sender || 'E-Market <siparis@e-market-domain.com>';
        const replyToString = smtpConfig?.replyTo || 'bilgi@e-market-domain.com';

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
     * Sends an email via Cloudflare Workers Email Routing Send Email API.
     * @private
     */
    async _sendMail({ toEmail, toName, subject, htmlContent }) {
        const env = currentEnv;
        if (!env || !env.EMAIL) {
            console.warn('[Email] Email skipped: Cloudflare EMAIL binding is not configured in c.env');
            return;
        }

        try {
            const { EmailMessage } = await import("cloudflare:email");
            
            // Build raw RFC 822 / MIME format message
            const rawMime = [
                `From: ${this.sender.name} <${this.sender.email}>`,
                `To: ${toName || toEmail} <${toEmail}>`,
                `Subject: =?utf-8?B?${btoa(unescape(encodeURIComponent(subject)))}?=`, // Base64 encoding for UTF-8 subject compatibility
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
        console.log(`[Email] Sipariş Onayı gönderiliyor: ${toEmail} - Sipariş: ${orderDetails.id}`);

        const orderLink = `${config.clientUrl}/siparis-takip?token=${orderDetails.trackingToken}`;

        const content = `
            <p>Sayın <strong>${toName}</strong>,</p>
            <p>Siparişiniz başarıyla alındı ve hazırlanıyor. Teşekkür ederiz!</p>
            
            <div style="background-color: #F4F4F4; padding: 20px; border-radius: 6px; margin: 25px 0; border-left: 4px solid #4f46e5;">
                <p style="margin: 5px 0;"><strong>Sipariş No:</strong> #${orderDetails.orderNumber}</p>
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
                 ${details.cancelReason}
               </div>`
            : '';

        const content = `
            <p>Sayın <strong>${toName}</strong>,</p>
            <p><strong>#${details.orderNumber}</strong> numaralı siparişiniz iptal edilmiştir.</p>
            
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
        const recipient = config.orderNotificationEmail || 'bilgi@e-market-domain.com';
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
                    <td style="padding: 10px; border-bottom: 1px solid #eee;">${productName}</td>
                    <td style="padding: 10px; border-bottom: 1px solid #eee;">${color}</td>
                    <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${qty}</td>
                    <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">₺${unitPrice.toFixed(2)}</td>
                    <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right; font-weight: bold;">₺${lineTotal.toFixed(2)}</td>
                </tr>
            `;
        }).join('');

        const content = `
            <p>Yeni bir sipariş alındı.</p>

            <div style="background-color: #F4F4F4; padding: 20px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #4f46e5;">
                <p style="margin: 5px 0;"><strong>Sipariş No:</strong> #${order.siparisNumarasi || '-'}</p>
                <p style="margin: 5px 0;"><strong>Sipariş ID:</strong> ${order.id || '-'}</p>
                <p style="margin: 5px 0;"><strong>Durum:</strong> ${order.durum || '-'}</p>
                <p style="margin: 5px 0;"><strong>Ödeme Durumu:</strong> ${order.odemeDurumu || '-'}</p>
                <p style="margin: 5px 0;"><strong>Toplam:</strong> <strong>₺${Number(order.toplamTutar || 0).toFixed(2)}</strong></p>
                <p style="margin: 5px 0;"><strong>Kargo:</strong> ₺${Number(order.kargoUcreti || 0).toFixed(2)}</p>
                <p style="margin: 5px 0;"><strong>Oluşturulma:</strong> ${order.olusturulmaTarihi ? new Date(order.olusturulmaTarihi).toLocaleString('tr-TR') : '-'}</p>
            </div>

            <h3 style="margin: 25px 0 10px 0;">Müşteri Bilgileri</h3>
            <div style="background-color: #F9F9F9; padding: 15px; border-radius: 6px;">
                <p style="margin: 4px 0;"><strong>Ad Soyad:</strong> ${(order.ad || '')} ${(order.soyad || '')}</p>
                <p style="margin: 4px 0;"><strong>E-posta:</strong> ${order.eposta || '-'}</p>
                <p style="margin: 4px 0;"><strong>Telefon:</strong> ${order.telefon || '-'}</p>
            </div>

            <h3 style="margin: 25px 0 10px 0;">Teslimat Adresi</h3>
            <div style="background-color: #F9F9F9; padding: 15px; border-radius: 6px;">
                <p style="margin: 4px 0;"><strong>Adres:</strong> ${order.adres || '-'}</p>
                <p style="margin: 4px 0;"><strong>İlçe / Şehir:</strong> ${order.ilce || '-'} / ${order.sehir || '-'}</p>
                <p style="margin: 4px 0;"><strong>Posta Kodu:</strong> ${order.postaKodu || '-'}</p>
                <p style="margin: 4px 0;"><strong>Ülke:</strong> ${order.ulke || 'Türkiye'}</p>
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
