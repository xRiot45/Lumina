export const CARTS_COMMAND_PATTERN = {
    ADD_TO_CART: { cmd: 'add_to_cart' },
    GET_CART: { cmd: 'get_cart' },
    DELETE_ITEM_FROM_CART: { cmd: 'delete_item_from_cart' },
    DELETE_CART: { cmd: 'delete_cart' },
    UPDATE_ITEM_QUANTITY: { cmd: 'update_item_quantity' },
} as const;
