export const PRODUCTS_COMMAND_PATTERN = {
    CREATE_PRODUCT: { cmd: 'create_product' },
    FIND_ALL_PRODUCTS: { cmd: 'find_all_products' },
    FIND_PRODUCT_BY_SLUG: { cmd: 'find_product_by_slug' },
    FIND_PRODUCT_BY_ID: { cmd: 'find_product_by_id' },
    UPDATE_PRODUCT: { cmd: 'update_product' },
    DELETE_PRODUCT: { cmd: 'delete_product' },
} as const;

export const PRODUCTS_EVENT_PATTERN = {
    REDUCE_PRODUCT_VARIANT_STOCK: 'reduce_product_variant_stock',
} as const;
