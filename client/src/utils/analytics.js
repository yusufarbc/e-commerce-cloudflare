import { getApiUrl } from '../lib/axios';

/**
 * Storefront Telemetry & Analytics Utility (GTM / GA4)
 * 
 * Routes GTM container loading and event collections through our
 * serverless edge metrics proxy to preserve KVKK privacy.
 */

// Default placeholder container ID if none is configured
const DEFAULT_GTM_ID = 'GTM-N8XXXXX';

/**
 * Initializes GTM by injecting the proxy script tag into the page header.
 * @param {string} [gtmId] - Optional Google Tag Manager Container ID.
 */
export function initGTM(gtmId = DEFAULT_GTM_ID) {
    if (typeof window === 'undefined') return;

    // Initialize dataLayer
    window.dataLayer = window.dataLayer || [];
    
    // Check if GTM is already initialized
    if (window.dataLayer.some(e => e.event === 'gtm.js')) {
        return;
    }

    // Push initial gtm.js event
    window.dataLayer.push({
        'gtm.start': new Date().getTime(),
        event: 'gtm.js'
    });

    try {
        // Resolve metrics API endpoint origin
        // If api is running on localhost:8787 (development) or same-origin production
        const apiOrigin = getApiUrl();
        const scriptUrl = `${apiOrigin}/api/v1/metrics/gtm.js?id=${gtmId}`;

        // Create script element
        const script = document.createElement('script');
        script.async = true;
        script.src = scriptUrl;

        // Append to document head
        const firstScript = document.getElementsByTagName('script')[0];
        if (firstScript && firstScript.parentNode) {
            firstScript.parentNode.insertBefore(script, firstScript);
        } else {
            document.head.appendChild(script);
        }
        console.log('[Telemetry] Initialized GTM proxy container: %s', gtmId);
    } catch (e) {
        console.error('[Telemetry] Failed to load GTM container proxy script:', e);
    }
}

/**
 * Safely pushes an event and ecommerce data to the global dataLayer.
 * @param {string} eventName - GA4 event name (e.g. 'view_item', 'add_to_cart').
 * @param {Object} [ecommerceData] - GA4 compliant ecommerce details.
 */
export function pushToDataLayer(eventName, ecommerceData = {}) {
    if (typeof window === 'undefined') return;

    window.dataLayer = window.dataLayer || [];
    
    // Clear the previous ecommerce object (recommended by Google to prevent persistence)
    window.dataLayer.push({ ecommerce: null });
    
    // Push new event
    const eventPayload = {
        event: eventName,
        ecommerce: {
            currency: 'TRY',
            ...ecommerceData
        }
    };
    
    window.dataLayer.push(eventPayload);
    console.log('[Telemetry Event] Push: %s', eventName, eventPayload);
}

/**
 * Track 'view_item' event.
 * @param {Object} product - Product model.
 */
export function trackViewItem(product) {
    if (!product) return;
    
    const price = product.indirimliFiyat ? Number(product.indirimliFiyat) : Number(product.fiyat);
    
    pushToDataLayer('view_item', {
        value: price,
        items: [{
            item_id: product.id,
            item_name: product.ad,
            price: price,
            item_brand: product.marka?.ad || 'E-Market',
            item_category: product.kategori?.ad || 'Genel',
            quantity: 1
        }]
    });
}

/**
 * Track 'add_to_cart' event.
 * @param {Object} product - Product model.
 * @param {number} quantity - Quantity added.
 * @param {string} [selectedColor] - Selected color.
 */
export function trackAddToCart(product, quantity, selectedColor) {
    if (!product) return;
    
    const price = product.indirimliFiyat ? Number(product.indirimliFiyat) : Number(product.fiyat);
    
    pushToDataLayer('add_to_cart', {
        value: price * quantity,
        items: [{
            item_id: product.id,
            item_name: product.ad,
            price: price,
            item_brand: product.marka?.ad || 'E-Market',
            item_category: product.kategori?.ad || 'Genel',
            quantity: quantity,
            item_variant: selectedColor || undefined
        }]
    });
}

/**
 * Track 'begin_checkout' event.
 * @param {Array} cartItems - Current items in the cart.
 * @param {number} totalValue - Total price of the cart.
 */
export function trackBeginCheckout(cartItems, totalValue) {
    if (!Array.isArray(cartItems) || cartItems.length === 0) return;
    
    pushToDataLayer('begin_checkout', {
        value: Number(totalValue),
        items: cartItems.map(item => {
            const price = item.indirimliFiyat ? Number(item.indirimliFiyat) : Number(item.fiyat);
            return {
                item_id: item.id,
                item_name: item.ad,
                price: price,
                item_brand: item.marka?.ad || 'E-Market',
                item_category: item.kategori?.ad || 'Genel',
                quantity: item.quantity,
                item_variant: item.selectedColor || undefined
            };
        })
    });
}

/**
 * Track 'purchase' event.
 * @param {string} transactionId - Unique order number.
 * @param {Array} cartItems - Purchased items.
 * @param {number} totalValue - Paid total.
 * @param {number} [shippingFee=0] - Paid shipping fee.
 */
export function trackPurchase(transactionId, cartItems, totalValue, shippingFee = 0) {
    if (!Array.isArray(cartItems) || cartItems.length === 0) return;
    
    pushToDataLayer('purchase', {
        transaction_id: transactionId,
        value: Number(totalValue),
        shipping: Number(shippingFee),
        items: cartItems.map(item => {
            const price = item.indirimliFiyat ? Number(item.indirimliFiyat) : Number(item.fiyat);
            return {
                item_id: item.id,
                item_name: item.ad,
                price: price,
                item_brand: item.marka?.ad || 'E-Market',
                item_category: item.kategori?.ad || 'Genel',
                quantity: item.quantity,
                item_variant: item.selectedColor || undefined
            };
        })
    });
}
