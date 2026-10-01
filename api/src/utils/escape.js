/**
 * Escapes a value for use as text inside HTML or XML markup (element content or
 * a quoted attribute). Null and undefined become an empty string.
 *
 * Use it for every customer- or admin-supplied value interpolated into email
 * HTML, sitemaps and SOAP bodies; template strings do not escape on their own.
 *
 * @param {unknown} value
 * @returns {string}
 */
export const escapeMarkup = (value) => {
    if (value === null || value === undefined) return '';
    return String(value).replace(/[&<>"']/g, (ch) => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&apos;',
    })[ch]);
};

/**
 * Removes CR/LF so a value cannot start a new header line in a raw MIME message.
 *
 * @param {unknown} value
 * @returns {string}
 */
export const stripLineBreaks = (value) => String(value ?? '').replace(/[\r\n]+/g, ' ');
