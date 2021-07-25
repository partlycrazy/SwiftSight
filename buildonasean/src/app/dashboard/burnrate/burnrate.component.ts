import { Component, OnInit, Input } from '@angular/core';
import { Inventory } from '../inventory/inventory';

@Component({
  selector: 'dashboard-burnrate',
  templateUrl: './burnrate.component.html',
  styleUrls: ['./burnrate.component.css']
})
export class BurnrateComponent implements OnInit {

  @Input() activeItem: Inventory

  constructor() { }

  ngOnInit(): void {
  }

}
