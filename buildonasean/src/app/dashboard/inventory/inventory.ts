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