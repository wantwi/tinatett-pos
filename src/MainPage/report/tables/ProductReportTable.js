import * as React from 'react';
import { GridComponent, ColumnsDirective, ColumnDirective, Inject, Toolbar, ExcelExport, PdfExport, Page, AggregateColumnsDirective, AggregateColumnDirective, AggregateDirective, AggregatesDirective, Aggregate } from '@syncfusion/ej2-react-grids';
import useAuth from '../../../hooks/useAuth';
import { image } from './image';
import { getCurrentDateInWords } from './helper';

function ProductReportTable({ data = [] }) {
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
        return { fileName: "productreport.xlsx" };
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
                height: 175,

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
                        value: 'PURCHASE REPORT',
                        position: { x: 420, y: 120 },
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
                        position: { x: 940, y: 0 },
                        style: {
                            fontSize: 11,
                            hAlign: 'Center',
                            textBrushColor: '#0A1172',
                        },
                        type: 'PageNumber',
                    }
                ]
            },
            fileName: "ProductReport.pdf"
        };
    }
    const footerSum = (props) => {
        return (<span>Sum: {props.Sum}</span>);
    };
    const footerMax = (props) => {
        return (<span>Maximum: {props.Max}</span>);
    };
    const pdfHeaderQueryCellInfo = (args) => {
        args.cell.row.pdfGrid.repeatHeader = true;
    };

    const beforePdfExport = function (args) {
        console.log({ beforePdfExport: args })
        args.headerPageNumbers = [1];
        args.gridDrawPosition.yPosition = 110;
    };


    return (<div className='control-pane'>
        <div className='control-section'>
            <div>
                <GridComponent id="Grid" beforePdfExport={beforePdfExport} dataSource={data} ref={grid => gridInstance = grid} pdfHeaderQueryCellInfo={pdfHeaderQueryCellInfo} toolbar={toolbarOptions} allowExcelExport={true} allowPdfExport={true} toolbarClick={toolbarClick.bind(this)} height={500} allowPaging={true} pageSettings={{ pageCount: 2, pageSize: 1000 }}>
                    <ColumnsDirective>
                        <ColumnDirective field='Name' headerText='Product Name' width={"13%"}></ColumnDirective>
                        <ColumnDirective field='QTY' headerText='Total QTY' textAlign='Center' width={"6%"} format='N2'></ColumnDirective>
                        <ColumnDirective field='retailPrice' headerText='Retail Price' textAlign='Right' format='N2' width={"7%"}></ColumnDirective>
                        <ColumnDirective field='wholeSalePrice' headerText='Wholesale Price' textAlign='Right' format='N2' width={"8%"}></ColumnDirective>
                        <ColumnDirective field='specialPrice' headerText='Special Price' textAlign='Right' format='N2' width={"7%"}></ColumnDirective>
                        <ColumnDirective field='batchNumber' headerText='Batch No.' format='N2' width={"7%"}></ColumnDirective>
                        <ColumnDirective field='quantity' headerText='QTY' textAlign='Center' format='N2' width={"5%"}></ColumnDirective>
                        <ColumnDirective field='manufacturingDate' headerText='MGF Date' width={"6%"}></ColumnDirective>
                        <ColumnDirective field='expireDate' headerText='Expire Date' width={"6%"}></ColumnDirective>

                    </ColumnsDirective>
                    <AggregatesDirective>
                        <AggregateDirective>
                            <AggregateColumnsDirective>
                                <AggregateColumnDirective field='QTY' type='Sum' format='N2' footerTemplate={footerSum} />
                                <AggregateColumnDirective field='quantity' type='Sum' format='N2' footerTemplate={footerSum} />

                            </AggregateColumnsDirective>
                        </AggregateDirective>
                    </AggregatesDirective>
                    <Inject services={[Toolbar, ExcelExport, PdfExport, Page, Aggregate]} />
                </GridComponent>
            </div>
        </div>
    </div>);
}
export default ProductReportTable;