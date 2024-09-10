import jsPDF from 'jspdf';
import React from 'react';

const imagePath = '/brasao.png';

interface IReportPdfProps
{
  data: string;
}

const addImageToPDF = async (
  doc: jsPDF,
  x: number,
  y: number,
  width: number,
  height: number
) =>
{
  try
  {
    const img = new Image();
    img.src = imagePath;
    doc.addImage( img, 'png', x, y, width, height );
  } catch ( error )
  {
    console.error( 'Erro ao adicionar imagem ao PDF:', error );
  }
};

const addTextWithMargins = ( doc: jsPDF, imageWidth: number, imageHeight: number, margin: number ): number =>
{
  // Posições da imagem
  const x1 = margin + 30; // Distância da margem esquerda
  const y1 = margin + 10; // Distância da margem superior

  // Adicione o primeiro texto
  doc.setFontSize( 12 );
  doc.setFont( 'Verdana', 'bold' );
  const text1 = 'SECRETARIA DE ESTADO DE FAZENDA DE MINAS GERAIS';
  const text1X = x1 + 10; // Início do texto 40px a esquerda da margem
  const text1Y = y1; // Início do texto 12px abaixo da margem superior

  doc.text( text1, text1X, text1Y );

  // Adicione o segundo texto
  doc.setFontSize( 12 );
  doc.setFont( 'Verdana', 'bold' );
  const text2 = 'Conselho Contribuinte do Estado de Minas Gerais';
  const text2X = x1 + 23; // Início do texto 40px a esquerda da margem
  const text2Y = text1Y + 8; // Início do texto 18px abaixo do primeiro texto

  doc.text( text2, text2X, text2Y );

  // Adicione o terceiro texto
  doc.setFontSize( 14 );
  doc.setFont( 'Verdana', 'bold' );
  const text3 = 'Relatório de Produtividade da Assessoria';
  const text3X = x1 + 25; // Início do texto 40px a esquerda da margem
  const text3Y = text2Y + 16; // Início do texto 24px abaixo do segundo texto

  doc.text( text3, text3X, text3Y );

  // Linha abaixo dos textos
  const lineY = text3Y + 10; // Posição Y da linha, 10 pixels abaixo do terceiro texto
  doc.setDrawColor( 0, 0, 0 ); // Cor da linha (preto)
  doc.setLineWidth( 0.5 ); // Espessura da linha
  doc.line( margin, lineY - 5, doc.internal.pageSize.width - margin, lineY - 5 );

  return lineY;

};

const addHeaderWithColumns = ( doc: jsPDF, margin: number, linhaInicialY: number ): number =>
{
  // Definir o tamanho das colunas com base nas larguras fornecidas
  const tableColumnWidths = [ 45, 45, 60 ]; // Larguras das colunas
  const totalWidth = tableColumnWidths.reduce( ( sum, width ) => sum + width, 0 );
  const availableWidth = doc.internal.pageSize.width - 2 * margin; // Largura total disponível para a tabela

  const scale = availableWidth / totalWidth; // Ajuste a escala para caber na página
  const columnWidth = tableColumnWidths.map( width => width * scale );

  const rowHeight = 10; // Altura de cada linha de cabeçalho
  const headerY = linhaInicialY; // Posição Y do cabeçalho
  const dataY = headerY + rowHeight + 20; // Posição Y dos dados

  // Definir fontes e tamanhos para o cabeçalho
  doc.setFont( 'Verdana', 'bold' );
  doc.setFontSize( 12 );

  // Adicionar uma linha horizontal antes do cabeçalho
  doc.setDrawColor( 0, 0, 0 ); // Cor da linha (preto)
  doc.setLineWidth( 0.3 ); // Espessura da linha
  doc.line( margin, headerY, doc.internal.pageSize.width - margin, headerY );

  // Adicionar cabeçalhos das colunas
  let xOffset = margin;
  const headers = [ 'Período de Referência', 'Dias úteis do período', 'Total de pareceres gerados no período' ];
  headers.forEach( ( header, index ) =>
  {
    const x = xOffset + columnWidth[ index ] / 2;
    doc.text( header, x, headerY + 5, { align: 'center' } );
    xOffset += columnWidth[ index ];
  } );

  // Adicionar uma linha horizontal abaixo do cabeçalho
  doc.setDrawColor( 0, 0, 0 ); // Cor da linha (preto)
  doc.setLineWidth( 0.3 ); // Espessura da linha
  doc.line( margin, headerY + rowHeight - 2, doc.internal.pageSize.width - margin, headerY + rowHeight - 2 );

  // Adicionar linhas verticais
  xOffset = margin;
  doc.line( xOffset, headerY, xOffset, dataY + rowHeight - 27 ); // Linha vertical inicial à esquerda

  columnWidth.forEach( ( width ) =>
  {
    xOffset += width; // Move a posição para a direita antes de desenhar a próxima linha vertical
    doc.line( xOffset, headerY, xOffset, dataY + rowHeight - 27 );
  } );

  // Linha final da tabela
  doc.line( margin, dataY - 17, doc.internal.pageSize.width - margin, dataY - 17 );

  // Dados a serem preenchidos nas colunas
  const data = [ '06/2024', '22', '30' ];
  doc.setFont( 'Verdana', 'normal' );
  doc.setFontSize( 10 ); // Ajuste do tamanho da fonte para os dados

  xOffset = margin;
  data.forEach( ( datum, index ) =>
  {
    const x = xOffset + columnWidth[ index ] / 2;
    doc.text( datum, x, dataY - 18, { align: 'center' } );
    xOffset += columnWidth[ index ];
  } );

  return dataY - 12;
};

