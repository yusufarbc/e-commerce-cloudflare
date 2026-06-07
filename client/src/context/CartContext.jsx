import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

/**
 * CartContext Provider.
 * Manages the shopping cart state, including items, sidebar visibility, and totals.
 * 
 * @param {Object} props - Component props.
 * @param {React.ReactNode} props.children - Child components.
 */
export function CartProvider({ children }) {
    const getCartItemKey = (productId, selectedColor) => `${productId}::${selectedColor || 'default'}`;

    const [cartItems, setCartItems] = useState(() => {
        const savedCart = localStorage.getItem('cart');
        if (!savedCart) return [];

        const parsed = JSON.parse(savedCart);
        if (!Array.isArray(parsed)) return [];

        return parsed.map((item) => ({
            ...item,
            cartKey: item.cartKey || getCartItemKey(item.id, item.selectedColor)
        }));
    });
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems]);

    /**
     * Adds a product to the cart.
     * @param {Object} product - The product to add.
     */
    const addToCart = (product) => {
        setCartItems((prev) => {
            const selectedColor = product.selectedColor || null;
            const cartKey = getCartItemKey(product.id, selectedColor);
            const existing = prev.find((item) => item.cartKey === cartKey);

            if (existing) {
                return prev.map((item) =>
                    item.cartKey === cartKey ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...prev, { ...product, selectedColor, cartKey, quantity: 1 }];
        });
        setIsSidebarOpen(true);
    };

    /**
     * Removes a product from the cart by ID.
     * @param {string} productId - The product ID to remove.
     */
    const removeFromCart = (cartKey) => {
        setCartItems((prev) => prev.filter((item) => item.cartKey !== cartKey));
    };

    /**
     * Updates the quantity of a cart item.
     * @param {string} productId - The product ID.
     * @param {number} delta - The change in quantity (+1 or -1).
     */
    const updateQuantity = (cartKey, delta) => {
        setCartItems((prev) =>
            prev.map((item) => {
                if (item.cartKey === cartKey) {
                    const newQuantity = Math.max(1, item.quantity + delta);
                    return { ...item, quantity: newQuantity };
                }
                return item;
            })
        );
    };

    const clearCart = () => setCartItems([]);

    const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
    const closeSidebar = () => setIsSidebarOpen(false);

    // Using Turkish field 'fiyat' from schema, prefer indirimliFiyat if available
    const cartTotal = cartItems.reduce((sum, item) => {
        const price = Number(item.indirimliFiyat || item.fiyat) || 0;
        return sum + price * item.quantity;
    }, 0);
    const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <CartContext.Provider
            value={{
                cartItems,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                isSidebarOpen,
                toggleSidebar,
                closeSidebar,
                cartTotal,
                cartCount,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

/**
 * Custom hook to use the CartContext.
 * @returns {Object} The cart context value including state and methods.
 */
export const useCart = () => useContext(CartContext);
