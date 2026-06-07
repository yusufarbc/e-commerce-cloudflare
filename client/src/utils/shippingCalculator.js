/**
 * Shipping calculation utilities
 * Simplified: Only free shipping threshold and desi-based calculation
 */

/**
 * Calculate total desi (volumetric weight) for cart items
 * @param {Array} cartItems - Array of cart items with desi and quantity
 * @returns {number} Total desi
 */
/**
 * Calculate total weight (formerly desi) for cart items
 * @param {Array} cartItems - Array of cart items with agirlik and quantity
 * @returns {number} Total weight in kg
 */
export const calculateTotalWeight = (cartItems) => {
    return cartItems.reduce((acc, item) => {
        const itemWeight = Number(item.agirlik || 1);
        return acc + (itemWeight * item.quantity);
    }, 0);
};

/**
 * Calculate shipping fee based on cart total and weight (Tiered Pricing)
 * @param {Object} params - Calculation parameters
 * @param {number} params.cartTotal - Total cart value
 * @param {number} params.totalWeight - Total weight
 * @param {Object} params.settings - Settings object with shipping configuration
 * @returns {Object} { shippingFee, isFreeShipping }
 */
export const calculateShippingFee = ({ cartTotal, totalWeight, settings }) => {
    const freeShippingThreshold = Number(settings.ucretsizKargoAltLimit || 10000);
    // kargoDesiCarpani is deprecated in favor of tiered logic, but kept for legacy if needed
    // const minimumShippingFee = 50; // No longer needed as tiers cover this

    let shippingFee = 0;
    let isFreeShipping = false;

    // Check if cart total qualifies for free shipping
    // DEPRECATED: Free shipping disabled by admin request
    /*
    if (cartTotal >= freeShippingThreshold) {
        shippingFee = 0;
        isFreeShipping = true;
    }
    else {
    */
    // 1. Dynamic check from Admin Panel Settings
    const priceList = settings.kargoFiyatListesi;

    if (Array.isArray(priceList) && priceList.length > 0) {
        // Sort list by maxWeight
        const sortedList = [...priceList].sort((a, b) => a.maxWeight - b.maxWeight);
        const matchingTier = sortedList.find(tier => totalWeight <= tier.maxWeight);

        if (matchingTier) {
            shippingFee = Number(matchingTier.price);
        } else {
            // Exceeds max weight logic
            const lastTier = sortedList[sortedList.length - 1];
            const extraWeight = Math.ceil(totalWeight - lastTier.maxWeight);
            shippingFee = Number(lastTier.price) + (extraWeight * 15.00);
        }
    }
    // 2. Fallback check (Hardcoded if no settings)
    else {
        if (totalWeight <= 1) shippingFee = 65.00;
        else if (totalWeight <= 2) shippingFee = 85.00;
        else if (totalWeight <= 3) shippingFee = 105.00;
        else if (totalWeight <= 4) shippingFee = 125.00;
        else if (totalWeight <= 5) shippingFee = 145.00;
        else if (totalWeight <= 10) shippingFee = 200.00;
        else if (totalWeight <= 20) shippingFee = 350.00;
        else if (totalWeight <= 35) shippingFee = 550.00;
        else if (totalWeight <= 50) shippingFee = 800.00;
        else if (totalWeight <= 75) shippingFee = 1200.00;
        else if (totalWeight <= 100) shippingFee = 1600.00;
        else {
            // 100 kg+ calculation: Contact Sales
            shippingFee = null;
        }
    }


    return {
        shippingFee,
        isFreeShipping,
        weightError: shippingFee === null // Flag to indicate weight limit exceeded
    };
};


/**
 * Get shipping info message for display
 * @param {Object} shippingInfo - Result from calculateShippingFee
 * @param {number} cartTotal - Current cart total
 * @param {number} freeShippingThreshold - Free shipping threshold
 * @returns {string|null} Message to display, or null if no message needed
 */
export const getShippingMessage = (shippingInfo, cartTotal, freeShippingThreshold) => {
    if (shippingInfo.isFreeShipping && cartTotal >= freeShippingThreshold) {
        return '✓ Ücretsiz Kargo kazandınız!';
    }

    if (!shippingInfo.isFreeShipping) {
        // Free shipping is disabled, so we don't show "Add X TL more" message anymore.
        return null;
    }

    return null;
};
