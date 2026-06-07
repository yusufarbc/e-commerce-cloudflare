/**
 * Validation utilities for form inputs
 * Implements Single Responsibility Principle - each function validates one thing
 * Reusable across different forms
 */

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid
 */
export const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

/**
 * Validate Turkish phone number
 * @param {string} phone - Phone number to validate (with or without formatting)
 * @returns {boolean} True if valid
 */
export const isValidPhone = (phone) => {
    const cleaned = phone.replace(/\D/g, '');
    return cleaned.length === 11 && cleaned.startsWith('05');
};

/**
 * Validate minimum length
 * @param {string} value - Value to validate
 * @param {number} minLength - Minimum required length
 * @returns {boolean} True if valid
 */
export const hasMinLength = (value, minLength) => {
    return value && value.length >= minLength;
};

/**
 * Validate required field
 * @param {any} value - Value to validate
 * @returns {boolean} True if not empty
 */
export const isRequired = (value) => {
    if (typeof value === 'string') {
        return value.trim().length > 0;
    }
    return value !== null && value !== undefined && value !== '';
};

/**
 * Validate checkout form - Step 1 (Address Info)
 * @param {Object} formData - Form data object
 * @returns {Object} Errors object (empty if no errors)
 */
export const validateCheckoutStep1 = (formData) => {
    const errors = {};

    // Full name validation
    if (!hasMinLength(formData.fullName, 2)) {
        errors.fullName = 'Ad Soyad en az 2 karakter olmalıdır.';
    }

    // Email validation
    if (!isValidEmail(formData.email)) {
        errors.email = 'Geçerli bir e-posta adresi giriniz.';
    }

    // Phone validation
    if (!isValidPhone(formData.phone)) {
        errors.phone = 'Telefon numarası eksik veya hatalı (05XX...)';
    }

    // Address validation
    if (!hasMinLength(formData.address, 10)) {
        errors.address = 'Adres en az 10 karakter olmalıdır.';
    }

    // City validation
    if (!isRequired(formData.city)) {
        errors.city = 'İl seçiniz.';
    }

    // District validation
    if (!isRequired(formData.district)) {
        errors.district = 'İlçe seçiniz.';
    }

    // Zip code validation
    if (!hasMinLength(formData.zipCode, 3)) {
        errors.zipCode = 'Posta kodu giriniz.';
    }

    // Corporate fields validation (if corporate invoice selected)
    if (formData.isCorporate) {
        if (!isRequired(formData.companyName)) {
            errors.companyName = 'Şirket ünvanı zorunludur.';
        }
        if (!isRequired(formData.taxOffice)) {
            errors.taxOffice = 'Vergi dairesi zorunludur.';
        }
        if (!isRequired(formData.taxNumber)) {
            errors.taxNumber = 'Vergi numarası zorunludur.';
        }
    }

    return errors;
};

/**
 * Validate checkout form - Step 2 (Agreements)
 * @param {Object} agreements - Agreements object
 * @returns {Object} Errors object (empty if no errors)
 */
export const validateCheckoutStep2 = (agreements) => {
    const errors = {};

    if (!agreements.salesAgreement) {
        errors.salesAgreement = 'Lütfen satış sözleşmesini onaylayınız.';
    }

    return errors;
};

/**
 * Check if errors object is empty
 * @param {Object} errors - Errors object
 * @returns {boolean} True if no errors
 */
export const hasNoErrors = (errors) => {
    return Object.keys(errors).length === 0;
};
