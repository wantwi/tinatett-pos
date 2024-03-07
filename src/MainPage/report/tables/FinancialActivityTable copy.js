import * as React from 'react';
import { GridComponent, ColumnsDirective, ColumnDirective, Inject, Toolbar, ExcelExport, PdfExport, Selection, Page, Aggregate, ColumnChooser, AggregatesDirective, AggregateDirective, AggregateColumnsDirective, AggregateColumnDirective } from '@syncfusion/ej2-react-grids';

import useAuth from '../../../hooks/useAuth';

function FinancialActivityTable({ data }) {
    const {
        salesTrans = [],
        expenses = [],
        creditSale = [],
        creditPayment = [],
        cashInHand = []
    } = data
    const key = null;
    const detail = [];
    let detailGrid;
    let masterGrid;
    let creditSaleGrid;
    let cashAtHandGrid;
    let creditPaymentGrid;
    const toolbarOptions = ['ExcelExport', 'PdfExport'];
    const gridsToexport = ['MasterGrid', 'DetailGrid', 'CreditSaleGrid', 'CashAtHandGrid', 'CreditPaymentGrid'];
    let newSheetExcelProperties = {
        multipleExport: { type: 'NewSheet' }
    };
    let sameSheetPdfProperties = {
        multipleExport: { type: "AppendToPage", blankSpace: 10 }
    };

    const footerSum = (props) => {
        return (<span style={{ fontSize: 11, fontWeight: "bold" }}>{props.Sum}</span>);
    };

    function toolbarClick(args) {

        switch (args['item'].id) {
            case 'MasterGrid_excelexport':
                masterGrid.excelExport({}, true);
                break;
            case 'MasterGrid_pdfexport':
                masterGrid.pdfExport(sameSheetPdfProperties, false)

                break;
            case 'DetailGrid_pdfexport':
                detailGrid.pdfExport(sameSheetPdfProperties, false)
                    ``
                break;
            case 'CreditSaleGrid_pdfexport':
                creditSaleGrid.pdfExport(sameSheetPdfProperties, false)
                break
            case 'CashAtHandGrid_pdfexport':
                cashAtHandGrid.pdfExport(sameSheetPdfProperties, false)
                break
            case 'CreditPaymentGrid_pdfexport':
                creditPaymentGrid.pdfExport(sameSheetPdfProperties, false)
                break
        }
        //CreditPaymentGrid
        // const masterGridRefExport = gridRef.masterGrid.excelExport(
        //     appendExcelExportProperties,
        //     true,
        // );
        // masterGridRefExport.then((fData) => {
        //     if (gridRef.addressGrid) {
        //         gridRef.addressGrid.excelExport(appendExcelExportProperties, false, fData);
        //     }
        // });
        // if (checkboxObj.checked) {

        // }
        // else {
        //     switch (args['item'].id) {
        //         case 'MasterGrid_excelexport':
        //             masterGrid.excelExport(newSheetExcelProperties, true);
        //             break;
        //         case 'MasterGrid_pdfexport':
        //             masterGrid.pdfExport({}, true);
        //             break;
        //     }
        // }
    }
    return (<div className='control-pane'>
        <div className='control-section'>
            <p className="e-mastertext" style={{ fontWeight: 700 }}></p>
            <GridComponent allowPaging={true} height={400} id='MasterGrid' dataSource={salesTrans} selectedRowIndex={2} ref={grid => masterGrid = grid} allowExcelExport={true} allowPdfExport={true} toolbar={toolbarOptions} exportGrids={gridsToexport} toolbarClick={toolbarClick}>
                <ColumnsDirective>
                    <ColumnDirective field='transDate' headerText='Date' type="datetime" format='d-MMM-yyyy' ></ColumnDirective>
                    <ColumnDirective field='SALE_VALUE' headerText='Sales Value' format='N2' textAlign='Right'></ColumnDirective>
                    <ColumnDirective field='CASH' headerText='Cash' format='N2' textAlign='Right'></ColumnDirective>
                    <ColumnDirective field='CHEQUE' headerText='Cheque' format='N2' textAlign='Right'></ColumnDirective>
                    <ColumnDirective field='MOMO' headerText='Momo' format='N2' textAlign='Right'></ColumnDirective>
                    <ColumnDirective field='BALANCE' headerText='Credit/Balance' format='N2' textAlign='Right'></ColumnDirective>
                    <ColumnDirective field='SALE_MINUS_BAL' headerText='Sales-Balance' format='N2' textAlign='Right'></ColumnDirective>
                    <ColumnDirective field='EXPENSES' headerText='Expenses' format='N2' textAlign='Right'></ColumnDirective>
                </ColumnsDirective>
                <AggregatesDirective>
                    <AggregateDirective>
                        <AggregateColumnsDirective>
                            <AggregateColumnDirective field='SALE_VALUE' type='Sum' format='N2' footerTemplate={footerSum} />
                            <AggregateColumnDirective field='CASH' type='Sum' format='N2' footerTemplate={footerSum} />
                            <AggregateColumnDirective field='CHEQUE' type='Sum' format='N2' footerTemplate={footerSum} />
                            <AggregateColumnDirective field='MOMO' type='Sum' format='N2' footerTemplate={footerSum} />
                            <AggregateColumnDirective field='BALANCE' type='Sum' format='N2' footerTemplate={footerSum} />
                            <AggregateColumnDirective field='SALE_MINUS_BAL' type='Sum' format='N2' footerTemplate={footerSum} />
                            <AggregateColumnDirective field='EXPENSES' type='Sum' format='N2' footerTemplate={footerSum} />
                        </AggregateColumnsDirective>
                    </AggregateDirective>
                </AggregatesDirective>
                <Inject services={[Selection, PdfExport, ExcelExport, Toolbar, Page, Aggregate, ColumnChooser]} />
            </GridComponent>

            <div className='e-statustext mt-4 mb-2' style={{ fontWeight: 700 }}> Details of Expenses</div>

            <GridComponent allowPaging={true} height={400} id='DetailGrid' dataSource={expenses} allowExcelExport={true} allowPdfExport={true} toolbar={toolbarOptions} allowSelection={false} ref={grid => detailGrid = grid} toolbarClick={toolbarClick}>
                <ColumnsDirective>
                    <ColumnDirective field='expenseDate' headerText='Date' type="datetime" format='d-MMM-yyyy' ></ColumnDirective>
                    <ColumnDirective field='category' headerText='Category'></ColumnDirective>
                    <ColumnDirective field='expenseFor' headerText='Expense Type'></ColumnDirective>
                    <ColumnDirective field='description' headerText='Description'></ColumnDirective>
                    <ColumnDirective field='amount' headerText='Amount' format='N2' textAlign='Right' />
                </ColumnsDirective>
                <AggregatesDirective>
                    <AggregateDirective>
                        <AggregateColumnsDirective>
                            <AggregateColumnDirective field='amount' type='Sum' format='N2' footerTemplate={footerSum} />
                        </AggregateColumnsDirective>
                    </AggregateDirective>
                </AggregatesDirective>
                <Inject services={[PdfExport, ExcelExport, Toolbar, Page, Aggregate, ColumnChooser]} />
            </GridComponent>

            <div className='e-statustext mt-4 mb-2' style={{ fontWeight: 700 }}> Details of Credit Sales or Balance</div>
            <GridComponent allowPaging={true} height={400} id='CreditSaleGrid' dataSource={creditSale} allowExcelExport={true} allowPdfExport={true} toolbar={toolbarOptions} allowSelection={false} ref={grid => creditSaleGrid = grid} toolbarClick={toolbarClick}>
                <ColumnsDirective>
                    <ColumnDirective field='transactionDate' headerText='Date' type="datetime" format='d-MMM-yyyy' ></ColumnDirective>
                    <ColumnDirective field='name' headerText='Customer'></ColumnDirective>
                    <ColumnDirective field='totalAmount' headerText='Sub Total' format='N2' textAlign='Right'></ColumnDirective>
                    <ColumnDirective field='amountPaid' headerText='Amount Paid' format='N2' textAlign='Right'></ColumnDirective>
                    <ColumnDirective field='balance' headerText='Balance' format='N2' textAlign='Right' />
                </ColumnsDirective>
                <AggregatesDirective>
                    <AggregateDirective>
                        <AggregateColumnsDirective>
                            <AggregateColumnDirective field='totalAmount' type='Sum' format='N2' footerTemplate={footerSum} />
                            <AggregateColumnDirective field='amountPaid' type='Sum' format='N2' footerTemplate={footerSum} />
                            <AggregateColumnDirective field='balance' type='Sum' format='N2' footerTemplate={footerSum} />
                        </AggregateColumnsDirective>
                    </AggregateDirective>
                </AggregatesDirective>
                <Inject services={[PdfExport, ExcelExport, Toolbar, Page, Aggregate, ColumnChooser]} />
            </GridComponent>

            <div className='e-statustext mt-4 mb-2' style={{ fontWeight: 700 }}> Details of Payment of Outstanding Balance / Credit</div>
            <GridComponent allowPaging={true} height={400} id='CreditPaymentGrid' dataSource={creditPayment} allowExcelExport={true} allowPdfExport={true} toolbar={toolbarOptions} allowSelection={false} ref={grid => creditSaleGrid = grid} toolbarClick={toolbarClick}>
                <ColumnsDirective>
                    <ColumnDirective field='transDate' headerText='Date' type="datetime" format='d-MMM-yyyy' ></ColumnDirective>
                    <ColumnDirective field='name' headerText='Customer'></ColumnDirective>
                    <ColumnDirective field='totalAmount' headerText='Amount Due' format='N2' textAlign='Right'></ColumnDirective>
                    <ColumnDirective field='AmtPaid' headerText='Amount Paid' format='N2' textAlign='Right'></ColumnDirective>
                    <ColumnDirective field='balance' headerText='Balance' format='N2' textAlign='Right' />
                </ColumnsDirective>
                <AggregatesDirective>
                    <AggregateDirective>
                        <AggregateColumnsDirective>
                            <AggregateColumnDirective field='totalAmount' type='Sum' format='N2' footerTemplate={footerSum} />
                            <AggregateColumnDirective field='AmtPaid' type='Sum' format='N2' footerTemplate={footerSum} />
                            <AggregateColumnDirective field='balance' type='Sum' format='N2' footerTemplate={footerSum} />
                        </AggregateColumnsDirective>
                    </AggregateDirective>
                </AggregatesDirective>
                <Inject services={[PdfExport, ExcelExport, Toolbar, Page, Aggregate, ColumnChooser]} />
            </GridComponent>
            <div className='e-statustext mt-4 mb-2' style={{ fontWeight: 700 }}> Cash at Hand</div>
            <GridComponent allowPaging={true} height={400} id='CashAtHandGrid' dataSource={cashInHand} allowExcelExport={true} allowPdfExport={true} toolbar={toolbarOptions} allowSelection={false} ref={grid => creditSaleGrid = grid} toolbarClick={toolbarClick}>
                <ColumnsDirective>
                    <ColumnDirective field='transDate' headerText='Date' type="datetime" format='d-MMM-yyyy' ></ColumnDirective>
                    <ColumnDirective field='CASH' headerText='Total Cash' format='N2' textAlign='Right'></ColumnDirective>
                    <ColumnDirective field='CHEQUE' headerText='Total Cheques' format='N2' textAlign='Right'></ColumnDirective>
                    <ColumnDirective field='MOMO' headerText='Total Momo' format='N2' textAlign='Right'></ColumnDirective>
                    <ColumnDirective field='EXPENSES' headerText='Total Expense' format='N2' textAlign='Right' />
                    <ColumnDirective field='CASH_IN_HAND' headerText='Cash at Hand' format='N2' textAlign='Right' template={({ CASH_IN_HAND }) => CASH_IN_HAND <= 0 ? 0 : CASH_IN_HAND} />
                </ColumnsDirective>
                <AggregatesDirective>
                    <AggregateDirective>
                        <AggregateColumnsDirective>
                            <AggregateColumnDirective field='CASH' type='Sum' format='N2' footerTemplate={footerSum} />
                            <AggregateColumnDirective field='CHEQUE' type='Sum' format='N2' footerTemplate={footerSum} />
                            <AggregateColumnDirective field='MOMO' type='Sum' format='N2' footerTemplate={footerSum} />
                            <AggregateColumnDirective field='CASH_IN_HAND' type='Sum' format='N2' footerTemplate={footerSum} />
                            <AggregateColumnDirective field='EXPENSES' type='Sum' format='N2' footerTemplate={footerSum} />
                        </AggregateColumnsDirective>
                    </AggregateDirective>
                </AggregatesDirective>
                <Inject services={[PdfExport, ExcelExport, Toolbar, Page, Aggregate, ColumnChooser]} />
            </GridComponent>
        </div>


    </div>);
}
export default FinancialActivityTable;