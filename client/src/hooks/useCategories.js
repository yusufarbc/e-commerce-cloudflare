import { useState, useEffect } from 'react';
import { fetchCategories, fetchTopCategories } from '../services/apiService';

/**
 * Custom hook for fetching and managing categories
 * Implements Single Responsibility Principle - only handles category data logic
 * 
 * @param {boolean} topLevelOnly - If true, only fetch top-level categories
 * @returns {Object} { categories, loading, error, refetch }
 */
export const useCategories = (topLevelOnly = false) => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = topLevelOnly ? await fetchTopCategories() : await fetchCategories();
            setCategories(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [topLevelOnly]);

    return {
        categories,
        loading,
        error,
        refetch: fetchData
    };
};
