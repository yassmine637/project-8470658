import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { ReactNode } from 'react';
import { CartProvider, useCart } from '@/hooks/useCart';
import { Product } from '@/mocks/products';

const mockProduct: Product = {
  id: 'test-product',
  name: "Huile d'olive FENDRI",
  volume: 'Test 500ml',
  price: 42,
  currency: 'TND',
  tagline: 'Test tagline',
  description: 'Test description',
  details: ['Détail 1', 'Détail 2'],
  image: '/test-image.jpg',
  badge: 'Test',
  accentColor: '#c9a84c',
};

const wrapper = ({ children }: { children: ReactNode }) => (
  <CartProvider>{children}</CartProvider>
);

describe('useCart', () => {
  it('starts with an empty cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    expect(result.current.items).toHaveLength(0);
    expect(result.current.totalCount).toBe(0);
    expect(result.current.totalPrice).toBe(0);
  });

  it('adds a product to the cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart(mockProduct);
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].product.id).toBe('test-product');
    expect(result.current.items[0].quantity).toBe(1);
    expect(result.current.totalCount).toBe(1);
    expect(result.current.totalPrice).toBe(42);
  });

  it('increments quantity when adding the same product twice', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart(mockProduct);
      result.current.addToCart(mockProduct);
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].quantity).toBe(2);
    expect(result.current.totalCount).toBe(2);
    expect(result.current.totalPrice).toBe(84);
  });

  it('removes a product from the cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => { result.current.addToCart(mockProduct); });
    act(() => { result.current.removeFromCart('test-product'); });

    expect(result.current.items).toHaveLength(0);
    expect(result.current.totalCount).toBe(0);
  });

  it('updates quantity of a product', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => { result.current.addToCart(mockProduct); });
    act(() => { result.current.updateQuantity('test-product', 5); });

    expect(result.current.items[0].quantity).toBe(5);
    expect(result.current.totalCount).toBe(5);
    expect(result.current.totalPrice).toBe(210);
  });

  it('does not update quantity below 1', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => { result.current.addToCart(mockProduct); });
    act(() => { result.current.updateQuantity('test-product', 0); });

    expect(result.current.items[0].quantity).toBe(1);
  });

  it('clears all items from the cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart(mockProduct);
      result.current.addToCart({ ...mockProduct, id: 'other-product' });
    });
    act(() => { result.current.clearCart(); });

    expect(result.current.items).toHaveLength(0);
    expect(result.current.totalPrice).toBe(0);
  });

  it('opens and closes the cart drawer', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    expect(result.current.isOpen).toBe(false);
    act(() => { result.current.openCart(); });
    expect(result.current.isOpen).toBe(true);
    act(() => { result.current.closeCart(); });
    expect(result.current.isOpen).toBe(false);
  });

  it('opens cart drawer automatically when adding a product', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => { result.current.addToCart(mockProduct); });

    expect(result.current.isOpen).toBe(true);
  });

  it('throws when used outside CartProvider', () => {
    expect(() => renderHook(() => useCart())).toThrow(
      'useCart must be used within CartProvider'
    );
  });
});
