import * as React from 'react';
import { GridComponent, ColumnsDirective, ColumnDirective, Inject, Toolbar, ExcelExport, PdfExport, Page, AggregateColumnsDirective, AggregateColumnDirective, AggregateDirective, AggregatesDirective, Aggregate } from '@syncfusion/ej2-react-grids';
import useAuth from '../../../hooks/useAuth';
import { image } from './image';
import { getCurrentDateInWords } from './helper';
import { ToolbarComponent, ItemsDirective, ItemDirective } from '@syncfusion/ej2-react-navigations';
import { addClass, removeClass } from '@syncfusion/ej2-base';
//isAllChecked={isAllChecked} isRetailChecked={isRetailChecked} isWholsaleChecked={isWholsaleChecked} isSpecialChecked={isSpecialChecked}
function ProductReportTable({ isAllChecked, isRetailChecked, isWholsaleChecked, isSpecialChecked, data = [], showReport, setShowReport }) {
    const { auth } = useAuth()
    const month = ((new Date()).getMonth().toString()) + '/';
    const date = ((new Date()).getDate().toString()) + '/';
    const year = ((new Date()).getFullYear().toString());
    // const [] = useState(false)
    const [showRetail, setShowRetail] = React.useState(true)
    const [showWholesale, setShowWholesale] = React.useState(true)
    const [showSpecial, setShowSpecial] = React.useState(true)
    const toolbarOptions = ['ExcelExport', 'PdfExport'];
    let gridInstance;
    function toolbarClick(args) {
        switch (args.item.id) {
            case 'Grid_pdfexport':
                if (!isAllChecked) {
                    gridInstance.columns[2].visible = isRetailChecked;
                    gridInstance.columns[3].visible = isWholsaleChecked;
                    gridInstance.columns[4].visible = isSpecialChecked;
                    gridInstance.columns[5].visible = false;
                    gridInstance.columns[6].visible = false;
                    gridInstance.columns[7].visible = false;
                    gridInstance.columns[8].visible = false;
                }

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
        if (isAllChecked) {
            return {
                pageOrientation: isAllChecked ? 'Landscape' : "Portrait",
                screenX: 0,

                pageSize: 'letter',

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
        else {
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
                            value: 'PURCHASE REPORT',
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
                            position: { x: 610, y: 110 },
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
                fileName: `ProductReport.pdf`
            };
        }
    }
    const footerSum = (props) => {
        return (<span>{props.Sum}</span>);
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

    let flag = false;

    let ToolbarInstance;
    function click(e) {
        if (!flag) {
            return;
        }
        let element = e.target;
        if (!element.classList.contains('e-tbar-btn-text') && !element.classList.contains('e-tbar-btn')) {
            return;
        }
        element = (element.tagName === 'BUTTON' ? element.firstElementChild : element);
        flag = false;
        let hidden = element.classList.contains('e-ghidden');
        let classFn = hidden ? removeClass : addClass;
        const visibleColumns = Array.from(ToolbarInstance.element.getElementsByClassName('e-tbar-btn-text'))
            .filter((item) => !(item.classList.contains('e-ghidden')));
        const isLastVisibleColumn = visibleColumns.length === 1 && visibleColumns[0].parentElement === element.parentElement;
        if (hidden) {
            classFn([element], 'e-ghidden');
            gridInstance.showColumns(element.innerHTML);
        }
        else {
            // if (isLastVisibleColumn) {
            //     alert("At least one column should be visible.");
            //     flag = true;
            //     return;
            // }
            classFn([element], 'e-ghidden');
            gridInstance.hideColumns(element.innerHTML);
        }
        flag = true;
    }
    function dataBound() {
        flag = true;
    }

    // const content = React.useMemo(() => {
    //     return (

    //     );
    // }, [showRetail, showReport, data]);





    return (<div className='control-pane'>
        <div className='control-section'>

            <div>

                <GridComponent
                    id="Grid"
                    beforePdfExport={beforePdfExport}
                    dataSource={data}
                    ref={grid => gridInstance = grid}
                    pdfHeaderQueryCellInfo={pdfHeaderQueryCellInfo}
                    toolbar={toolbarOptions}
                    allowExcelExport={true}
                    allowPdfExport={true}
                    toolbarClick={toolbarClick.bind(this)}
                    height={500}
                    allowPaging={true}
                    pageSettings={{ pageCount: 2, pageSize: 1000 }}
                    dataBound={dataBound}
                >
                    <ColumnsDirective>
                        <ColumnDirective field='Name' headerText='Product Name' width={isAllChecked ?? "13%"}></ColumnDirective>
                        <ColumnDirective field='QTY' headerText='Total QTY' textAlign='Center' width={"5%"} format='N2'></ColumnDirective>
                        <ColumnDirective field='retailPrice' headerText='Retail' textAlign='Right' format='N2' width={"7%"}></ColumnDirective>
                        <ColumnDirective field='wholeSalePrice' headerText='Wholesale' textAlign='Right' format='N2' width={"7%"}></ColumnDirective>
                        <ColumnDirective field='specialPrice' visible={showSpecial} headerText='Special' textAlign='Right' format='N2' width={"7%"}></ColumnDirective>
                        <ColumnDirective field='batchNumber' headerText='Batch No.' format='N2' width={"7%"}></ColumnDirective>
                        <ColumnDirective field='quantity' headerText='QTY' textAlign='Center' format='N2' width={"5%"}></ColumnDirective>
                        <ColumnDirective field='manufacturingDate' headerText='MGF Date' width={"6%"}></ColumnDirective>
                        <ColumnDirective field='expireDate' headerText='EXP. Date' width={"6%"}></ColumnDirective>

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