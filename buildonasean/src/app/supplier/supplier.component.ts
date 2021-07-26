import { Component, OnInit } from '@angular/core';
import { APIService } from '../api.service';
import { Supplier } from './supplier';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-supplier',
  templateUrl: './supplier.component.html',
  styleUrls: ['./supplier.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class SupplierComponent implements OnInit {

  constructor(private APIService: APIService) { }

  suppliers: Supplier[] = []
  expandedElement: Supplier | null;

  columnsToDisplay = ['id', 'name', 'icon'];

  ngOnInit(): void {
    this.APIService.getSuppliers().subscribe(suppliers => {
      this.suppliers = suppliers;
    })
  }

}
