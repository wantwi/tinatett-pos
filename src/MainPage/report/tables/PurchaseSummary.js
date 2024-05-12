import * as React from 'react';
import { GridComponent, ColumnsDirective, ColumnDirective, Inject, Toolbar, ExcelExport, PdfExport, Page, AggregateColumnsDirective, AggregateColumnDirective, AggregateDirective, AggregatesDirective, Aggregate } from '@syncfusion/ej2-react-grids';

import { image } from './image';
import useAuth from '../../../hooks/useAuth';
import { getCurrentDateInWords } from './helper';
function PurchaseSummary({ data = [], title = "", fileName = "" }) {
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
                        position: { x: 250, y: 100 },
                        style: { textBrushColor: '#000000', fontSize: 15, textDecoration: "underline" },
                    },
                    {
                        type: 'Text',
                        value: 'Branch Info',
                        position: { x: 0, y: 90 },
                        style: { textBrushColor: '#000000', fontSize: 16 }
                    },
                    {
                        type: 'Text',
                        value: `${auth?.branchName}`,
                        position: { x: 0, y: 110 },
                        style: { textBrushColor: '#000000', fontSize: 11 }
                    },
                    {
                        type: 'Text',
                        value: `${getCurrentDateInWords(Date.now())}`,
                        position: { x: 600, y: 110 },
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
    return (<div className='control-pane'>
        <div className='control-section'>
            <div>
                <GridComponent id="Grid" height={500} dataSource={data} ref={grid => gridInstance = grid} pdfHeaderQueryCellInfo={pdfHeaderQueryCellInfo} toolbar={toolbarOptions} allowExcelExport={true} allowPdfExport={true} toolbarClick={toolbarClick.bind(this)} allowPaging={true} pageSettings={{ pageCount: 2, pageSize: 100 }}>
                    <ColumnsDirective>
                        <ColumnDirective field='productName' headerText='Product Name'></ColumnDirective>
                        <ColumnDirective field='Quantity' headerText='Quantity' textAlign='Center'></ColumnDirective>
                        <ColumnDirective field='Amount' headerText='Amount' textAlign='Right' format='N2'></ColumnDirective>
                    </ColumnsDirective>
                    <AggregatesDirective>
                        <AggregateDirective>
                            <AggregateColumnsDirective>
                                <AggregateColumnDirective field='Amount' type='Sum' format='N2' footerTemplate={footerSum} />
                                <AggregateColumnDirective field='Quantity' type='Sum' format='N2' footerTemplate={footerSum} />

                            </AggregateColumnsDirective>
                        </AggregateDirective>

                    </AggregatesDirective>
                    <Inject services={[Toolbar, ExcelExport, PdfExport, Page, Aggregate]} />
                </GridComponent>
            </div>
        </div>
    </div>);
}
export default PurchaseSummary;