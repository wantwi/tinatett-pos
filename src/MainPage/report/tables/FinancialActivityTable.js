import * as React from 'react';
import { GridComponent, ColumnsDirective, ColumnDirective, Inject, Toolbar, ExcelExport, PdfExport, Selection, AggregatesDirective, AggregateDirective, AggregateColumnsDirective, AggregateColumnDirective, Page, Aggregate, ColumnChooser } from '@syncfusion/ej2-react-grids';
import { image } from './image';
import { getCurrentDateInWords } from './helper';
import useAuth from '../../../hooks/useAuth';

function FinancialActivityTable({ data, startDate, endDate, fileName, title }) {
    const { auth } = useAuth()
    // const [fileName, setFileName] = useState("")
    // const [title, setTitle] = useState("")
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
    let creditSaleGrid, creditPaymentGrid, cashGrid;
    const toolbarOptions = ['ExcelExport', 'PdfExport'];
    const gridsToexport = ['MasterGrid', 'DetailGrid', 'CreditSaleGrid', 'CreditPaymentGrid', 'CashAtHandGrid'];
    let newSheetExcelProperties = {
        multipleExport: { type: 'NewSheet' }
    };
    let sameSheetPdfProperties = {
        multipleExport: { type: "AppendToPage", blankSpace: 10 }
    };

    function toolbarClick(args) {

        switch (args['item'].id) {
            case 'MasterGrid_excelexport':
                masterGrid.excelExport({}, true);
                break;
            case 'MasterGrid_pdfexport':
                // setFileName("salesdetailReport")
                // setTitle("SALES DETAILS REPORT")
                masterGrid.pdfExport(getPdfExportProperties2('salesdetailReport', 'SALES DETAILS REPORT'))

                break;
            case 'DetailGrid_pdfexport':
                // setFileName()
                // setTitle()
                detailGrid.pdfExport(getPdfExportProperties("expenseReport", "EXPENSES REPORT"))

                break;
            case 'CreditSaleGrid_pdfexport':
                // setFileName()
                // setTitle()
                creditSaleGrid.pdfExport(getPdfExportProperties("creditsalesReport", "CREDIT SALES REPORT"))
                break
            case 'CreditPaymentGrid_pdfexport':
                // setFileName()
                // setTitle()
                creditPaymentGrid.pdfExport(getPdfExportProperties("creditPaymentReport", "CREDIT PAYMENT REPORT"))
                break
            case 'CashAtHandGrid_pdfexport':
                // setFileName()
                // setTitle()
                cashGrid.pdfExport(getPdfExportProperties("cashathandReport", "CASH AT REPORT"))
                break

        }

    }
    /* tslint:disable-next-line:no-any */
    function getExcelExportProperties() {
        return {

            fileName: `${fileName}.xlsx`
        };
    }
    /* tslint:disable-next-line:no-any */
    function getPdfExportProperties(fileName, title) {
        return {
            pageOrientation: 'Portrait',
            screenX: 0,

            pageSize: 'A4',

            header: {

                fromTop: 0,
                // minHeight: 200,
                height: 140,

                contents: [
                    {
                        position: { x: 0, y: 0 },
                        size: { height: 60, width: 90 },
                        src: image,
                        type: 'Image'
                    },
                    {
                        type: 'Text',
                        value: 'TINATETT MARKETING COMPANY LIMITED',
                        position: { x: 150, y: 0 },
                        style: { textBrushColor: '#575C88', fontSize: 17 },
                    },
                    {
                        type: 'Text',
                        value: 'P.O. BOX CO 2699, TEMA-ACCRA, WHOLESALE AND RETAIL OF HERBAL MEDICINE',
                        position: { x: 95, y: 20 },
                        style: { textBrushColor: '#575C88', fontSize: 13 },
                    },
                    {
                        type: 'Text',
                        value: 'KOTOBABI SPINTEX - FACTORY WAREHOUSE, 02081660807, tinatettonline@gmail.com',
                        position: { x: 95, y: 40 },
                        style: { textBrushColor: '#575C88', fontSize: 13 },
                    },
                    {
                        type: 'Text',
                        value: `${title}`,
                        position: { x: 250, y: 90 },
                        style: { textBrushColor: '#000000', fontSize: 15, textDecoration: "underline" },
                    },
                    {
                        type: 'Text',
                        value: `From ${getCurrentDateInWords(startDate)} to ${getCurrentDateInWords(endDate)}`,
                        position: { x: 250, y: 115 },
                        style: { textBrushColor: '#000000', fontSize: 12, textDecoration: "underline" },
                    },
                    {
                        type: 'Text',
                        value: 'Branch Info',
                        position: { x: 0, y: 100 },
                        style: { textBrushColor: '#000000', fontSize: 16 }
                    },
                    {
                        type: 'Text',
                        value: `${auth?.branchName}`,
                        position: { x: 0, y: 115 },
                        style: { textBrushColor: '#000000', fontSize: 11 }
                    },
                    {
                        type: 'Text',
                        value: `${getCurrentDateInWords(Date.now())}`,
                        position: { x: 600, y: 115 },
                        style: { textBrushColor: '#000000', fontSize: 11 }
                    },
                ]
            },
            footer: {
                fromBottom: 100,
                height: 80,
                contents: [
                    {
                        type: 'Text',
                        value: 'Prepared By:',
                        position: { x: 0, y: 60 },
                        style: { textBrushColor: '#575C88', fontSize: 14 }
                    },
                    {
                        type: 'Text',
                        value: `${auth?.name}`,
                        position: { x: 80, y: 60 },
                        style: { textBrushColor: '#0A1172', fontSize: 14 }
                    },
                    {
                        /** format is optional */
                        format: 'Page {$current} of {$total}',
                        pageNumberType: 'Arabic',
                        position: { x: 630, y: 65 },
                        style: {
                            fontSize: 11,
                            hAlign: 'Center',
                            textBrushColor: '#0A1172',
                        },
                        type: 'PageNumber',
                    }
                ]
            },
            fileName: `${fileName}.pdf`
        };
    }

    /* tslint:disable-next-line:no-any */
    function getPdfExportProperties2(fileName, title) {
        return {
            pageOrientation: 'Landscape',
            screenX: 0,
            pageSize: 'A4',
            header: {

                fromTop: 20,

                height: 150,

                contents: [
                    {
                        position: { x: 0, y: 0 },
                        size: { height: 80, width: 120 },
                        src: image,
                        type: 'Image'
                    },
                    {
                        type: 'Text',
                        value: 'TINATETT MARKETING COMPANY LIMITED',
                        position: { x: 308, y: 0 },
                        style: { textBrushColor: '#575C88', fontSize: 18 },
                    },
                    {
                        type: 'Text',
                        value: 'P.O. BOX CO 2699, TEMA-ACCRA, WHOLESALE AND RETAIL OF HERBAL MEDICINE',
                        position: { x: 218, y: 20 },
                        style: { textBrushColor: '#575C88', fontSize: 14 },
                    },
                    {
                        type: 'Text',
                        value: 'KOTOBABI SPINTEX - FACTORY WAREHOUSE, 02081660807, tinatettonline@gmail.com',
                        position: { x: 218, y: 40 },
                        style: { textBrushColor: '#575C88', fontSize: 14 },
                    },
                    {
                        type: 'Text',
                        value: `${title}`,
                        position: { x: 420, y: 95 },
                        style: { textBrushColor: '#000000', fontSize: 15, textDecoration: "underline" },
                    },
                    {
                        type: 'Text',
                        value: `From ${getCurrentDateInWords(startDate)} to ${getCurrentDateInWords(endDate)}`,
                        position: { x: 420, y: 115 },
                        style: { textBrushColor: '#000000', fontSize: 12, textDecoration: "underline" },
                    },
                    {
                        type: 'Text',
                        value: 'Branch Info',
                        position: { x: 0, y: 100 },
                        style: { textBrushColor: '#000000', fontSize: 16 }
                    },
                    {
                        type: 'Text',
                        value: `${auth?.branchName}`,
                        position: { x: 0, y: 120 },
                        style: { textBrushColor: '#000000', fontSize: 11 }
                    },
                    {
                        type: 'Text',
                        value: `${getCurrentDateInWords(Date.now())}`,
                        position: { x: 940, y: 120 },
                        style: { textBrushColor: '#000000', fontSize: 11 }
                    },
                ]
            },
            footer: {
                fromBottom: 20,
                height: 20,
                contents: [
                    {
                        type: 'Text',
                        value: 'Prepared By:',
                        position: { x: 0, y: 0 },
                        style: { textBrushColor: '#575C88', fontSize: 14 }
                    },
                    {
                        type: 'Text',
                        value: `${auth?.name}`,
                        position: { x: 80, y: 0 },
                        style: { textBrushColor: '#0A1172', fontSize: 14 }
                    },
                    {
                        /** format is optional */
                        format: 'Page {$current} of {$total}',
                        pageNumberType: 'Arabic',
                        position: { x: 950, y: 0 },
                        style: {
                            fontSize: 11,
                            hAlign: 'Center',
                            textBrushColor: '#0A1172',
                        },
                        type: 'PageNumber',
                    }
                ]
            },
            fileName: `${fileName}.pdf`
        };
    }
    const footerSum = (props) => {
        return (<span style={{ fontSize: 11, fontWeight: "bold" }}>{props.Sum}</span>);
    };

    const pdfHeaderQueryCellInfo = (args) => {
        args.cell.row.pdfGrid.repeatHeader = true;
    };

    const beforePdfExport = function (args) {

        args.headerPageNumbers = [1];
        args.gridDrawPosition.yPosition = 130;

    };
    return (<div className='control-pane'>
        <div className='control-section'>
            <p className="e-mastertext" style={{ fontWeight: 700 }}>Sales Details</p>
            <GridComponent allowPaging={true} height={400} id='MasterGrid' dataSource={salesTrans.map(x => ({ ...x, SALE_MINUS_BAL: +x?.SALE_VALUE - +x?.BALANCE, transDate: getCurrentDateInWords(x?.transDate) }))} selectedRowIndex={2} ref={grid => masterGrid = grid} allowExcelExport={true} allowPdfExport={true} toolbar={toolbarOptions} exportGrids={gridsToexport} toolbarClick={toolbarClick}>
                <ColumnsDirective>
                    <ColumnDirective field='transDate' headerText='Date' width={110}></ColumnDirective>
                    <ColumnDirective field='SALE_VALUE' headerText='Sales Value' format='N2' textAlign='Right' width={130}></ColumnDirective>
                    <ColumnDirective field='CASH' headerText='Cash' format='N2' textAlign='Right' width={120}></ColumnDirective>
                    <ColumnDirective field='CHEQUE' headerText='Cheque' format='N2' textAlign='Right' width={120}></ColumnDirective>
                    <ColumnDirective field='MOMO' headerText='Momo' format='N2' textAlign='Right' width={120}></ColumnDirective>
                    <ColumnDirective field='BALANCE' headerText='Credit/Balance' format='N2' textAlign='Right' width={130}></ColumnDirective>
                    <ColumnDirective field='SALE_MINUS_BAL' headerText='Sales-Balance' format='N2' textAlign='Right' width={130} ></ColumnDirective>
                    <ColumnDirective field='EXPENSES' headerText='Expenses' format='N2' textAlign='Right' width={130}></ColumnDirective>
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

            <GridComponent allowPaging={true} height={400} id='DetailGrid' dataSource={expenses.map(x => ({ ...x, expenseDate: getCurrentDateInWords(x?.expenseDate) }))} allowExcelExport={true} allowPdfExport={true} toolbar={toolbarOptions} allowSelection={false} ref={grid => detailGrid = grid} toolbarClick={toolbarClick}>
                <ColumnsDirective>
                    <ColumnDirective field='expenseDate' headerText='Date' ></ColumnDirective>
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
            <GridComponent allowPaging={true} height={400} id='CreditSaleGrid' dataSource={creditSale.map(x => ({ ...x, transactionDate: getCurrentDateInWords(x?.transactionDate) }))} allowExcelExport={true} allowPdfExport={true} toolbar={toolbarOptions} allowSelection={false} ref={grid => creditSaleGrid = grid} toolbarClick={toolbarClick}>
                <ColumnsDirective>
                    <ColumnDirective field='transactionDate' headerText='Date' ></ColumnDirective>
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
            <GridComponent allowPaging={true} height={400} id='CreditPaymentGrid' dataSource={creditPayment.map(x => ({ ...x, transDate: getCurrentDateInWords(x?.transDate) }))} allowExcelExport={true} allowPdfExport={true} toolbar={toolbarOptions} allowSelection={false} ref={grid => creditPaymentGrid = grid} toolbarClick={toolbarClick}>
                <ColumnsDirective>
                    <ColumnDirective field='transDate' headerText='Date' ></ColumnDirective>
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
            <GridComponent allowPaging={true} height={80} id='CashAtHandGrid' dataSource={cashInHand.map(x => ({ ...x, CASH_IN_HAND: +x?.CASH - x?.EXPENSES, transDate: getCurrentDateInWords(x?.transDate) }))} allowExcelExport={true} allowPdfExport={true} toolbar={toolbarOptions} allowSelection={false} ref={grid => cashGrid = grid} toolbarClick={toolbarClick}>
                <ColumnsDirective>
                    {/* <ColumnDirective field='transDate' headerText='Date' width={100}  ></ColumnDirective> */}
                    <ColumnDirective field='CASH' headerText='Total Cash' format='N2' textAlign='Right' width={110}></ColumnDirective>
                    <ColumnDirective field='CHEQUE' headerText='Total Cheques' format='N2' textAlign='Right' width={110}></ColumnDirective>
                    <ColumnDirective field='MOMO' headerText='Total Momo' format='N2' textAlign='Right' width={110}></ColumnDirective>
                    <ColumnDirective field='EXPENSES' headerText='Total Expense' format='N2' textAlign='Right' width={110} />
                    <ColumnDirective field='CASH_IN_HAND' headerText='Cash at Hand' format='N2' textAlign='Right' width={110} />
                </ColumnsDirective>
                <AggregatesDirective>
                    <AggregateDirective>
                        <AggregateColumnsDirective>
                            <AggregateColumnDirective field='CASH' type='Sum' format='N2' footerTemplate={footerSum} />
                            <AggregateColumnDirective field='CHEQUE' type='Sum' format='N2' footerTemplate={footerSum} />
                            <AggregateColumnDirective field='MOMO' type='Sum' format='N2' footerTemplate={footerSum} />
                            <AggregateColumnDirective field='EXPENSES' type='Sum' format='N2' footerTemplate={footerSum} />
                            <AggregateColumnDirective field='CASH_IN_HAND' type='Sum' format='N2' footerTemplate={footerSum} />
                        </AggregateColumnsDirective>
                    </AggregateDirective>
                </AggregatesDirective>
                <Inject services={[PdfExport, ExcelExport, Toolbar, Page, Aggregate, ColumnChooser]} />
            </GridComponent>
        </div>


    </div>);
}
export default FinancialActivityTable;