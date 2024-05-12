import * as React from 'react';
import { GridComponent, ColumnsDirective, ColumnDirective, Inject, Toolbar, ExcelExport, PdfExport, Page, AggregateColumnsDirective, AggregateColumnDirective, AggregateDirective, AggregatesDirective, Aggregate } from '@syncfusion/ej2-react-grids';

import { image } from './image';
import useAuth from '../../../hooks/useAuth';
import { getCurrentDateInWords } from './helper';


function DeletedSalesTable({ data = [], startDate, endDate, title = "", fileName = "" }) {
    const { auth } = useAuth()
    const month = ((new Date()).getMonth().toString()) + '/';
    const date = ((new Date()).getDate().toString()) + '/';
    const year = ((new Date()).getFullYear().toString());
    const toolbarOptions = ['ExcelExport', 'PdfExport'];
    let gridInstance;
    function toolbarClick(args) {
        switch (args.item.id) {
            case 'Grid_pdfexport':

                gridInstance.pdfExport(getPdfExportProperties());
                break;
            case 'Grid_excelexport':
                gridInstance.excelExport(getExcelExportProperties());
                break;
        }
    }
    /* tslint:disable-next-line:no-any */
    function getExcelExportProperties() {
        return {
            fileName: `${fileName}_${auth?.branchName}_${getCurrentDateInWords(Date.now())}.xlsx`
        };
    }
    /* tslint:disable-next-line:no-any */
    function getPdfExportProperties() {
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

            fileName: `${fileName}_${auth?.branchName}_${getCurrentDateInWords(Date.now())}.pdf`
        };
    }
    const footerSum = (props) => {
        return (<span> {props.Sum}</span>);
    };
    const footerMax = (props) => {
        return (<span>Maximum: {props.Max}</span>);
    };
    const pdfHeaderQueryCellInfo = (args) => {
        args.cell.row.pdfGrid.repeatHeader = true;
    };
    const sumTemp = ({ Expenses, total }) => {
        const sum = total - Expenses
        return sum > 0 ? sum : `(${Math.abs(sum)})`
    }
    return (<div className='control-pane'>
        <div className='control-section'>
            <div>
                <GridComponent id="Grid" height={500} dataSource={data?.map(x => ({ ...x, manufacturingDate: getCurrentDateInWords(x?.manufacturingDate), expireDate: getCurrentDateInWords(x?.expireDate), transactionDate: getCurrentDateInWords(x?.transactionDate) }))} ref={grid => gridInstance = grid} pdfHeaderQueryCellInfo={pdfHeaderQueryCellInfo} toolbar={toolbarOptions} allowExcelExport={true} allowPdfExport={true} toolbarClick={toolbarClick.bind(this)} allowPaging={true} pageSettings={{ pageCount: 2, pageSize: 100 }}>
                    <ColumnsDirective>
                        <ColumnDirective field='transactionDate' headerText='Date' ></ColumnDirective>
                        <ColumnDirective field='productName' headerText='Product' width={"15%"}></ColumnDirective>
                        <ColumnDirective field='quantity' headerText='QTY'  ></ColumnDirective>
                        <ColumnDirective field='batchNumber' headerText='Batch No.'></ColumnDirective>
                        <ColumnDirective field='expireDate' headerText='Exp. Date'   ></ColumnDirective>
                        <ColumnDirective field='manufacturingDate' headerText='MFG. Date'   ></ColumnDirective>
                        <ColumnDirective field='unitPrice' headerText='Unit Price' textAlign='Right' format='N2'  ></ColumnDirective>
                        <ColumnDirective field='total' headerText='Amount' textAlign='Right' format='N2'  ></ColumnDirective>

                        <ColumnDirective field='userName' headerText='Deleted By' width={"15%"}></ColumnDirective>
                    </ColumnsDirective>
                    {/* <AggregatesDirective>
                        <AggregateDirective>
                            <AggregateColumnsDirective>
                                <AggregateColumnDirective field='Cash' type='Sum' format='N2' footerTemplate={footerSum} />
                                <AggregateColumnDirective field='Momo' type='Sum' format='N2' footerTemplate={footerSum} />
                                <AggregateColumnDirective field='Cheque' type='Sum' format='N2' footerTemplate={footerSum} />
                                <AggregateColumnDirective field='Credit' type='Sum' format='N2' footerTemplate={footerSum} />
                                <AggregateColumnDirective field='Total' type='Sum' format='N2' footerTemplate={footerSum} />
                                <AggregateColumnDirective field='Expenses' type='Sum' format='N2' footerTemplate={footerSum} />

                                <AggregateColumnDirective field='Total' type='Sum' format='N2' footerTemplate={footerSum} />

                            </AggregateColumnsDirective>
                        </AggregateDirective>

                    </AggregatesDirective> */}
                    <Inject services={[Toolbar, ExcelExport, PdfExport, Page, Aggregate]} />
                </GridComponent>
            </div>
        </div>
    </div>);
}
export default DeletedSalesTable;