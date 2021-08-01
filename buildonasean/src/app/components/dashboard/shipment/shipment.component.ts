import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { APIService } from 'src/app/core/http/api.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatTableDataSource } from '@angular/material/table';
import { Item, Shipment } from 'src/app/shared/interfaces';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MAT_DIALOG_SCROLL_STRATEGY_FACTORY } from '@angular/material/dialog';

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

export class ShipmentComponent implements OnInit {

  @Input() hospital_id: number
  @Output() upcomingShipments = new EventEmitter<Shipment[]>();
  
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

  dataSource: MatTableDataSource<Shipment>

  columnsToDisplay = ['order_id', 'order_date', 'supplier_name'];
  columnsToDisplay2 = ['product_name', 'category_name', 'production'];

  

  expandedElement: null;

  constructor(private APIService: APIService, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.init();
  }

  async init() {
    let results = await this.APIService.getUpcomingShipments(this.hospital_id).toPromise();
    let shipmentArray: Shipment[] = []
    for (let i = 0; i < results.length; i++) {
      let exist = shipmentArray.filter((e: any) => e.order_id === results[i].order_id)
      let newItem: Item = {
        product_id: results[i].product_id,
        product_name: results[i].title,
        category_id: results[i].category_id,
        category_name: results[i].category_title,
        production: results[i].quantity,
        shipped: results[i].fulfilled
      }

      if (exist.length == 0) {
        
        let newShipment: (Shipment) = {
          order_id: results[i].order_id,
          order_date: new Date(results[i].time_created).toDateString(),
          supplier_name: results[i].supplier_name,
          items: new Array<Item>(newItem),
          estimated_delivery: 3
        }
        shipmentArray.push(newShipment);
      } else {
        exist[0].items.push(newItem);
      }
    }
    this.upcomingShipments.emit(shipmentArray);
    console.log(shipmentArray);
    this.dataSource = new MatTableDataSource<Shipment>(shipmentArray);
  }

  cloneShipment(shipment: Shipment) {
    let clonedShipment: Shipment = {
      order_id: shipment.order_id,
      order_date: shipment.order_date,
      supplier_name: shipment.supplier_name,
      items: new Array<Item>(),
      estimated_delivery: shipment.estimated_delivery
    }
    for (let i = 0; i < shipment.items.length; i++) {
      let clonedItem: Item = {
        category_id: shipment.items[i].category_id,
        category_name: shipment.items[i].category_name,
        product_id: shipment.items[i].product_id,
        product_name: shipment.items[i].product_name,
        production: shipment.items[i].production,
        shipped: shipment.items[i].shipped
      }
      clonedShipment.items.push(clonedItem);
    }
    return clonedShipment
  }

  expandRow(elem: Shipment) {
    let copiedElem: Shipment = this.cloneShipment(elem);
    const dialogRef = this.dialog.open(ShipmentDetails, {
      data: copiedElem
    })

    dialogRef.afterClosed().subscribe((result: Shipment) => {
      if (result === undefined) return;
      let oldShipment = this.dataSource.data.find(obj => obj.order_id === result.order_id);
      let difference = this.getItemDifference(oldShipment.items, result.items);
      console.log(difference);
      this.dataSource.data = this.dataSource.data.map(obj => (result.order_id === obj.order_id) ? result : obj);

      let updateShipment: Shipment = {
        order_id: result.order_id,
        items: difference
      }
      this.updateShipment(updateShipment);
      
    })
  }

  async updateShipment(body: Shipment) {
    let result: any = await this.APIService.updateShipment(body).toPromise();
    if (result === "Update Successful") {
      console.log(result);
      this.upcomingShipments.emit(this.dataSource.data);
    }
    
  }

  getItemDifference(oldShipment: Item[], newShipment: Item[]) {
    let output: Item[] = []
    for (let i = 0; i < oldShipment.length; i++) {
      if (oldShipment[i].shipped != newShipment[i].shipped) {
        output.push(newShipment[i]);
      }
    }
    return output;
  }
}



@Component({
  selector: 'shipment-details',
  templateUrl: 'shipment.details.html',
  styleUrls: ['./shipment.component.css'],
})
export class ShipmentDetails implements OnInit {

  tableDef: Array<any> = [
    {
      key: "product_name",
      header: "Product"
    },
    {
      key: "category_name",
      header: "Category"
    },
    {
      key: 'production',
      header: "Quantity"
    },
    {
      key: "shipped",
      header: "Arrived?"
    }
  ]
  
  columnsToDisplay2 = ['product_name', 'category_name', 'production', 'shipped'];

  columnsToDisplay3 = ['product_name', 'category_name', 'production'];
  estimatedDeliveryString: string

  itemDataSource: Item[];

  constructor(public dialogRef: MatDialogRef<ShipmentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Shipment) {}

  ngOnInit() {
    this.estimatedDeliveryString = this.deltaDate(new Date(this.data.order_date), this.data.estimated_delivery).toDateString();
    // this.data.items[0].shipped = true;
    // this.itemDataSource = this.data.items.slice();
  }

  deltaDate(dt: Date, amount: number): Date {
     return dt.setDate(dt.getDate() + amount) && dt;
  }

  closeDialog() {
    this.dialogRef.close();
  }

}