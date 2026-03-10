export const PRODUCT_CATEGORIES_COMMAND_PATTERN = {
    CREATE_PRODUCT_CATEGORY: { cmd: 'create_product_category' },
    FIND_ALL_PRODUCT_CATEGORIES: { cmd: 'find_all_product_categories' },
    FIND_PRODUCT_CATEGORY_BY_SLUG: { cmd: 'find_product_category_by_slug' },
    FIND_PRODUCT_CATEGORY_BY_ID: { cmd: 'find_product_category_by_id' },
    UPDATE_PRODUCT_CATEGORY: { cmd: 'update_product_category' },
    DELETE_PRODUCT_CATEGORY: { cmd: 'delete_product_category' },
} as const;
