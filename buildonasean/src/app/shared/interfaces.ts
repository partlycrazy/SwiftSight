export interface Hospital {
    id: number;
    name: string;
    items: Inventory[];
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
}
