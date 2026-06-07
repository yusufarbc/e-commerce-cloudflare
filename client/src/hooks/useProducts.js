import { useState, useEffect } from 'react';
import { fetchProducts, fetchProductById, fetchProductBySlug } from '../services/apiService';

/**
 * Custom hook for fetching and managing products
 * Implements Single Responsibility Principle - only handles product data logic
 * 
 * @param {Object} filters - Optional filters (markaId, kategoriId, search)
 * @returns {Object} { products, loading, error, refetch }
 */
export const useProducts = (filters = {}) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchProducts(filters);
            setProducts(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [JSON.stringify(filters)]); // Re-fetch when filters change

    return {
        products,
        loading,
        error,
        refetch: fetchData
    };
};

/**
 * Custom hook for fetching a single product by ID
 * 
 * @param {string} productId - Product ID
 * @returns {Object} { product, loading, error, refetch }
 */
export const useProduct = (productId) => {
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = async () => {
        if (!productId) {
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);
        try {
            // Determine if input is UUID (ID) or Slug
            const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(productId);

            let data;
            if (isUuid) {
                data = await fetchProductById(productId);
            } else {
                data = await fetchProductBySlug(productId);
            }

            setProduct(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [productId]);

    return {
        product,
        loading,
        error,
        refetch: fetchData
    };
};

/**
 * Custom hook for product filtering and search
 * Separates filtering logic from UI components
 * 
 * @param {Array} products - Array of products to filter
 * @param {string} searchQuery - Search query string
 * @param {Array} categories - Array of categories for category detection
 * @returns {Object} { filteredProducts, activeCategory }
 */
export const useProductFilter = (products, searchQuery, categories) => {
    const [filteredProducts, setFilteredProducts] = useState(products);
    const [activeCategory, setActiveCategory] = useState(null);

    useEffect(() => {
        let result = products;

        // Check if search query matches a category name
        const matchedCategory = categories.find(
            c => c.ad.toLowerCase() === searchQuery.toLowerCase()
        );

        if (matchedCategory) {
            setActiveCategory(matchedCategory);
            result = result.filter(
                p => p.kategoriId === matchedCategory.id ||
                    p.kategori?.ad?.toLowerCase() === searchQuery.toLowerCase()
            );
        } else {
            setActiveCategory(null);

            // Text search in product name and description
            if (searchQuery) {
                result = result.filter(p =>
                    p.ad.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    (p.aciklama && p.aciklama.toLowerCase().includes(searchQuery.toLowerCase()))
                );
            }
        }

        setFilteredProducts(result);
    }, [searchQuery, products, categories]);

    return {
        filteredProducts,
        activeCategory
    };
};
