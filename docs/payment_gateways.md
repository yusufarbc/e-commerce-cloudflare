# Payment Gateway Configuration Guide

E-Market supports three of Turkey's leading payment gateways through a single, decoupled interface. Switching between gateways requires changing only one environment variable — no code changes needed.

---

## Supported Gateways

| Gateway | Protocol | 3D Secure | Sandbox |
| :--- | :--- | :--- | :--- |
| **Param POS** | SOAP/XML over HTTPS | ✅ Yes | ✅ Yes |
| **iyzico** | REST/JSON | ✅ Yes | ✅ Yes |
| **PayTR** | HMAC-signed POST | ✅ Yes | ✅ Yes |

---

## Selecting a Gateway

Set the `PAYMENT_PROVIDER` variable in `api/.env` (local) or in your Wrangler environment:

```env
# Options: param | iyzico | paytr
PAYMENT_PROVIDER=param
```

The API's payment service layer reads this variable at runtime and routes all checkout requests to the appropriate gateway implementation. No rebuilds or deployments are required when switching between test gateways during development.

---

## 1. Param POS (SOAP)

Param POS is a widely-used Turkish payment infrastructure provider. E-Market integrates via their SOAP/XML web service.

### Environment Variables

```env
PAYMENT_PROVIDER=param

PARAM_CLIENT_CODE=your-client-code
PARAM_CLIENT_USERNAME=your-username
PARAM_CLIENT_PASSWORD=your-password
PARAM_GUID=your-guid-string

# Test endpoint (use for local development):
PARAM_BASE_URL=https://testposws.param.com.tr/turkpos.ws/service_turkpos_prod.asmx?wsdl

# Production endpoint:
# PARAM_BASE_URL=https://posws.param.com.tr/turkpos.ws/service_turkpos_prod.asmx?wsdl
```

### 3D Secure Flow

```
Storefront         Worker API          Param POS
    |                   |                   |
    |-- POST /checkout ->|                   |
    |                   |-- SOAP TP_WMD_UCD→|
    |                   |<-- 3D Redirect URL|
    |<-- { redirect_url}|                   |
    |-- Browser redirected to Param's 3D page
    |-- User enters card OTP on bank page   |
    |-- Param redirects back → /payment/callback
    |-- POST /payment/callback (Param result)
    |                   |-- SOAP TP_KK_Verify →|
    |                   |<-- Success/Fail result |
    |<-- Order confirmed|                   |
```

### Getting Credentials

Contact [Param](https://www.param.com.tr) for a merchant account. Test credentials for the sandbox environment are provided during the application process.

---

## 2. iyzico (REST)

iyzico is a popular Turkish fintech payment provider with a clean REST API.

### Environment Variables

```env
PAYMENT_PROVIDER=iyzico

IYZICO_API_KEY=your-api-key
IYZICO_SECRET_KEY=your-secret-key

# Sandbox endpoint:
IYZICO_BASE_URL=https://sandbox-api.iyzipay.com

# Production endpoint:
# IYZICO_BASE_URL=https://api.iyzipay.com
```

### 3D Secure Flow

```
Storefront         Worker API          iyzico API
    |                   |                   |
    |-- POST /checkout ->|                   |
    |                   |-- POST /payment/3dsecure/initialize →
    |                   |<-- { htmlContent (3D form) }
    |<-- Render iframe  |                   |
    |-- User enters OTP in iyzico's 3D iframe
    |-- iyzico POSTs result to /payment/callback
    |-- POST /payment/callback (iyzico token)
    |                   |-- POST /payment/3dsecure/auth →
    |                   |<-- Success/Fail result
    |<-- Order confirmed|                   |
```

### Getting Credentials

Register at [iyzico.com](https://www.iyzico.com) → Merchant Panel → API Keys. Sandbox credentials are provided immediately upon registration.

---

## 3. PayTR (HMAC Direct Post)

PayTR uses an HMAC-signed token system for secure payment processing. It's widely used for high-volume Turkish e-commerce.

### Environment Variables

```env
PAYMENT_PROVIDER=paytr

PAYTR_MERCHANT_ID=your-merchant-id
PAYTR_MERCHANT_KEY=your-merchant-key
PAYTR_MERCHANT_SALT=your-merchant-salt

PAYTR_BASE_URL=https://www.paytr.com
```

> [!NOTE]
> PayTR does not offer a traditional sandbox environment. Use their test card numbers on the live integration in test mode (activated in the merchant panel).

### 3D Secure Flow

```
Storefront         Worker API          PayTR
    |                   |                   |
    |-- POST /checkout ->|                   |
    |                   |-- POST /odeme/api/v1 (HMAC token) →
    |                   |<-- { token }
    |<-- Render PayTR iframe (token)
    |-- User enters card in PayTR's iframe
    |-- PayTR POSTs result to /payment/callback
    |-- POST /payment/callback (PayTR result)
    |<-- Order confirmed|                   |
```

### HMAC Token Generation

The API generates the required HMAC hash from order details and merchant credentials:

```javascript
import crypto from 'node:crypto';

function generatePayTRToken(env, orderData) {
  const hashStr = [
    env.PAYTR_MERCHANT_ID,
    orderData.email,
    orderData.paymentAmount, // in kuruş (1 TL = 100 kuruş)
    orderData.merchantOid,
    orderData.okUrl,
    orderData.failUrl,
    orderData.currency,
    orderData.testMode,
    env.PAYTR_MERCHANT_SALT
  ].join('');

  return crypto
    .createHmac('sha256', env.PAYTR_MERCHANT_KEY)
    .update(hashStr)
    .digest('base64');
}
```

### Getting Credentials

Register at [paytr.com](https://www.paytr.com) → Merchant application → After approval, credentials are provided in the merchant panel.

---

## Local Development

For local development, use test/sandbox credentials. Never use production credentials locally.

In `api/.env`:
```env
NODE_ENV=development
PAYMENT_PROVIDER=param  # or iyzico or paytr

# Use test credentials from your gateway's developer portal
```

> [!IMPORTANT]
> The `api/.env` file is listed in `.gitignore` and must never be committed to version control. Use `api/.env.example` as a template (it contains only placeholder values).

---

## Adding a New Gateway

The payment service is implemented using a **Strategy Pattern**. To add a new gateway (e.g., `stripe`):

1. Create `api/src/services/payment/stripeService.js` implementing the common interface:
   - `initiatePayment(orderData, env)` → returns `{ redirectUrl }` or `{ htmlContent }`
   - `verifyPayment(callbackData, env)` → returns `{ success, transactionId }`

2. Register the strategy in `api/src/services/paymentService.js`:
   ```javascript
   const GATEWAYS = {
     param:  () => import('./payment/paramService.js'),
     iyzico: () => import('./payment/iyzicoService.js'),
     paytr:  () => import('./payment/paytrService.js'),
     stripe: () => import('./payment/stripeService.js'), // new
   };
   ```

3. Set `PAYMENT_PROVIDER=stripe` in your environment.

---

## Related Documentation

- [KVKK Compliance](kvkk_compliance.md) — how payment PII is handled at the edge
- [Cloudflare Deployment Guide](cloudflare_deployment_guide.md) — setting secrets in Wrangler
