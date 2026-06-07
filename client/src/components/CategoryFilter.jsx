import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../lib/axios';

/**
 * CategoryFilter Component.
 * Displays a horizontal scrollable list of categories for filtering products.
 * 
 * @param {Object} props - Component props.
 * @param {Function} props.onCategorySelect - Callback when a category is selected (receives categoryId or null).
 * @param {string|null} props.selectedCategory - Currently selected category ID.
 * @returns {JSX.Element} The rendered component.
 */
export function CategoryFilter({ onCategorySelect, selectedCategory }) {
    const { t } = useTranslation();
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await api.get('/api/v1/categories');
                setCategories(response.data);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        fetchCategories();
    }, []);

    return (
        <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar">
            <button
                onClick={() => onCategorySelect(null)}
                className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${selectedCategory === null
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
            >
                {t('home.allCategories')}
            </button>
            {categories.map((category) => (
                <button
                    key={category.id}
                    onClick={() => onCategorySelect(category.id)}
                    className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${selectedCategory === category.id
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                >
                    {category.ad}
                </button>
            ))}
        </div>
    );
}
