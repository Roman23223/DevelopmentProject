// Типы действий — константами, чтобы опечатка падала сразу,
// а не превращалась в молча проигнорированный dispatch
export const PRODUCT_ACTIONS = {
  ADD: 'add',
  UPDATE: 'update',
  DELETE: 'delete',
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

    default:
      throw new Error(`Неизвестное действие: ${action.type}`);
  }
}