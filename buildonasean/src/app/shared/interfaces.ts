export interface Hospital {
    id?: number | undefined;
    name?: string | undefined;
    items?: Inventory[] | undefined;
    patients?: number[] | undefined;
}

export interface Inventory {
    id?: number | undefined;
    name?: string | undefined;
    qty?: number | undefined;
    days_left?: number | undefined;
}

export interface Supplier {
    id?: number | undefined;
    name?: string | undefined ;
    expanded?: boolean | undefined;
    category_id?: number | undefined;
    item_model?: Item[] | undefined;
    max_production?: number | undefined;
    address?: string | undefined;
    email_address?: string | undefined;
}

export interface Item {
    product_id?: number | undefined;
    production?: number | undefined;
}