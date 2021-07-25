export interface Hospital {
    id: number;
    name: string;
    items: Array<Inventory>
}

export interface Inventory {
    id: number;
    name: string;
    qty: number;
}