import { useState, useEffect, useCallback } from 'react';
import { products as mockProducts, Product } from '@/mocks/products';
import { productsApi } from '@/api/products';

interface UseProductsResult {
  products: Product[];
  loading: boolean;
  refetch: () => void;
}

export function useProducts(): UseProductsResult {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [loading, setLoading] = useState(true);

  const merge = useCallback((apiProducts: Awaited<ReturnType<typeof productsApi.getAll>>) => {
    return mockProducts.map((mock) => {
      const api = apiProducts.find((p) => p.slug === mock.id);
      return api ? { ...mock, stock: api.stock } : mock;
    });
  }, []);

  const fetchProducts = useCallback(() => {
    setLoading(true);
    productsApi.getAll()
      .then((apiProducts) => setProducts(merge(apiProducts)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [merge]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return { products, loading, refetch: fetchProducts };
}
