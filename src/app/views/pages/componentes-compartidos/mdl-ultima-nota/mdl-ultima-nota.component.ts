import { NotaMedicaUtilsService } from './../../../../utils/nota-medica-utils.service';
import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NotasMedicasService } from 'src/app/servicios/notas-medicas/notas-medicas.service';
import { PacienteService } from 'src/app/servicios/paciente/paciente.service';
import jsPDF from 'jspdf';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;


@Component({
  selector: 'app-mdl-ultima-nota',
  templateUrl: './mdl-ultima-nota.component.html',
  styleUrls: ['./mdl-ultima-nota.component.scss']
})
export class MdlUltimaNotaComponent implements OnInit {
  tituloModal = "Ultima nota medica"
  paciente?
  notaMedica?
  docDf2: any
  @Input() idPaciente: any
  @Input() idNotaMedica: any
  constructor(
    public activeModal: NgbActiveModal,
    private notasMedicasService: NotasMedicasService,
    private pacienteService: PacienteService,
    private notaMedicaUtilsService: NotaMedicaUtilsService
  ) { }

  ngOnInit(): void {

    this.obtenerPaciente();
    this.obtenerNotaMedica();

  }

  imprimir() {
    if (this.notaMedica) { 
      this.docDf2 = { content: [] }
      this.docDf2.content.push(this.notaMedicaUtilsService.creadPdfNotaMedica(this.notaMedica))
      pdfMake.createPdf(this.docDf2).open();
    }
  }

  /******************WEB SERVICES************************** */
  obtenerPaciente() {
    if (this.idPaciente > 0) {
      this.notasMedicasService.obtenerUltimaNotaMedicaXPaciente({ idPaciente: this.idPaciente }).subscribe((data: any) => {
        if (data.estatus == 200) {
          this.notaMedica = { ...data.notaMedica, ...data.paciente }
        }
      })
    }
  }

  obtenerNotaMedica() {
    if (this.idNotaMedica > 0) {
      this.notasMedicasService.obteneNotasMedicasXId({ idNotaMedica: this.idNotaMedica }).subscribe((data: any) => {
        if (data.estatus == 200) {
          this.notaMedica = data.modelo;
          console.log(this.notaMedica)
        }
      })
    }
  }

