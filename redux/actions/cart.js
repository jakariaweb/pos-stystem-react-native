import {
  ADD_CART,
  DECREMENT_CART,
  INCREMENT_CART,
  REMOVE_CART,
  REMOVE_ITEMS,
} from '../constants'

export const addToCart = (id, title, qty, price, stock) => {
  return {
    type: ADD_CART,
    payload: {
      id: id,
      title: title,
      qty: qty,
      price: price,
      stock: stock,
    },
  }
}

export const removeFromCart = id => {
  return {
    type: REMOVE_CART,
    payload: {
      id,
    },
  }
}

export const increment = (id, qty) => {
  return {
    type: INCREMENT_CART,
    payload: {
      id,
      qty,
    },
  }
}

export const decrement = (id, qty) => {
  return {
    type: DECREMENT_CART,
    payload: {
      id,
      qty,
    },
  }
}

export const emptyCart = () => {
  return {
    type: REMOVE_ITEMS,
    payload: {},
  }
}
