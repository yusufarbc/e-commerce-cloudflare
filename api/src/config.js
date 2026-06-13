/**
 * Application Configuration.
 * Dynamically loaded from Cloudflare Workers environment bindings (c.env) at request time.
 */
export const config = {
  port: 8787,
  corsOrigin: '*',
  nodeEnv: 'development',
  paymentProvider: 'param',
  param: {
    clientCode: '',
    clientUsername: '',
    clientPassword: '',
    guid: '',
    baseUrl: 'https://testposws.param.com.tr/turkpos.ws/service_turkpos_prod.asmx?wsdl',
    callbackUrl: 'http://localhost:8787'
  },
  iyzico: {
    apiKey: '',
    secretKey: '',
    baseUrl: 'https://sandbox-api.iyzipay.com',
    callbackUrl: 'http://localhost:8787'
  },
  paytr: {
    merchantId: '',
    merchantKey: '',
    merchantSalt: '',
    baseUrl: 'https://www.paytr.com',
    callbackUrl: 'http://localhost:8787'
  },
  brevo: {
    apiKey: '',
    smtp: {
      host: 'smtp-relay.brevo.com',
      port: 587,
      user: '',
      pass: '',
      sender: 'E-Market <siparis@e-market-domain.com>',
      replyTo: 'bilgi@e-market-domain.com',
    }
  },
  clientUrl: 'http://localhost:3000',
  orderNotificationEmail: 'bilgi@e-market-domain.com',
  cdnUrl: 'https://cdn.e-market-domain.com',
  googleMerchantToken: '',
  adminJwtSecret: 'secure-admin-token-secret-12345'
};

export let currentEnv = null;

/**
 * Initializes the global config object with Workers environment variables in-place.
 * Preserves nested object references so that static DI modules remain updated.
 * @param {Object} env - Worker env object (c.env).
 */
export function initConfig(env) {
  currentEnv = env;
  config.port = env.PORT || 8787;
  config.corsOrigin = env.CORS_ORIGIN || '*';
  config.nodeEnv = env.NODE_ENV || 'development';
  config.clientUrl = env.CLIENT_URL || 'http://localhost:3000';
  config.orderNotificationEmail = env.ORDER_NOTIFICATION_EMAIL || 'bilgi@e-market-domain.com';
  config.cdnUrl = env.CDN_URL || 'https://cdn.e-market-domain.com';
  config.googleMerchantToken = env.GOOGLE_MERCHANT_TOKEN || '';
  config.adminJwtSecret = env.ADMIN_JWT_SECRET || 'secure-admin-token-secret-12345';
  config.paymentProvider = env.PAYMENT_PROVIDER || 'param';

  // In-place update for Param POS parameters to preserve references
  Object.assign(config.param, {
    clientCode: env.PARAM_CLIENT_CODE || '',
    clientUsername: env.PARAM_CLIENT_USERNAME || '',
    clientPassword: env.PARAM_CLIENT_PASSWORD || '',
    guid: env.PARAM_GUID || '',
    baseUrl: env.PARAM_BASE_URL || 'https://testposws.param.com.tr/turkpos.ws/service_turkpos_prod.asmx?wsdl',
    callbackUrl: env.API_URL || 'http://localhost:8787'
  });

  // In-place update for iyzico parameters
  Object.assign(config.iyzico, {
    apiKey: env.IYZICO_API_KEY || '',
    secretKey: env.IYZICO_SECRET_KEY || '',
    baseUrl: env.IYZICO_BASE_URL || 'https://sandbox-api.iyzipay.com',
    callbackUrl: env.API_URL || 'http://localhost:8787'
  });

  // In-place update for PayTR parameters
  Object.assign(config.paytr, {
    merchantId: env.PAYTR_MERCHANT_ID || '',
    merchantKey: env.PAYTR_MERCHANT_KEY || '',
    merchantSalt: env.PAYTR_MERCHANT_SALT || '',
    baseUrl: env.PAYTR_BASE_URL || 'https://www.paytr.com',
    callbackUrl: env.API_URL || 'http://localhost:8787'
  });

  // In-place update for Brevo api key
  Object.assign(config.brevo, {
    apiKey: env.BREVO_API_KEY || ''
  });

  // In-place update for Brevo SMTP parameters to preserve references
  Object.assign(config.brevo.smtp, {
    host: env.SMTP_HOST || 'smtp-relay.brevo.com',
    port: Number(env.SMTP_PORT) || 587,
    user: env.SMTP_USER || '',
    pass: env.SMTP_PASS || '',
    sender: env.SMTP_SENDER || 'E-Market <siparis@e-market-domain.com>',
    replyTo: env.SMTP_REPLY_TO || 'bilgi@e-market-domain.com',
  });
}
