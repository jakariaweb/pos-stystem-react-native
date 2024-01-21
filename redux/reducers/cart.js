import {
  ADD_CART,
  DECREMENT_CART,
  INCREMENT_CART,
  REMOVE_CART,
  REMOVE_ITEMS,
} from '../constants'

const cartReducer = (state = {cart: []}, action) => {
  switch (action.type) {
    case ADD_CART:
      const item = action.payload

      const existItem = state.cart.find(p => p.id === item.id)

      if (existItem) {
        return {
          ...state,
          cart: state.cart.map(item =>
            item.id === action.payload.id ? {...item, qty: item.qty + 1} : item,
          ),
        }
      } else {
        return {
          ...state,
          cart: [...state.cart, item],
        }
      }
    case REMOVE_CART:
      return {
        ...state,
        cart: state.cart.filter(c => c.id !== action.payload.id),
      }
    case INCREMENT_CART:
      const itemIn = action.payload
      const existItemIn = state.cart.find(p => p.id === itemIn.id)
      if (existItemIn) {
        return {
          ...state,
          cart: state.cart.map(item =>
            item.id === action.payload.id ? {...item, qty: item.qty + 1} : item,
          ),
        }
      }
    case DECREMENT_CART:
      const itemDe = action.payload
      const existItemDe = state.cart.find(p => p.id === itemDe.id)
      if (existItemDe) {
        return {
          ...state,
          cart: state.cart.map(item =>
            item.id === action.payload.id ? {...item, qty: item.qty - 1} : item,
          ),
        }
      }
    case REMOVE_ITEMS:
      return {
        ...state,
        cart: [],
      }
    default:
      return state
  }
}
export default cartReducer
