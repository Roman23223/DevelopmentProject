// Типы действий — константами, чтобы опечатка падала сразу,
// а не превращалась в молча проигнорированный dispatch
export const PRODUCT_ACTIONS = {
  ADD: 'add',
  UPDATE: 'update',
  DELETE: 'delete',
  ADJUST_QUANTITY: 'adjustQuantity',
};

export function productsReducer(state, action) {
  switch (action.type) {
    case PRODUCT_ACTIONS.ADD:
      // payload — готовый товар, уже с id и createdAt
      return [...state, action.payload];

    case PRODUCT_ACTIONS.UPDATE:
      // payload — товар целиком, с тем же id
      return state.map((p) => (p.id === action.payload.id ? action.payload : p));

    case PRODUCT_ACTIONS.DELETE:
      // payload — просто id
      return state.filter((p) => p.id !== action.payload);

    case PRODUCT_ACTIONS.ADJUST_QUANTITY: {
      const { id, delta } = action.payload;
      return state.map((p) =>
        p.id === id ? { ...p, quantity: Math.max(0, p.quantity + delta) } : p
      );
    }

    default:
      throw new Error(`Неизвестное действие: ${action.type}`);
  }
}