import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EditItemService } from './edit-item.service';
import { ItemResponse } from './item-response';
import { MatDialog, MatTableDataSource } from '@angular/material';
import { NewTransactionComponent } from 'src/app/components/new-transaction/new-transaction.component';
import { NewItemNoteComponent } from 'src/app/components/new-item-note/new-item-note.component';
import { Transactions } from './transactions';
import * as moment from 'moment';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-edit-item',
  templateUrl: './edit-item.component.html',
  styleUrls: ['./edit-item.component.css']
})
export class EditItemComponent implements OnInit {

  item: any
  itemID: number
  storeID: number
  dataSource: any
  chartData: any
  loading: boolean = false;
  datePipe = new DatePipe('en-US')
  

  displayed = ['date', 'note', 'prev_quantity', 'inven_change']

  transactionModel: Transactions

  constructor(
    private edit: EditItemService,
    private route: ActivatedRoute,
    private dialog: MatDialog,
  ) {
    this.itemID = this.route.snapshot.queryParams.item;
    this.storeID = this.route.snapshot.queryParams.store;
  }

  renderTable() {
    this.dataSource = new MatTableDataSource<Transactions>(this.item.transactions);
  }
  
  generateGraph(transactions) {
    let categories = [];
    let values = [];
    transactions.forEach(element => {
      categories.push({label: this.datePipe.transform(element.date, 'short')})
      values.push({value: element.prev_quantity + element.inven_change})
    });

    this.chartData = {
      chart: {
        caption: this.item.item,
        subCaption: 'Stock over time',
        xAxisName: 'Time',
        yAxisName: 'Units on Hand',
        theme: 'candy',
        
      },
      trendlines: [{
        line: [{
            "color": "#FF6347",
            "thickness": "3",
            "alpha": "60",
            "value": this.item.par,
            "dashed": "1",
        }]
      }],
      categories: [
        {
          category: categories
        }
      ],
      dataset: [
        {
          "seriesname": this.item.item,
          "data": values
        }
      ]
    };
    
  }
  
  ngOnInit() {
    this.loading = true;
    this.edit.getItem(this.storeID, this.itemID)
    .subscribe(res =>{
      console.log(res);
      this.item = res;
      this.renderTable();
      this.generateGraph(this.item.transactions)
      this.loading = false;
    })
  }

  newTransaction() {
    const dialogRef = this.dialog.open(NewTransactionComponent);

    dialogRef.afterClosed().subscribe(
      data => {
        if (data) {
          let body = {
            date: data.date,
            prev_quantity: this.item.quantity,
            inven_change: Number(data.change),
            note: data.note,
            newSurplus: this.item.surplus + Number(data.change)
          }
          console.log(body);
          this.item.quantity = this.item.quantity + body.inven_change;
          this.item.surplus = this.item.surplus + Number(data.change);
          this.item.transactions = this.item.transactions.concat(body);
          this.renderTable();
          this.generateGraph(this.item.transactions);
          this.edit.newTransaction(this.itemID, body).subscribe(res => {
            console.log(res);
          })
        }
      }
    )
  }

  newNote() {
    const dialogRef = this.dialog.open(NewItemNoteComponent);

    dialogRef.afterClosed().subscribe(
      data => {
        if (data) {
          this.item.notes = this.item.notes.concat(data)
          this.edit.newItemNote(this.itemID, data)
          .subscribe(res => console.log(res))
        } 
      }
    )
  }
}
