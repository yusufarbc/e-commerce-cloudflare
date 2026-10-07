/**
 * Compares two strings in time that does not depend on where they first differ,
 * so gateway signatures cannot be guessed byte by byte through response timing.
 *
 * @param {string} a - Expected value.
 * @param {string} b - Received value.
 * @returns {boolean} True if both are strings with identical content.
 */
export function timingSafeEqual(a, b) {
    if (typeof a !== 'string' || typeof b !== 'string') return false;
    const encoder = new TextEncoder();
    const left = encoder.encode(a);
    const right = encoder.encode(b);
    let diff = left.length ^ right.length;
    for (let i = 0; i < left.length; i++) {
        diff |= left[i] ^ (right[i] ?? 0);
    }
    return diff === 0;
}
