import { addItem } from '@/lib/redux/features/cart.slicer';
import { AppStore, makeStore } from '@/lib/redux/store'
import React, { useRef } from 'react'
import { Provider } from 'react-redux'

export default function StoreProvider({ children }: { children: React.ReactNode }) {
  const storeRef = useRef<AppStore | undefined>(undefined);
  if (!storeRef.current) {
    storeRef.current = makeStore();
    const localCart = localStorage.getItem('cart');
    if (localCart) {
      storeRef.current.dispatch(addItem(JSON.parse(localCart)));
    }
  }
  const store = storeRef.current;

  return (
   <Provider store={store}>
      {children}
   </Provider>
  )
}
