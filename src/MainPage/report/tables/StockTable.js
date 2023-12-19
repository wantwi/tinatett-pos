import * as React from 'react';
import { GridComponent, ColumnsDirective, ColumnDirective, Inject, Toolbar, ExcelExport, PdfExport, ColumnChooser, Page, AggregateColumnsDirective, AggregateColumnDirective, AggregateDirective, AggregatesDirective, Aggregate } from '@syncfusion/ej2-react-grids';
import { image } from './image';
import { getCurrentDateInWords } from './helper';
import useAuth from '../../../hooks/useAuth';

function StockReport({ data = [], startDate, endDate, title = "PURCHASE REPORT", fileName = "purchaseReport", isSupplier = true }) {
    const { auth } = useAuth()
    console.log({ auth });
    const month = ((new Date()).getMonth().toString()) + '/';
    const date = ((new Date()).getDate().toString()) + '/';
    const year = ((new Date()).getFullYear().toString());
    const toolbarOptions = ['ExcelExport', 'PdfExport', 'ColumnChooser'];
    let flag = true;
    let gridInstance;
    function toolbarClick(args) {
        switch (args.item.id) {
            case 'Grid_pdfexport':

                // gridInstance.columns[1].visible = false;
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

            fileName: `${fileName}.xlsx`
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

    const rowTem = ({ name }) => {

        if (name === "Moving Product") {
            return <div style={{ textAlign: "center" }}>Moving Product</div>
        } else {
            return name
        }

    }

    const queryCellInfoEvent = (args) => {
        let data = args.data;
        switch (data.name) {
            case "Moving Product":
                args.colSpan = 12;
                console.log(args);
                break;
        }
    }

    //{ name: "Moving Product" }, 
    return (<div className='control-pane'>
        <div className='control-section'>
            <div>
                <GridComponent id="Grid" queryCellInfo={queryCellInfoEvent} showColumnChooser={true} pdfQueryCellInfo={pdfQueryCellInfo} beforePdfExport={beforePdfExport} dataSource={[...data]} ref={grid => gridInstance = grid} pdfHeaderQueryCellInfo={pdfHeaderQueryCellInfo} toolbar={toolbarOptions} allowExcelExport={true} allowPdfExport={true} toolbarClick={toolbarClick.bind(this)} height={500} allowPaging={true} pageSettings={{ pageCount: 2, pageSize: 1000 }}>
                    <ColumnsDirective>
                        <ColumnDirective field='name' template={rowTem} headerText='Product' width={"21%"} ></ColumnDirective>
                        <ColumnDirective field='openStock' headerText='Open Stock' ></ColumnDirective>
                        <ColumnDirective field='transferIn' headerText={`Additions`}  ></ColumnDirective>
                        <ColumnDirective field='totalStock' headerText='Total Stock' ></ColumnDirective>
                        <ColumnDirective field='stockOut' headerText='Sales' ></ColumnDirective>
                        <ColumnDirective field='saleValue' headerText='Sale Value' ></ColumnDirective>
                        <ColumnDirective field='transferOut' headerText='Transfer' ></ColumnDirective>
                        <ColumnDirective field='closeStock' headerText='Close Stock' ></ColumnDirective>
                        <ColumnDirective field='stockValue' headerText='Stock Value' format='N2' ></ColumnDirective>
                        <ColumnDirective field='stockStatus' headerText='Stock Status' format='N2' ></ColumnDirective>


                    </ColumnsDirective>
                    <AggregatesDirective>
                        <AggregateDirective>
                            <AggregateColumnsDirective>
                                <AggregateColumnDirective field='openStock' type='Sum' format='N2' footerTemplate={footerSum} />
                                <AggregateColumnDirective field='transferIn' type='Sum' format='N2' footerTemplate={footerSum} />
                                <AggregateColumnDirective field='totalStock' type='Sum' format='N2' footerTemplate={footerSum} />
                                <AggregateColumnDirective field='stockOut' type='Sum' format='N2' footerTemplate={footerSum} />
                                <AggregateColumnDirective field='saleValue' type='Sum' format='N2' footerTemplate={footerSum} />
                                <AggregateColumnDirective field='transferOut' type='Sum' format='N2' footerTemplate={footerSum} />
                                <AggregateColumnDirective field='closeStock' type='Sum' format='N2' footerTemplate={footerSum} />
                                <AggregateColumnDirective field='stockValue' type='Sum' format='N2' footerTemplate={footerSum} />
                            </AggregateColumnsDirective>
                        </AggregateDirective>
                    </AggregatesDirective>
                    <Inject services={[Toolbar, ExcelExport, PdfExport, Page, Aggregate, ColumnChooser]} />
                </GridComponent>
            </div>
        </div>
    </div>);
}
export default StockReport;