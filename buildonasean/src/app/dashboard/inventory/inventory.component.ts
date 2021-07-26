import { Component, Input, OnInit, OnChanges, Output, EventEmitter, ViewChild } from '@angular/core';
import { APIService } from '../../api.service';
import { Inventory } from './inventory';
import { MatTable } from '@angular/material/table';

@Component({
  selector: 'dashboard-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css'],
  providers: [APIService]
})
export class InventoryComponent implements OnInit, OnChanges{

  @Input() hospitalId: number;
  @Input() date: Date;
  @Output() selectedInventoryEvent = new EventEmitter<Inventory>();

  items: Inventory[] = []

  columnsToDisplay = ['name', 'qty'];

  @ViewChild(MatTable) table: MatTable<Inventory>;

  constructor(private hospitalService: APIService) { }

  ngOnInit(): void {
  }

  ngOnChanges(): void {
    console.log(`Changed Hospital ID is ${this.hospitalId}`);
    if (this.date == null || this.hospitalId == null) {
      return;
    }
    this.items=[];
    this.hospitalService.getInventory(this.hospitalId, this.date.toISOString()).subscribe((results: any) => {
      results.forEach((item: any)=> {
        let newItem: Inventory = {
          id: item.item_id,
          name: item.item_name,
          qty: item.total
        }
        this.items = [...this.items, newItem];
      })
    });
  }

  selectInventory(value: Inventory) {
    this.selectedInventoryEvent.emit(value);
  }  
}