export interface Hospital {
    id: number;
    name: string;
    items: Inventory[];
    patients: number[];
}

export interface Inventory {
    id: number;
    name: string;
    qty: number;
}

export interface Supplier {
    id: number;
    name: string;
    expanded: boolean;
    category_id: number;
    item_model: Item[];
    max_production: number;
    address: string;
    email_address: string;
}

export interface Item {
    product_id: number;
    production: number;
}