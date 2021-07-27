import { Component, Input, OnInit, OnChanges, Output, EventEmitter, ViewChild } from '@angular/core';
import { APIService } from '../../api.service';
import { Hospital, Inventory } from './inventory';
import { MatTable, MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'dashboard-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css'],
  providers: [APIService]
})
export class InventoryComponent implements OnInit, OnChanges {

  @Input() hospital: Hospital;
  @Input() date: Date;
  @Output() selectedInventoryEvent = new EventEmitter<Inventory>();

  // items = new MatTableDataSource<Inventory>();

  columnsToDisplay = ['name', 'qty'];

  @ViewChild(MatTable) table: MatTable<Inventory>;

  constructor(private hospitalService: APIService) { }

  ngOnInit(): void {
    // this.items.data = this.hospital.items;
  }

  ngOnChanges(): void {
    // console.log("Changing Hospital")
    // this.items= new MatTableDataSource<Inventory>();
    // this.hospitalService.getInventory(this.hospital.id, this.date.toISOString()).subscribe((results: any) => {
    //   console.log(results);
    //   results.forEach((item: any)=> {
    //     let newItem: Inventory = {
    //       id: item.item_id,
    //       name: item.item_name,
    //       qty: item.total
    //     }
    //     this.items.data = [...this.items.data, newItem];
    //   })
    // });
    // this.hospital.items = this.items.data;
  }

  selectInventory(value: Inventory) {
    this.selectedInventoryEvent.emit(value);
  }  
}