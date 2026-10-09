import { createContext, useContext } from 'react';

// Контекст для dispatch. null — значение по умолчанию,
// оно подставится, если потребитель окажется вне провайдера.
export const ProductsDispatchContext = createContext(null);

// Свой хук вместо прямого useContext — чтобы ошибка была понятной
export function useProductsDispatch() {
  const dispatch = useContext(ProductsDispatchContext);
  if (dispatch === null) {
    throw new Error('useProductsDispatch вызван вне ProductsDispatchContext.Provider');
  }
  return dispatch;
}