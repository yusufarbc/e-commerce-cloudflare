/**
 * Shipping calculation utilities
 * Supports 4 policies: UCRETSIZ, SABIT_UCRET, SEPET_LIMITI, and AGIRLIK_KADEMELI
 */

/**
 * Calculate total weight for cart items
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
 * Calculate shipping fee based on cart total, weight, and policy settings
 * @param {Object} params - Calculation parameters
 * @param {number} params.cartTotal - Total cart value
 * @param {number} params.totalWeight - Total weight in kg
 * @param {Object} params.settings - Settings object with shipping configuration
 * @returns {Object} { shippingFee, isFreeShipping, weightError }
 */
export const calculateShippingFee = ({ cartTotal, totalWeight, settings }) => {
    const policy = settings?.kargoPolitikaTuru || 'SABIT_UCRET';
    const sabitUcret = settings?.kargoSabitUcret !== undefined ? Number(settings.kargoSabitUcret) : 0;
    const ucretsizKargoAltLimit = settings?.ucretsizKargoAltLimit !== undefined ? Number(settings.ucretsizKargoAltLimit) : 5000;
    const weightMultiplier = settings?.kargoAgirlikCarpani > 0 ? Number(settings.kargoAgirlikCarpani) : 15.00;

    let shippingFee = 0;
    let isFreeShipping = false;
    let weightError = false;

    if (policy === 'UCRETSIZ') {
        shippingFee = 0;
        isFreeShipping = true;
    } else if (policy === 'SABIT_UCRET') {
        shippingFee = sabitUcret;
        isFreeShipping = (shippingFee === 0);
    } else if (policy === 'SEPET_LIMITI') {
        if (cartTotal >= ucretsizKargoAltLimit) {
            shippingFee = 0;
            isFreeShipping = true;
        } else {
            shippingFee = sabitUcret;
            isFreeShipping = (shippingFee === 0);
        }
    } else if (policy === 'AGIRLIK_KADEMELI') {
        // Dynamic weight-based pricing
        let priceList = settings?.kargoFiyatListesi;
        if (typeof priceList === 'string') {
            try {
                priceList = JSON.parse(priceList);
            } catch (e) {
                priceList = null;
            }
        }

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
                shippingFee = Number(lastTier.price) + (extraWeight * weightMultiplier);
            }
        } else {
            // Fallback check (Hardcoded if no settings or empty tiers)
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
                shippingFee = null;
                weightError = true;
            }
        }

        isFreeShipping = (shippingFee === 0);
    } else {
        // Fallback safety
        shippingFee = sabitUcret;
        isFreeShipping = (shippingFee === 0);
    }

    if (shippingFee !== null) {
        shippingFee = Number(Number(shippingFee).toFixed(2));
    }

    return {
        shippingFee,
        isFreeShipping,
        weightError
    };
};

/**
 * Get shipping info message for display
 * @param {Object} shippingInfo - Result from calculateShippingFee
 * @param {number} cartTotal - Current cart total
 * @param {Object} settings - Settings object
 * @returns {string|null} Message to display, or null if no message needed
 */
export const getShippingMessage = (shippingInfo, cartTotal, settings) => {
    if (shippingInfo.isFreeShipping) {
        return '✓ Ücretsiz Kargo kazandınız!';
    }

    const policy = settings?.kargoPolitikaTuru || 'SABIT_UCRET';
    if (policy === 'SEPET_LIMITI') {
        const ucretsizKargoAltLimit = settings?.ucretsizKargoAltLimit !== undefined ? Number(settings.ucretsizKargoAltLimit) : 5000;
        const diff = ucretsizKargoAltLimit - cartTotal;
        if (diff > 0) {
            return `Ücretsiz kargo için ${diff.toFixed(2)} TL daha ekleyin!`;
        }
    }

    return null;
};
