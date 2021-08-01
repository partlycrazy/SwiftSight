import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { APIService } from 'src/app/core/http/api.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatTableDataSource } from '@angular/material/table';
import { Item, Shipment } from 'src/app/shared/interfaces';

@Component({
  selector: 'app-shipment',
  templateUrl: './shipment.component.html',
  styleUrls: ['./shipment.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})

export class ShipmentComponent implements OnInit, AfterViewInit {

  @Input() hospital_id: number
  
  tableDef: Array<any> = [
    {
      key: "order_id",
      header: "Order ID"
    },
    {
      key: "supplier_name",
      header: "Supplier Name"
    },
    {
      key: 'order_date',
      header: "Order Date"
    },
    {
      key: "icon",
      header: ""
    }
  ]

  dataSource: MatTableDataSource<(Shipment & { expanded: boolean })>

  columnsToDisplay = ['order_id', 'order_date', 'supplier_name', 'icon'];

  columnsToDisplay2 = ['product_name', 'category_name', 'production'];

  expandedElement: null;

  constructor(private APIService: APIService) { }

  ngOnInit(): void {
    this.init();
  }

  async init() {
    let results = await this.APIService.getUpcomingShipments(this.hospital_id).toPromise();
    let shipmentArray: (Shipment & { expanded: boolean})[] = []
    for (let i = 0; i < results.length; i++) {
      let exist = shipmentArray.filter((e: any) => e.order_id === results[i].order_id)
      let newItem: Item = {
        product_id: results[i].product_id,
        product_name: results[i].title,
        category_id: results[i].category_id,
        category_name: results[i].category_title,
        production: results[i].quantity
      }

      if (exist.length == 0) {
        
        let newShipment: (Shipment & { expanded: boolean }) = {
          order_id: results[i].order_id,
          order_date: new Date(results[i].time_created).toDateString(),
          supplier_name: results[i].supplier_name,
          expanded: false,
          items: new Array<Item>(newItem)
        }
        shipmentArray.push(newShipment);
      } else {
        exist[0].items.push(newItem);
      }
    }
    console.log(shipmentArray);
    this.dataSource = new MatTableDataSource<(Shipment & { expanded: boolean })>(shipmentArray);
  }

  expandRow(elem: Shipment) {

    this.dataSource.data.forEach((shipment: any) => {
      if (shipment.order_id === elem.order_id) {
        shipment.expanded = !shipment.expanded;
      }
      return shipment;
    })

    // this.dataSource.map((tab) => {
    //   if (tab.item.id == elem.category_id) {
    //     tab.supplier.data.map((supp) => {
    //       if(supp.name === elem.name) {
    //         supp.expanded = !supp.expanded;
    //       }
    //       return supp;
    //     })
    //   }
    // })

  }

  ngAfterViewInit() {  }

}

interface ShipmentTab {

}