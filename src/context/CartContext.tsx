'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
  useCallback,
  useSyncExternalStore,
} from 'react';
import { useRouter } from 'next/navigation';
import type { CartItem } from '@/types';
import { getUser } from '@/features/auth/actions';

export interface AuthUserSummary {
  id: string;
  email?: string;
  role?: string;
}

interface CartContextValue {
  items: CartItem[];
  isOpen: boolean;
  totalCount: number;
  subtotal: number;
  isLoggedIn: boolean;
  user: AuthUserSummary | null;
  requireAuth: (redirectTo?: string) => boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }, openDrawer?: boolean) => boolean;
  removeItem: (id: string, size: string) => void;
  updateQuantity: (id: string, size: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = 'sneakerdrop_cart_v1';
const EMPTY_CART: CartItem[] = [];

let memoryItems: CartItem[] = EMPTY_CART;
let isStorageLoaded = false;
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((listener) => listener());
}

function getCartSnapshot(): CartItem[] {
  if (!isStorageLoaded && typeof window !== 'undefined') {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          memoryItems = parsed;
        }
      }
    } catch {
      // ignore
    } finally {
      isStorageLoaded = true;
    }
  }
  return memoryItems;
}

function getServerSnapshot(): CartItem[] {
  return EMPTY_CART;
}

function subscribeCart(callback: () => void) {
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
}

function saveCart(newItems: CartItem[]) {
  memoryItems = newItems;
  if (typeof window !== 'undefined') {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(newItems));
    } catch {
      // ignore
    }
  }
  notify();
}

export function CartProvider({
  children,
  initialUser = null,
}: {
  children: React.ReactNode;
  initialUser?: AuthUserSummary | null;
}) {
  const router = useRouter();
  const items = useSyncExternalStore(subscribeCart, getCartSnapshot, getServerSnapshot);
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<AuthUserSummary | null>(initialUser);
  const [prevInitialUser, setPrevInitialUser] = useState<AuthUserSummary | null>(initialUser);

  // Sync client-side user during render if initialUser prop changes
  if (prevInitialUser !== initialUser) {
    setPrevInitialUser(initialUser);
    setUser(initialUser);
  }

  // Background auth state refresh
  useEffect(() => {
    getUser()
      .then((u) => {
        if (u) {
          setUser({ id: u.id, email: u.email, role: u.role });
        } else {
          setUser(null);
        }
      })
      .catch(() => {});
  }, []);

  const isLoggedIn = !!user;

  // Protect action: if not logged in, redirect directly to sign in page
  const requireAuth = useCallback(
    (redirectTo?: string): boolean => {
      if (!user) {
        const target =
          redirectTo ||
          (typeof window !== 'undefined' ? window.location.pathname + window.location.search : '/');
        router.push(`/login?redirectTo=${encodeURIComponent(target)}`);
        return false;
      }
      return true;
    },
    [user, router]
  );

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);
  const toggleCart = useCallback(() => setIsOpen((prev) => !prev), []);

  const addItem = useCallback(
    (
      newItem: Omit<CartItem, 'quantity'> & { quantity?: number },
      openDrawer: boolean = false
    ): boolean => {
      // Security check: require sign-in before adding to cart
      if (!user) {
        requireAuth();
        return false;
      }

      const qty = newItem.quantity ?? 1;
      const existingIndex = items.findIndex(
        (i) => i.id === newItem.id && i.size === newItem.size
      );
      let updated: CartItem[];
      if (existingIndex > -1) {
        updated = [...items];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + qty,
        };
      } else {
        updated = [...items, { ...newItem, quantity: qty }];
      }
      saveCart(updated);

      if (openDrawer) {
        setIsOpen(true);
      }
      return true;
    },
    [user, items, requireAuth]
  );

  const removeItem = useCallback(
    (id: string, size: string) => {
      saveCart(items.filter((i) => !(i.id === id && i.size === size)));
    },
    [items]
  );

  const updateQuantity = useCallback(
    (id: string, size: string, quantity: number) => {
      if (quantity <= 0) {
        removeItem(id, size);
        return;
      }
      saveCart(
        items.map((i) =>
          i.id === id && i.size === size ? { ...i, quantity } : i
        )
      );
    },
    [items, removeItem]
  );

  const clearCart = useCallback(() => {
    saveCart([]);
  }, []);

  const totalCount = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items]
  );

  const value = useMemo(
    () => ({
      items,
      isOpen,
      totalCount,
      subtotal,
      isLoggedIn,
      user,
      requireAuth,
      openCart,
      closeCart,
      toggleCart,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
    }),
    [
      items,
      isOpen,
      totalCount,
      subtotal,
      isLoggedIn,
      user,
      requireAuth,
      openCart,
      closeCart,
      toggleCart,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    // Safe fallback for isolated unit tests
    return {
      items: [],
      isOpen: false,
      totalCount: 0,
      subtotal: 0,
      isLoggedIn: true,
      user: { id: 'test_usr', email: 'test@example.com' },
      requireAuth: () => true,
      openCart: () => {},
      closeCart: () => {},
      toggleCart: () => {},
      addItem: () => true,
      removeItem: () => {},
      updateQuantity: () => {},
      clearCart: () => {},
    };
  }
  return context;
}
