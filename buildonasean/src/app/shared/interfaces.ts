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
    delivery_time?: string | undefined;
}

export interface Shipment {
    order_id?: number | undefined;
    order_date?: string | undefined;
    supplier_name?: string | undefined;
    items?: Item[] | undefined;
}

export interface Item {
    product_id?: number | undefined;
    product_name?: string | undefined;
    category_id?: number | undefined;
    category_name?: number | undefined;
    production?: number | undefined;
}