  creadPdfNotaMedica() {
    this.docDf2 = {
      content: [
        {
          style: 'tableHeader',
          table: {
            widths: ['auto', '*'],
            body: [
              [{
                image: this.image,
                width: 80,
                height: 80,
              }, {
                style: 'tableSubHeader',
                table: {
                  widths: ['*', '*'],
                  body: [
                    [{ text: "Dra. Tahitiana Abelina Zaragoza Salas" }, { text: ' Fecha :09/09/2021', alignment: 'right' }],
                    [{ text: "Cirugía General  & Cirugía Laparoscópica" }, {}],
                    [{ text: "C.p 6932313" }, {}],
                    [{ text: "C.Especialidad 10451845" }, {}]]

                },
                layout: 'noBorders',
                fontSize: 10,
                color: '#393d42'
              }],

            ]
          },
          layout: 'noBorders',
          fontSize: 10
        },

        { text: ' ', bold: true, margin: [0, 5, 0, 5] },

        {
          style: 'tableExample',
          table: {
            widths: ['*', '*', '*', '*'],
            body: [
              [{ text: 'Datos del paciente', bold: true, color: 'white', style: 'tableHeader', colSpan: 4, alignment: 'center', fillColor: '#393d42' }, {}, {}, {}],
              [{ text: 'Nombre', alignment: 'center', bold: true }, { text: 'Fecha Nacimiento', alignment: 'center', bold: true }, { text: 'Edad', alignment: 'center' }, { text: 'Ultima Visita', bold: true, alignment: 'center' }],
              [{ text: (this.notaMedica.nombres + ' ' + this.notaMedica.apellidoPaterno + ' ' + this.notaMedica.apellidoMaterno), alignment: 'center', color: "#777777", fillColor: "#F5F5F5" }, { color: "#777777", text: this.notaMedica.fechaNacimiento, fillColor: "#F5F5F5", alignment: 'center' }, { color: "#777777", text: this.notaMedica.edad, fillColor: "#F5F5F5", alignment: 'center' }, { color: "#777777", text: this.notaMedica.fechaUltimaNotaMedica, alignment: 'center', fillColor: "#F5F5F5" }]
            ]
          },
          layout: 'noBorders',
          color: 'black',
          fontSize: 10
        },
        { text: ' ', bold: true, margin: [0, 5, 0, 5] },

        {
          style: 'tableSignosVitales',
          table: {
            widths: ['*', '*', 100, 100, '*', '*', '*'],
            body: [
              [
                { text: 'Signos Vitales', bold: true, color: 'white', style: 'tableHeader', colSpan: 7, alignment: 'center', fillColor: '#393d42' }, {}, {}, {}, {}, {}, {}],

              [
                { text: 'Peso: ' + this.notaMedica.peso, alignment: 'center', bold: true },
                { text: 'Talla: ' + this.notaMedica.talla, alignment: 'center', bold: true },
                { text: 'Temperatura: ' + this.notaMedica.temperatura, alignment: 'center', bold: true },
                { text: 'Saturacion: ' + this.notaMedica.saturacion, alignment: 'center', bold: true },
                { text: 'FR: ' + this.notaMedica.fr, alignment: 'center', bold: true },
                { text: 'TA: ' + this.notaMedica.ta, alignment: 'center', bold: true },
                { text: 'FC: ' + this.notaMedica.fc, alignment: 'center', bold: true }
              ]

            ]
          },
          layout: 'noBorders',
          color: 'black',
          fontSize: 10
        },

        { text: ' ', bold: true, margin: [0, 10, 0, 10] },

        {
          style: 'tableMotivoConsulta',
          table: {
            widths: ['*'],
            body: [
              [{ text: 'Motivo de la Consulta', color: 'white', style: 'tableHeader', alignment: 'center', fillColor: '#393d42', bold: true, border: [false, false, false, false] }],
              [{ text: this.notaMedica.motivoConsulta.replace(/<(?:.|\n)*?>/gm, '').replace('  ', ' '), bold: true, alignment: 'center', fillColor: '#F5F5F5', color: "#777777", border: [true, true, true, true] }],
            ]
          },
          color: 'white',
          fontSize: 10,
        },

        { text: ' ', bold: true, margin: [0, 10, 0, 10] },

        {
          style: 'tableDiagnostico',
          table: {
            widths: ['*'],
            body: [
              [{ text: 'Diagnostico', color: 'white', style: 'tableHeader', alignment: 'center', fillColor: '#393d42', bold: true, border: [false, false, false, false] }],
              [{ text: this.notaMedica.diagnostico.replace(/<(?:.|\n)*?>/gm, '').replace('  ', ' '), alignment: 'center', fillColor: '#F5F5F5', bold: true, color: "#777777", border: [true, true, true, true] }],
            ]
          },
          color: 'white',
          fontSize: 10
        },

        { text: ' ', bold: true, margin: [0, 10, 0, 10] },

        {
          style: 'tableTratamiento',
          table: {
            widths: ['*'],
            body: [
              [{ text: 'Tratamiento', color: 'white', style: 'tableHeader', alignment: 'center', fillColor: '#393d42', bold: true, border: [false, false, false, false] }],
              [{ text: this.notaMedica.tratamiento.replace(/<(?:.|\n)*?>/gm, '').replace('  ', ' '), alignment: 'center', fillColor: '#F5F5F5', bold: true, color: "#777777", border: [true, true, true, true] }],
            ]
          },
          color: 'white',
          fontSize: 10
        },
      ]
    }
  }
  docDefinition = {
    content: [
      { text: 'Tables', style: 'header' },
      'Official documentation is in progress, this document is just a glimpse of what is possible with pdfmake and its layout engine.',
      { text: 'A simple table (no headers, no width specified, no spans, no styling)', style: 'subheader' },
      'The following table has nothing more than a body array',
      {
        style: 'tableExample',
        table: {
          body: [
            ['Column 1', 'Column 2', 'Column 3'],
            ['One value goes here', 'Another one here', 'OK?']
          ]
        }
      },
      { text: 'A simple table with nested elements', style: 'subheader' },
      'It is of course possible to nest any other type of nodes available in pdfmake inside table cells',
      {
        style: 'tableExample',
        table: {
          body: [
            ['Column 1', 'Column 2', 'Column 3'],
            [
              {
                stack: [
                  'Let\'s try an unordered list',
                  {
                    ul: [
                      'item 1',
                      'item 2'
                    ]
                  }
                ]
              },
              [
                'or a nested table',
                {
                  table: {
                    body: [
                      ['Col1', 'Col2', 'Col3'],
                      ['1', '2', '3'],
                      ['1', '2', '3']
                    ]
                  },
                }
              ],
              {
                text: [
                  'Inlines can be ',
                  { text: 'styled\n', italics: true },
                  { text: 'easily as everywhere else', fontSize: 10 }]
              }
            ]
          ]
        }
      },
      { text: 'Defining column widths', style: 'subheader' },
      'Tables support the same width definitions as standard columns:',
      {
        bold: true,
        ul: [
          'auto',
          'star',
          'fixed value'
        ]
      },
      {
        style: 'tableExample',
        table: {
          widths: [100, '*', 200, '*'],
          body: [
            ['width=100', 'star-sized', 'width=200', 'star-sized'],
            ['fixed-width cells have exactly the specified width', { text: 'nothing interesting here', italics: true, color: 'gray' }, { text: 'nothing interesting here', italics: true, color: 'gray' }, { text: 'nothing interesting here', italics: true, color: 'gray' }]
          ]
        }
      },
      {
        style: 'tableExample',
        table: {
          widths: ['*', 'auto'],
          body: [
            ['This is a star-sized column. The next column over, an auto-sized column, will wrap to accomodate all the text in this cell.', 'I am auto sized.'],
          ]
        }
      },
      {
        style: 'tableExample',
        table: {
          widths: ['*', 'auto'],
          body: [
            ['This is a star-sized column. The next column over, an auto-sized column, will not wrap to accomodate all the text in this cell, because it has been given the noWrap style.', { text: 'I am auto sized.', noWrap: true }],
          ]
        }
      },
      { text: 'Defining row heights', style: 'subheader' },
      {
        style: 'tableExample',
        table: {
          heights: [20, 50, 70],
          body: [
            ['row 1 with height 20', 'column B'],
            ['row 2 with height 50', 'column B'],
            ['row 3 with height 70', 'column B']
          ]
        }
      },
      'With same height:',
      {
        style: 'tableExample',
        table: {
          heights: 40,
          body: [
            ['row 1', 'column B'],
            ['row 2', 'column B'],
            ['row 3', 'column B']
          ]
        }
      },
      'With height from function:',
      {
        style: 'tableExample',
        table: {
          heights: function (row) {
            return (row + 1) * 25;
          },
          body: [
            ['row 1', 'column B'],
            ['row 2', 'column B'],
            ['row 3', 'column B']
          ]
        }
      },
      { text: 'Column/row spans', pageBreak: 'before', style: 'subheader' },
      'Each cell-element can set a rowSpan or colSpan',
      {
        style: 'tableExample',
        color: '#444',
        table: {
          widths: [200, 'auto', 'auto'],
          headerRows: 2,
          // keepWithHeaderRows: 1,
          body: [
            [{ text: 'Header with Colspan = 2', style: 'tableHeader', colSpan: 2, alignment: 'center' }, {}, { text: 'Header 3', style: 'tableHeader', alignment: 'center' }],
            [{ text: 'Header 1', style: 'tableHeader', alignment: 'center' }, { text: 'Header 2', style: 'tableHeader', alignment: 'center' }, { text: 'Header 3', style: 'tableHeader', alignment: 'center' }],
            ['Sample value 1', 'Sample value 2', 'Sample value 3'],
            [{ rowSpan: 3, text: 'rowSpan set to 3\nLorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor' }, 'Sample value 2', 'Sample value 3'],
            ['', 'Sample value 2', 'Sample value 3'],
            ['Sample value 1', 'Sample value 2', 'Sample value 3'],
            ['Sample value 1', { colSpan: 2, rowSpan: 2, text: 'Both:\nrowSpan and colSpan\ncan be defined at the same time' }, ''],
            ['Sample value 1', '', ''],
          ]
        }
      },

      { text: 'Headers', pageBreak: 'before', style: 'subheader' },
      'You can declare how many rows should be treated as a header. Headers are automatically repeated on the following pages',
      { text: ['It is also possible to set keepWithHeaderRows to make sure there will be no page-break between the header and these rows. Take a look at the document-definition and play with it. If you set it to one, the following table will automatically start on the next page, since there\'s not enough space for the first row to be rendered here'], color: 'gray', italics: true },
      {
        style: 'tableExample',
        table: {
          headerRows: 1,
          // dontBreakRows: true,
          // keepWithHeaderRows: 1,
          body: [
            [{ text: 'Header 1', style: 'tableHeader' }, { text: 'Header 2', style: 'tableHeader' }, { text: 'Header 3', style: 'tableHeader' }],
            [
              'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
              'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
              'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
            ]
          ]
        }
      },
      { text: 'Styling tables', style: 'subheader' },
      'You can provide a custom styler for the table. Currently it supports:',
      {
        ul: [
          'line widths',
          'line colors',
          'cell paddings',
        ]
      },
      'with more options coming soon...\n\npdfmake currently has a few predefined styles (see them on the next page)',
      { text: 'noBorders:', fontSize: 14, bold: true, pageBreak: 'before', margin: [0, 0, 0, 8] },
      {
        style: 'tableExample',
        table: {
          headerRows: 1,
          body: [
            [{ text: 'Header 1', style: 'tableHeader' }, { text: 'Header 2', style: 'tableHeader' }, { text: 'Header 3', style: 'tableHeader' }],
            ['Sample value 1', 'Sample value 2', 'Sample value 3'],
            ['Sample value 1', 'Sample value 2', 'Sample value 3'],
            ['Sample value 1', 'Sample value 2', 'Sample value 3'],
            ['Sample value 1', 'Sample value 2', 'Sample value 3'],
            ['Sample value 1', 'Sample value 2', 'Sample value 3'],
          ]
        },
        layout: 'noBorders'
      },
      { text: 'headerLineOnly:', fontSize: 14, bold: true, margin: [0, 20, 0, 8] },
      {
        style: 'tableExample',
        table: {
          headerRows: 1,
          body: [
            [{ text: 'Header 1', style: 'tableHeader' }, { text: 'Header 2', style: 'tableHeader' }, { text: 'Header 3', style: 'tableHeader' }],
            ['Sample value 1', 'Sample value 2', 'Sample value 3'],
            ['Sample value 1', 'Sample value 2', 'Sample value 3'],
            ['Sample value 1', 'Sample value 2', 'Sample value 3'],
            ['Sample value 1', 'Sample value 2', 'Sample value 3'],
            ['Sample value 1', 'Sample value 2', 'Sample value 3'],
          ]
        },
        layout: 'headerLineOnly'
      },
      { text: 'lightHorizontalLines:', fontSize: 14, bold: true, margin: [0, 20, 0, 8] },
      {
        style: 'tableExample',
        table: {
          headerRows: 1,
          body: [
            [{ text: 'Header 1', style: 'tableHeader' }, { text: 'Header 2', style: 'tableHeader' }, { text: 'Header 3', style: 'tableHeader' }],
            ['Sample value 1', 'Sample value 2', 'Sample value 3'],
            ['Sample value 1', 'Sample value 2', 'Sample value 3'],
            ['Sample value 1', 'Sample value 2', 'Sample value 3'],
            ['Sample value 1', 'Sample value 2', 'Sample value 3'],
            ['Sample value 1', 'Sample value 2', 'Sample value 3'],
          ]
        },
        layout: 'lightHorizontalLines'
      },
      { text: 'but you can provide a custom styler as well', margin: [0, 20, 0, 8] },
      {
        style: 'tableExample',
        table: {
          headerRows: 1,
          body: [
            [{ text: 'Header 1', style: 'tableHeader' }, { text: 'Header 2', style: 'tableHeader' }, { text: 'Header 3', style: 'tableHeader' }],
            ['Sample value 1', 'Sample value 2', 'Sample value 3'],
            ['Sample value 1', 'Sample value 2', 'Sample value 3'],
            ['Sample value 1', 'Sample value 2', 'Sample value 3'],
            ['Sample value 1', 'Sample value 2', 'Sample value 3'],
            ['Sample value 1', 'Sample value 2', 'Sample value 3'],
          ]
        },
        layout: {
          hLineWidth: function (i, node) {
            return (i === 0 || i === node.table.body.length) ? 2 : 1;
          },
          vLineWidth: function (i, node) {
            return (i === 0 || i === node.table.widths.length) ? 2 : 1;
          },
          hLineColor: function (i, node) {
            return (i === 0 || i === node.table.body.length) ? 'black' : 'gray';
          },
          vLineColor: function (i, node) {
            return (i === 0 || i === node.table.widths.length) ? 'black' : 'gray';
          },
          // hLineStyle: function (i, node) { return {dash: { length: 10, space: 4 }}; },
          // vLineStyle: function (i, node) { return {dash: { length: 10, space: 4 }}; },
          // paddingLeft: function(i, node) { return 4; },
          // paddingRight: function(i, node) { return 4; },
          // paddingTop: function(i, node) { return 2; },
          // paddingBottom: function(i, node) { return 2; },
          // fillColor: function (rowIndex, node, columnIndex) { return null; }
        }
      },
      { text: 'zebra style', margin: [0, 20, 0, 8] },
      {
        style: 'tableExample',
        table: {
          body: [
            ['Sample value 1', 'Sample value 2', 'Sample value 3'],
            ['Sample value 1', 'Sample value 2', 'Sample value 3'],
            ['Sample value 1', 'Sample value 2', 'Sample value 3'],
            ['Sample value 1', 'Sample value 2', 'Sample value 3'],
            ['Sample value 1', 'Sample value 2', 'Sample value 3'],
          ]
        },
        layout: {
          fillColor: function (rowIndex, node, columnIndex) {
            return (rowIndex % 2 === 0) ? '#CCCCCC' : null;
          }
        }
      },
      { text: 'handling fill color opacity...', margin: [0, 20, 0, 8] },
      { text: '... just hardcoding values in the second row', margin: [0, 20, 0, 8] },
      {
        style: 'tableExample',
        table: {
          body: [
            ['Sample value 1', 'Sample value 2', 'Sample value 3'],
            [
              { text: 'Sample value 1', fillOpacity: 0.15, fillColor: 'blue' },
              { text: 'Sample value 2', fillOpacity: 0.60, fillColor: 'blue' },
              { text: 'Sample value 3', fillOpacity: 0.85, fillColor: 'blue' },
            ],
            ['Sample value 1', 'Sample value 2', 'Sample value 3']
          ]
        },
      },
      { text: '... using a custom styler and overriding it in the second row', margin: [0, 20, 0, 8] },
      {
        style: 'tableOpacityExample',
        table: {
          body: [
            ['Sample value 1', 'Sample value 2', 'Sample value 3'],
            [
              { text: 'Sample value 1', fillOpacity: 0.15 },
              { text: 'Sample value 2', fillOpacity: 0.60 },
              { text: 'Sample value 3', fillOpacity: 0.85 },
            ],
            ['Sample value 1', 'Sample value 2', 'Sample value 3']
          ]
        },
      },
      { text: '... with a function (opacity at 0 means fully transparent, i.e no color)', margin: [0, 20, 0, 8] },
      {
        style: 'tableExample',
        table: {
          body: [
            ['Sample value 1', 'Sample value 2', 'Sample value 3'],
            ['Sample value 1', 'Sample value 2', 'Sample value 3'],
            ['Sample value 1', 'Sample value 2', 'Sample value 3'],
            ['Sample value 1', 'Sample value 2', 'Sample value 3'],
            ['Sample value 1', 'Sample value 2', 'Sample value 3'],
            ['Sample value 1', 'Sample value 2', 'Sample value 3'],
            ['Sample value 1', 'Sample value 2', 'Sample value 3'],
            ['Sample value 1', 'Sample value 2', 'Sample value 3'],
          ]
        },
        layout: {
          fillColor: 'blue',
          fillOpacity: function (rowIndex, node, columnIndex) {
            return (rowIndex / 8 + columnIndex / 3);
          }
        }
      },
      { text: 'and can be used dash border', margin: [0, 20, 0, 8] },
      {
        style: 'tableExample',
        table: {
          headerRows: 1,
          body: [
            [{ text: 'Header 1', style: 'tableHeader' }, { text: 'Header 2', style: 'tableHeader' }, { text: 'Header 3', style: 'tableHeader' }],
            ['Sample value 1', 'Sample value 2', 'Sample value 3'],
            ['Sample value 1', 'Sample value 2', 'Sample value 3'],
            ['Sample value 1', 'Sample value 2', 'Sample value 3'],
            ['Sample value 1', 'Sample value 2', 'Sample value 3'],
            ['Sample value 1', 'Sample value 2', 'Sample value 3'],
          ]
        },
        layout: {
          hLineWidth: function (i, node) {
            return (i === 0 || i === node.table.body.length) ? 2 : 1;
          },
          vLineWidth: function (i, node) {
            return (i === 0 || i === node.table.widths.length) ? 2 : 1;
          },
          hLineColor: function (i, node) {
            return 'black';
          },
          vLineColor: function (i, node) {
            return 'black';
          },
          hLineStyle: function (i, node) {
            if (i === 0 || i === node.table.body.length) {
              return null;
            }
            return { dash: { length: 10, space: 4 } };
          },
          vLineStyle: function (i, node) {
            if (i === 0 || i === node.table.widths.length) {
              return null;
            }
            return { dash: { length: 4 } };
          },
          // paddingLeft: function(i, node) { return 4; },
          // paddingRight: function(i, node) { return 4; },
          // paddingTop: function(i, node) { return 2; },
          // paddingBottom: function(i, node) { return 2; },
          // fillColor: function (i, node) { return null; }
        }
      },
      { text: 'Optional border', fontSize: 14, bold: true, pageBreak: 'before', margin: [0, 0, 0, 8] },
      'Each cell contains an optional border property: an array of 4 booleans for left border, top border, right border, bottom border.',
      {
        style: 'tableExample',
        table: {
          body: [
            [
              {
                border: [false, true, false, false],
                fillColor: '#eeeeee',
                text: 'border:\n[false, true, false, false]'
              },
              {
                border: [false, false, false, false],
                fillColor: '#dddddd',
                text: 'border:\n[false, false, false, false]'
              },
              {
                border: [true, true, true, true],
                fillColor: '#eeeeee',
                text: 'border:\n[true, true, true, true]'
              }
            ],
            [
              {
                rowSpan: 3,
                border: [true, true, true, true],
                fillColor: '#eeeeff',
                text: 'rowSpan: 3\n\nborder:\n[true, true, true, true]'
              },
              {
                border: undefined,
                fillColor: '#eeeeee',
                text: 'border:\nundefined'
              },
              {
                border: [true, false, false, false],
                fillColor: '#dddddd',
                text: 'border:\n[true, false, false, false]'
              }
            ],
            [
              '',
              {
                colSpan: 2,
                border: [true, true, true, true],
                fillColor: '#eeffee',
                text: 'colSpan: 2\n\nborder:\n[true, true, true, true]'
              },
              ''
            ],
            [
              '',
              {
                border: undefined,
                fillColor: '#eeeeee',
                text: 'border:\nundefined'
              },
              {
                border: [false, false, true, true],
                fillColor: '#dddddd',
                text: 'border:\n[false, false, true, true]'
              }
            ]
          ]
        },
        layout: {
          defaultBorder: false,
        }
      },
      'For every cell without a border property, whether it has all borders or not is determined by layout.defaultBorder, which is false in the table above and true (by default) in the table below.',
      {
        style: 'tableExample',
        table: {
          body: [
            [
              {
                border: [false, false, false, false],
                fillColor: '#eeeeee',
                text: 'border:\n[false, false, false, false]'
              },
              {
                fillColor: '#dddddd',
                text: 'border:\nundefined'
              },
              {
                fillColor: '#eeeeee',
                text: 'border:\nundefined'
              },
            ],
            [
              {
                fillColor: '#dddddd',
                text: 'border:\nundefined'
              },
              {
                fillColor: '#eeeeee',
                text: 'border:\nundefined'
              },
              {
                border: [true, true, false, false],
                fillColor: '#dddddd',
                text: 'border:\n[true, true, false, false]'
              },
            ]
          ]
        }
      },
      'And some other examples with rowSpan/colSpan...',
      {
        style: 'tableExample',
        table: {
          body: [
            [
              '',
              'column 1',
              'column 2',
              'column 3'
            ],
            [
              'row 1',
              {
                rowSpan: 3,
                colSpan: 3,
                border: [true, true, true, true],
                fillColor: '#cccccc',
                text: 'rowSpan: 3\ncolSpan: 3\n\nborder:\n[true, true, true, true]'
              },
              '',
              ''
            ],
            [
              'row 2',
              '',
              '',
              ''
            ],
            [
              'row 3',
              '',
              '',
              ''
            ]
          ]
        },
        layout: {
          defaultBorder: false,
        }
      },
      {
        style: 'tableExample',
        table: {
          body: [
            [
              {
                colSpan: 3,
                text: 'colSpan: 3\n\nborder:\n[false, false, false, false]',
                fillColor: '#eeeeee',
                border: [false, false, false, false]
              },
              '',
              ''
            ],
            [
              'border:\nundefined',
              'border:\nundefined',
              'border:\nundefined'
            ]
          ]
        }
      },
      {
        style: 'tableExample',
        table: {
          body: [
            [
              { rowSpan: 3, text: 'rowSpan: 3\n\nborder:\n[false, false, false, false]', fillColor: '#eeeeee', border: [false, false, false, false] },
              'border:\nundefined',
              'border:\nundefined'
            ],
            [
              '',
              'border:\nundefined',
              'border:\nundefined'
            ],
            [
              '',
              'border:\nundefined',
              'border:\nundefined'
            ]
          ]
        }
      },
      { text: 'BorderColor per Cell with Column/row spans', pageBreak: 'before', style: 'subheader' },
      'Each cell-element can set the borderColor (the cell above or left of the current cell has priority',
      {
        style: 'tableExample',
        color: '#444',
        table: {
          widths: [200, 'auto', 'auto'],
          headerRows: 2,
          // keepWithHeaderRows: 1,
          body: [
            [
              {
                text: 'Header with Colspan = 3',
                style: 'tableHeader',
                colSpan: 3,
                borderColor: ['#ff00ff', '#00ffff', '#ff00ff', '#00ffff'],
                alignment: 'center',
              },
              {},
              {},
            ],
            [
              {
                text: 'Header 1',
                style: 'tableHeader',
                alignment: 'center',
              },
              {
                text: 'Header 2',
                style: 'tableHeader',
                alignment: 'center',
              },
              {
                text: 'Header 3',
                style: 'tableHeader',
                alignment: 'center',
              },
            ],
            [
              'Sample value 1',
              'Sample value 2',
              'Sample value 3',
            ],
            [
              {
                rowSpan: 3,
                borderColor: ['#ff00ff', '#00ffff', '#ff00ff', '#00ffff'],
                text: 'rowSpan set to 3\nLorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor',
              },
              'Sample value 2',
              {
                text: 'Sample value 3',
                borderColor: ['#ff00ff', '#00ffff', '#ff00ff', '#00ffff'],
              },
            ],
            [
              '',
              'Sample value 2',
              'Sample value 3',
            ],
            [
              'Sample value 1',
              'Sample value 2',
              'Sample value 3',
            ],
            [
              'Sample value 1',
              {
                colSpan: 2,
                rowSpan: 2,
                borderColor: ['#ff00ff', '#00ffff', '#ff00ff', '#00ffff'],
                text: 'Both:\nrowSpan and colSpan\ncan be defined at the same time',
              },
              '',
            ],
            [
              'Sample value 1',
              {
                text: 'a', borderColor: ['#ff00ff', '#00ffff', '#ff00ff', '#00ffff'],
              },
              {
                text: '',
                borderColor: ['#ff00ff', '#00ffff', '#ff00ff', '#00ffff'],
              },
            ],
          ],
        },
      }
    ],
    styles: {
      header: {
        fontSize: 18,
        bold: true,
        margin: [0, 0, 0, 10]
      },
      subheader: {
        fontSize: 16,
        bold: true,
        margin: [0, 10, 0, 5]
      },
      tableExample: {
        margin: [0, 5, 0, 15]
      },
      tableOpacityExample: {
        margin: [0, 5, 0, 15],
        fillColor: 'blue',
        fillOpacity: 0.3
      },
      tableHeader: {
        bold: true,
        fontSize: 13,
        color: 'black'
      }
    },
    defaultStyle: {
      // alignment: 'justify'
    }
  };


  image = 'data:image/png;base64,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'
}
