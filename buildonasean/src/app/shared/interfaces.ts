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
    item_id: number;
    max_production: number;
    address: string;
    email_address: string;
}
