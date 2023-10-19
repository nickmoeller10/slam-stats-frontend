import { Component, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { ColorTable } from 'src/app/models/color-table.model';
import { TableColumn } from 'src/app/models/table-column.model';


@Component({
  selector: 'app-crud-table',
  templateUrl: './crud-table.component.html',
  styleUrls: ['./crud-table.component.scss']
})
export class CrudTableComponent implements OnInit {


  @ViewChild(MatPaginator, { static: false })
  paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false })
  sort!: MatSort;
  @ViewChild(MatTable)
  table!: MatTable<any>;


  // @Input()
  // tableColumns!: TableColumn[];

  @Input() tableColumns: TableColumn[] = [];
  @Input()
  displayedColumns!: string[];
  
  @Input() paginationSizes: number[] = [10, 20, 50, 100];
  @Input() colorTable: ColorTable = {};
  totalRows = 10;
  @Input() hasFooter = false;
  @Input() hasFilter = false;
  @Input() isSelectable = false;
  @Input() basedOn = 'Averages';

  public tableDataSource = new MatTableDataSource();
  public selectedRows: any[] = [];

  // pass table data from parent component
  @Input() set tableData(data: any[]) {
    if (data != null) {
      this.setTableDataSource(data);
    }
  }


  constructor() { }


  ngOnInit(): void {
    this.displayedColumns = this.tableColumns.filter((tableColumn: TableColumn) => tableColumn.isViewable !== false)
    .map((tableColumn: TableColumn) => tableColumn.dataKey);
  }

  getTotal(dataKey: any): any {

    const column = this.tableColumns.find(x => x.dataKey === dataKey)
    let total: any;

    if (column != null && column.hasTotal){
      // FG% and FT% 
      if (dataKey === 'fieldGoalPercentage' ) {
        const fgAttempts = this.tableDataSource.filteredData.map((item: any) => item['fieldGoalsAttempted']);
        const fgsMade = this.tableDataSource.filteredData.map((item: any) => item['fieldGoalsMade']);

        // Totals of both FGA and FGM
        let totalFgas = fgAttempts.reduce((accumulator: number, currentValue: number) => accumulator + currentValue, 0);
        let totalFgms = fgsMade.reduce((accumulator: number, currentValue: number) => accumulator + currentValue, 0);

        // Divides the totals
        const percentage = totalFgas === 0 ? 0 : (totalFgms / totalFgas) * 100;

        // Convert to percentage
        const num = Number(percentage.toFixed(2));
        total = '' + num + '%';

      } else if (dataKey === 'freeThrowPercentage') {
        const ftAttempts = this.tableDataSource.filteredData.map((item: any) => item['freeThrowsAttempted']);
        const ftsMade = this.tableDataSource.filteredData.map((item: any) => item['freeThrowsMade']);

        // Totals of both FGA and FGM
        let totalFtas = ftAttempts.reduce((accumulator: number, currentValue: number) => accumulator + currentValue, 0);
        let totalFtms = ftsMade.reduce((accumulator: number, currentValue: number) => accumulator + currentValue, 0);

        // Divides the totals
        const percentage = totalFtas === 0 ? 0 : (totalFtms / totalFtas) * 100;

        // Convert to percentage
        const num = Number(percentage.toFixed(2));
        total = '' + num + '%';
      } else {
        // For all other categories, find sum
        const valuesArray = this.tableDataSource.filteredData.map((item: any) => item[dataKey]);
        valuesArray.forEach((val, index) => {
          if (val == null || val === undefined) {
              valuesArray[index] = 0;
          }
        });
        if (!valuesArray.includes(undefined)) {
          total = valuesArray.reduce((accumulator: number, currentValue: number) => accumulator + currentValue, 0)
          if (!Number.isInteger(total)) {

            total = total.toFixed(2)
          } 
        }

        if (valuesArray.length > 0 && this.basedOn === 'Averages') {
          total = (total / valuesArray.length).toFixed(2);
        }
      }
    }

    return total;
  }


  ngAfterViewInit() {
    //this.tableDataSource = new MatTableDataSource(this.playerInfo);
    this.tableDataSource.paginator = this.paginator;
    this.tableDataSource.sort = this.sort;
  }

  ngOnChanges(): void {
    this.displayedColumns = this.tableColumns.filter((tableColumn: TableColumn) => tableColumn.isViewable !== false)
    .map((tableColumn: TableColumn) => tableColumn.dataKey);
  }


  setTableDataSource(data: any) {
    this.tableDataSource = new MatTableDataSource<any>(data);
    this.tableDataSource.paginator = this.paginator;
    this.tableDataSource.sort = this.sort;
   // this.applySort();
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.tableDataSource.filter = filterValue.trim().toLowerCase();


    if (this.tableDataSource.paginator) {
      this.tableDataSource.paginator.firstPage();
    }
  }

  isSelected(row: any): boolean {
    return this.selectedRows.some(selectedRow => selectedRow === row);
  }

  toggleSelection(row: any): void {
    if (this.isSelectable) {
      const index = this.selectedRows.indexOf(row);
      if (index >= 0) {
        this.selectedRows.splice(index, 1); // Deselect row
      } else {
        this.selectedRows.push(row); // Select row
      }
    }
  }

  getColorBasedOnValue(element: any, dataKey: string): string | null {
    if (this.colorTable != null && this.colorTable.hasOwnProperty(dataKey) 
    && dataKey !== 'freeThrowsAttempted' && dataKey !== 'freeThrowsMade' && dataKey !== 'fieldGoalsAttempted' && dataKey !== 'fieldGoalsMade') {
      const currentValue = Number(element[dataKey]);
      // The potential value of the cell
      let elite = false;
      let great = false;
      let good = false;
      let average = false;
      let bad = false;
      let trash = false;
        
      // The 6 cutoff points of that category
      const stdValues = this.colorTable[dataKey as keyof ColorTable];

      // Assigns value of category
      if (stdValues != null) {

        if (dataKey === 'turnovers') {
          trash = currentValue > stdValues[5];
          bad = currentValue <= stdValues[5] && currentValue > stdValues[4];
          average = currentValue <= stdValues[4] && currentValue > stdValues[3];
          good = currentValue <= stdValues[3] && currentValue > stdValues[2];
          great = currentValue <= stdValues[2] && currentValue > stdValues[1];
          elite = currentValue <= stdValues[1];
        } else if (dataKey === 'fieldGoalPercentage' || dataKey === 'freeThrowPercentage') {

          const values = dataKey === 'fieldGoalPercentage'
          ? this.colorTable?.fieldGoalsAttempted ?? [] // Provide an empty array as a default value
          : this.colorTable?.freeThrowsAttempted ?? []; 

          const val = dataKey === 'fieldGoalPercentage'
          ? element?.fieldGoalsAttempted
          :  element?.freeThrowsAttempted 

          // Get current states of percentages
          let pctState = '';
          if (currentValue > stdValues[5]) {
            pctState = 'elite';
          } else if (currentValue <= stdValues[5] && currentValue > stdValues[4]) {
            pctState = 'great';
          } else if (currentValue <= stdValues[4] && currentValue > stdValues[3]) {
            pctState = 'good';
          } else if (currentValue <= stdValues[3] && currentValue > stdValues[2]) {
            pctState = 'average';
          } else if (currentValue <= stdValues[2] && currentValue > stdValues[1]) {
            pctState = 'bad';
          } else if (currentValue <= stdValues[1]) {
            pctState = 'trash';
          }
          
          // Get current states of attempts/volume
          let volState = '';
          if (val > values[5]) {
            volState = 'elite';
          } else if (val <= values[5] && val > values[4]) {
            volState = 'great';
          } else if (val <= values[4] && val > values[3]) {
            volState = 'good';
          } else if (val <= values[3] && val > values[2]) {
            volState = 'average';
          } else if (val <= values[2] && val > values[1]) {
            volState = 'bad';
          } else if (val <= values[1]) {
            volState = 'trash';
          }

          const stateMatrix: Record<string, Record<string, string>> = {
            elite: {
              elite: 'elite',
              great: 'elite',
              good: 'elite',
              average: 'great',
              bad: 'good',
              trash: 'average',
            },
            great: {
              elite: 'elite',
              great: 'elite',
              good: 'great',
              average: 'good',
              bad: 'average',
              trash: 'average',
            },
            good: {
              elite: 'great',
              great: 'great',
              good: 'good',
              average: 'average',
              bad: 'average',
              trash: 'average',
            },
            average: {
              elite: 'bad',
              great: 'average',
              good: 'average',
              average: 'average',
              bad: 'average',
              trash: 'average',
            },
            bad: {
              elite: 'trash',
              great: 'trash',
              good: 'bad',
              average: 'bad',
              bad: 'average',
              trash: 'average',
            },
            trash: {
              elite: 'trash',
              great: 'trash',
              good: 'trash',
              average: 'bad',
              bad: 'average',
              trash: 'average',
            },
          };
          
          // Null check 
          if (pctState === '' || volState === '') {
            return null;
          }

          // Assigns the combined state to the new state
          let currentState = stateMatrix[pctState][volState];
          if (currentState === 'elite') {
            elite = true;
          } else if (currentState === 'great') {
            great = true;
          } else if (currentState === 'good') {
            good = true;
          } else if (currentState === 'average') {
            average = true;
          }else if (currentState === 'bad') {
            bad = true;
          }else if (currentState === 'trash') {
            trash = true;
          }
    
        } else {
        elite = currentValue > stdValues[5];
        great = currentValue <= stdValues[5] && currentValue > stdValues[4];
        good = currentValue <= stdValues[4] && currentValue > stdValues[3];
        average = currentValue <= stdValues[3] && currentValue > stdValues[2];
        bad = currentValue <= stdValues[2] && currentValue > stdValues[1];
        trash = currentValue <= stdValues[1]; 
        }
      }
    
      // Assigns the color
      if (elite) {
        return '#26990c';
      } else if (great) {
        return '#38e011'; 
      } else if (good) {
        return '#bdf8af';
      } else if (average) {
        return 'white';
      } else if (bad) {
        return '#f17382';
      } else if (trash) {
        return '#e4152e';
      } else {
        return null;
      }

    } else {
      return null;
    }
  }

  
  convertToFloat(value: any) {
    if (value != null) {
      let num = value;
      num = Number(num.toFixed(2));
      return num;
    }
    return value;
  }


  convertToPercentage(value: any) {
    if (value != null) {
      let num = 0;
      if (value <= 1) {
        num = value*100;
      } else {
        num = value
      }
      num = Number(num.toFixed(2));
      const val = '' + num + '%';
      return val;
    }
    return value;
  }

  exportToCSV(): void {
    const data = this.tableDataSource.data as any[]; // Use 'any' type assertion
  
    const dataForCSV = [this.tableColumns.map(column => column.name)]; // Use column names as the first row
    data.forEach(row => {
      const rowData = this.tableColumns.map(column => row[column.dataKey]);
      dataForCSV.push(rowData);
    });
  
    const csvContent = 'data:text/csv;charset=utf-8,' + dataForCSV.map(e => e.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'table_export.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  }

}
