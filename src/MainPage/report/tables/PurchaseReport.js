import * as React from 'react';
import { GridComponent, ColumnsDirective, ColumnDirective, Inject, Toolbar, ExcelExport, PdfExport, Page, AggregateColumnsDirective, AggregateColumnDirective, AggregateDirective, AggregatesDirective, Aggregate } from '@syncfusion/ej2-react-grids';
import { image } from './image';
import { getCurrentDateInWords } from './helper';
import useAuth from '../../../hooks/useAuth';

function PurchaseReport({ data = [], title = "PURCHASE REPORT", fileName = "purchaseReport", isSupplier = true }) {
    const { auth } = useAuth()
    console.log({ auth });
    const month = ((new Date()).getMonth().toString()) + '/';
    const date = ((new Date()).getDate().toString()) + '/';
    const year = ((new Date()).getFullYear().toString());
    const toolbarOptions = ['ExcelExport', 'PdfExport'];
    let flag = true;
    let gridInstance;
    function toolbarClick(args) {
        switch (args.item.id) {
            case 'Grid_pdfexport':

                gridInstance.columns[1].visible = false;
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

            // pageSize: 'letter',

            header: {

                fromTop: 20,
                // minHeight: 200,
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
                        position: { x: 420, y: 100 },
                        style: { textBrushColor: '#000000', fontSize: 15, textDecoration: "underline" },
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
        return (<span style={{ fontSize: 11, fontWeight: "bold" }}>{props.Sum}</span>);
    };

    const pdfHeaderQueryCellInfo = (args) => {
        args.cell.row.pdfGrid.repeatHeader = true;
    };

    const beforePdfExport = function (args) {

        args.headerPageNumbers = [1];
        args.gridDrawPosition.yPosition = 110;

    };

    const pdfQueryCellInfo = () => {
        if (flag) {
            // to avoid execution for all the pdf cells

            console.log({ gridInstance });

            // gridInstance.pdfExportModule.pdfDocument.pageSettings.margins.all = 10;//pdfPageSettings

            // console.log({ gridInstance });

            flag = false;
        }
    }


    return (<div className='control-pane'>
        <div className='control-section'>
            <div>
                <GridComponent id="Grid" pdfQueryCellInfo={pdfQueryCellInfo} beforePdfExport={beforePdfExport} dataSource={data} ref={grid => gridInstance = grid} pdfHeaderQueryCellInfo={pdfHeaderQueryCellInfo} toolbar={toolbarOptions} allowExcelExport={true} allowPdfExport={true} toolbarClick={toolbarClick.bind(this)} height={500} allowPaging={true} pageSettings={{ pageCount: 2, pageSize: 1000 }}>
                    <ColumnsDirective>
                        <ColumnDirective field='date' headerText='Date' width={90} format='d-MMM-yyyy'></ColumnDirective>
                        <ColumnDirective field='refrence' headerText='Ref.#' width={100} ></ColumnDirective>
                        <ColumnDirective field='supplier' headerText={`${isSupplier ? "Supplier" : "Customer"} `} width={200}></ColumnDirective>
                        <ColumnDirective field='product' headerText='Product' width={200}></ColumnDirective>
                        <ColumnDirective field='batchNumber' headerText='Batch#' width={100}></ColumnDirective>
                        <ColumnDirective field='manufacturingDate' headerText='MGF Date' width={90} format='d-MMM-yyyy'></ColumnDirective>
                        <ColumnDirective field='expireDate' headerText='EXP Date' width={90} format='d-MMM-yyyy'></ColumnDirective>
                        <ColumnDirective field='quantity' headerText='Qty' width={50}></ColumnDirective>
                        <ColumnDirective field='unitPrice' headerText='Unit Price' format='N2' width={90}></ColumnDirective>
                        <ColumnDirective field='amount' headerText='Amount' format='N2' width={100}></ColumnDirective>
                    </ColumnsDirective>
                    <AggregatesDirective>
                        <AggregateDirective>
                            <AggregateColumnsDirective>
                                <AggregateColumnDirective field='quantity' type='Sum' format='N2' footerTemplate={footerSum} />
                                <AggregateColumnDirective field='unitPrice' type='Sum' format='N2' footerTemplate={footerSum} />
                                <AggregateColumnDirective field='amount' type='Sum' format='N2' footerTemplate={footerSum} />
                            </AggregateColumnsDirective>
                        </AggregateDirective>
                    </AggregatesDirective>
                    <Inject services={[Toolbar, ExcelExport, PdfExport, Page, Aggregate]} />
                </GridComponent>
            </div>
        </div>
    </div>);
}
export default PurchaseReport;