const addHeaderWithColumnsTwo = ( doc: jsPDF, margin: number, linhaInicialY: number ): number =>
{
  // Definir o tamanho das colunas com base nas larguras fornecidas
  const tableColumnWidths = [ 60, 50, 50 ]; // Larguras das colunas
  const totalWidth = tableColumnWidths.reduce( ( sum, width ) => sum + width, 0 );
  const availableWidth = doc.internal.pageSize.width - 2 * margin; // Largura total disponível para a tabela

  const scale = availableWidth / totalWidth; // Ajuste a escala para caber na página
  const columnWidth = tableColumnWidths.map( width => width * scale );

  const cellHeight = 40; // Altura de cada célula
  const headerY = linhaInicialY; // Posição Y do cabeçalho
  const dataY = headerY + cellHeight; // Posição Y dos dados

  // Definir fontes e tamanhos para o cabeçalho
  doc.setFont( 'Verdana', 'bold' );
  doc.setFontSize( 12 );

  // Adicionar uma linha horizontal antes do cabeçalho
  doc.setDrawColor( 0, 0, 0 ); // Cor da linha (preto)
  doc.setLineWidth( 0.3 ); // Espessura da linha
  doc.line( margin, headerY, doc.internal.pageSize.width - margin, headerY );

  // Adicionar cabeçalhos das colunas com quebra de linha
  let xOffset = margin;
  const headers = [
    'Dados do Servidor - MASP e Nome',
    'Dias úteis trabalhados pelo servidor no período',
    'Total de pareceres gerados pelo servidor no período'
  ];

  const lineHeight = 5; // Ajuste para o espaçamento entre linhas

  headers.forEach( ( header, index ) =>
  {
    const lines = doc.splitTextToSize( header, columnWidth[ index ] );
    const x = xOffset + columnWidth[ index ] / 2;
    const y = headerY + ( cellHeight / 2 ); // Ajuste a posição vertical do texto

    lines.forEach( ( line: string, lineIndex: number ) =>
    {
      doc.text( line, x, y - 16 + ( lineIndex * lineHeight ), { align: 'center' } );
    } );

    xOffset += columnWidth[ index ];
  } );

  // Adicionar uma linha horizontal abaixo do cabeçalho
  doc.setDrawColor( 0, 0, 0 ); // Cor da linha (preto)
  doc.setLineWidth( 0.3 ); // Espessura da linha
  doc.line( margin, dataY - 29, doc.internal.pageSize.width - margin, dataY - 29 );

  // Adicionar linhas verticais
  xOffset = margin;
  doc.line( xOffset, headerY, xOffset, dataY - 20 ); // Linha vertical inicial à esquerda

  columnWidth.forEach( ( width ) =>
  {
    xOffset += width; // Move a posição para a direita antes de desenhar a próxima linha vertical
    doc.line( xOffset, headerY, xOffset, dataY - 20 );
  } );

  doc.line( margin, headerY + cellHeight - 20, doc.internal.pageSize.width - margin, headerY + cellHeight - 20 );

  // Dados a serem preenchidos nas colunas
  const data = [ '261.947 - Charles Musselwhite da Silva Cordeiro da Silva Cordeiro da Silva Cordeiro', '20', '3' ];
  doc.setFont( 'Verdana', 'normal' );
  doc.setFontSize( 10 ); // Ajuste do tamanho da fonte para os dados

  xOffset = margin;
  let heightFinal: number = 0;
  data.forEach( ( datum, index ) =>
  {
    const lines = doc.splitTextToSize( datum, columnWidth[ index ] );
    const x = xOffset + columnWidth[ index ] / 2;
    const y = dataY + ( cellHeight / 2 ) - ( ( lines.length * lineHeight ) / 2 ); // Ajuste a posição vertical do texto
    lines.forEach( ( line: string, lineIndex: number ) =>
    {
      doc.text( line, x, y - 40 + ( lineIndex * ( lineHeight - 2 ) ), { align: 'center' } );
      heightFinal = y - 40 + ( lineIndex * ( lineHeight - 2 ) );
    } );
    xOffset += columnWidth[ index ];
  } );

  return heightFinal;
};


const generatePdf = () =>
{

  const doc = new jsPDF();
  const margin = 10;
  const imageWidth = 100; // Exemplo
  const imageHeight = 50; // Exemplo
  let pageCount = 0;

  const addPageNumber = ( doc: jsPDF, pageNumber: number ) =>
  {
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    doc.setFont( 'Verdana', 'normal' );
    doc.setFontSize( 10 );
    doc.text( `Página ${ pageNumber }`, pageWidth - margin - 10, pageHeight - margin + 5, { align: 'right' } );
  };

  // Adicionar numeração final para a última página
  ++pageCount;

  let paginas: number = 1;
  let linhaInicialY: number = 0;

  const addContent = () =>
  {
    // Adicione o conteúdo das páginas aqui
    addPageNumber( doc, pageCount );

    addImageToPDF( doc, margin + 2.5, margin + 0.5, 35, 35 );
    linhaInicialY = addTextWithMargins( doc, imageWidth, imageHeight, margin );
    linhaInicialY = addHeaderWithColumns( doc, margin, linhaInicialY );
    linhaInicialY = addHeaderWithColumnsTwo( doc, margin, linhaInicialY );
    // Terceira tabela
    // Quarta Tabela
    // Quinta Tabela
  };
  addContent();
  --paginas;

  if ( paginas > 0 )
  {
    doc.addPage(); // Adicione uma nova página se necessário
    ++pageCount;
  }
  doc.save( 'pdf-gerado.pdf' );
};

export default function ReportPdf ( props: IReportPdfProps )
{
  const { data } = props;

  return (
    <div>
      <>
        {data}
      </>

      <button onClick={generatePdf}>Gerar e Baixar Relatório PSF</button>
    </div>
  );
}
