import jsPDF from 'jspdf';
import React from 'react';

const imagePath = '/brasao.png';

interface IReportPdfProps
{
  data: string;
}

let pageCount = 1;
let paginas: number = 1;
let linhaInicialY: number = 0;

const addPageNumber = ( doc: jsPDF, pageNumber: number, margin: number ) =>
{
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  doc.setFont( 'Verdana', 'normal' );
  doc.setFontSize( 10 );
  doc.text( `Página ${ pageNumber }`, pageWidth - margin - 10, pageHeight - margin + 5, { align: 'right' } );
};

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

const addTextWithMargins = ( doc: jsPDF, margin: number ): number =>
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
  doc.setLineWidth( 0.3 ); // Espessura da linha
  doc.line( margin, lineY - 5, doc.internal.pageSize.width - margin, lineY - 5 );

  return lineY;

};

const addHeaderWithColumns = ( doc: jsPDF, margin: number, linhaInicialY: number, dado: IDadosServidor ): number =>
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
  const data = [ dado?.periodo, dado?.diasUteis, dado.totalPareceres ];
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

const addHeaderWithColumnsTwo = ( doc: jsPDF, margin: number, linhaInicialY: number, dado: IDadosServidor ): number =>
{
  // Definir o tamanho das colunas com base nas larguras fornecidas
  const tableColumnWidths = [ 66, 47, 47 ]; // Larguras das colunas
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
  const data = [ dado?.sevidor, dado?.diasUteisTrabalhados, dado?.totalPareceresServidor ];
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
      heightFinal = y - 40 + ( lineIndex * ( lineHeight - 1 ) );
    } );
    xOffset += columnWidth[ index ];
  } );
  console.log( heightFinal );
  return heightFinal;
};

const addHeaderWithColumnsTableTree = ( doc: jsPDF, margin: number, linhaInicialY: number ): number =>
{
  // Definir larguras das colunas e suas posições
  const tableColumnWidths = [ 35, 70, 35, 50 ]; // Larguras das colunas
  const totalWidth = tableColumnWidths.reduce( ( sum, width ) => sum + width, 0 );
  const availableWidth = doc.internal.pageSize.width - 2 * margin;
  const scale = availableWidth / totalWidth; // Ajuste a escala para caber na página

  const columnWidth = tableColumnWidths.map( width => width * scale );
  const rowHeight = 10; // Altura de cada linha

  // A posição Y da tabela é ajustada pelo ponto inicial Y fornecido
  const tableY = linhaInicialY + 7;

  // Desenhar a linha superior da tabela
  const startX = margin;
  const tableEndX = startX + columnWidth.reduce( ( sum, width ) => sum + width, 0 );

  doc.setDrawColor( 0, 0, 0 ); // Cor da linha (preto)
  doc.setLineWidth( 0.3 ); // Espessura da linha

  // Linha horizontal no topo da tabela
  doc.line( startX, tableY, tableEndX, tableY );

  // Linha vertical inicial à esquerda
  let xOffset = startX;
  doc.line( xOffset, tableY, xOffset, tableY + rowHeight - 2 );

  // Adicionar colunas verticais
  columnWidth.forEach( width =>
  {
    xOffset += width;
    doc.line( xOffset, tableY, xOffset, tableY + rowHeight - 2 );
  } );

  // Linha inferior da tabela
  doc.line( startX, tableY + rowHeight - 2, tableEndX, tableY + rowHeight - 2 );

  doc.setFont( 'Verdana', 'bold' );
  doc.setFontSize( 12 );

  // Adicionar os textos das colunas com quebra de linha
  const headers = [ 'Pta', 'Autuado', 'Modelo', 'Arquivo' ];
  xOffset = startX;
  headers.forEach( ( header, index ) =>
  {
    const cellWidth = columnWidth[ index ];
    const x = xOffset + cellWidth / 2;

    // Quebra automática de linha
    const splitText = doc.splitTextToSize( header, cellWidth - 4 ); // Ajuste o valor se necessário
    const y = tableY + rowHeight / 2;

    // Adiciona o texto com quebra de linha
    splitText.forEach( ( line: string, lineIndex: number ) =>
    {
      doc.text( line, x, y + lineIndex * 6, { align: 'center' } ); // Ajuste o espaçamento entre linhas se necessário
    } );

    xOffset += columnWidth[ index ];
  } );
  console.log( tableY + rowHeight );
  // Retornar a posição Y final da última linha da tabela
  return tableY + rowHeight; // Este valor representa a posição Y abaixo da última linha desenhada
};

const addDataTableOne = (
  doc: jsPDF,
  margin: number,
  dados: IDados[],
  linhaInicialY: number,
): number =>
{
  const tableColumnWidths = [ 35, 70, 35, 50 ]; // Larguras das colunas
  const rowHeight = 10; // Altura de cada linha
  const pageHeight = doc.internal.pageSize.height; // Altura da página
  const marginBottom = 20; // Margem inferior
  const totalWidth = tableColumnWidths.reduce( ( sum, width ) => sum + width, 0 );
  const startX = margin;

  let currentY = linhaInicialY;

  // Função para desenhar as linhas da tabela
  const drawTableLines = ( y: number ) =>
  {
    let xOffset = startX;
    doc.setFontSize( 10 );
    doc.setDrawColor( 0, 0, 0 );
    doc.setLineWidth( 0.3 );
    doc.line( startX, y - 12, startX + totalWidth, y - 12 ); // Linha superior
    xOffset = startX;
    doc.line( xOffset, y - 12, xOffset, y - 12 + rowHeight ); // Linhas verticais
    tableColumnWidths.forEach( width =>
    {
      xOffset += width;
      doc.line( xOffset, y - 12, xOffset, y - 12 + rowHeight );
    } );
    doc.line( startX, y - 12 + rowHeight, startX + totalWidth, y - 12 + rowHeight ); // Linha inferior
  };

  // Função para adicionar uma nova linha da tabela
  const addTableRow = ( row: IDados ) =>
  {
    const isPageEnd = currentY + rowHeight > pageHeight - marginBottom;
    if ( isPageEnd )
    {
      doc.addPage();
      ++pageCount;
      addImageToPDF( doc, margin + 2.5, margin + 0.5, 35, 35 );
      currentY = addTextWithMargins( doc, margin ) + 10; // Adiciona o cabeçalho e ajusta a posição Y
      linhaInicialY = currentY;
      drawTableLines( currentY ); // Desenha as linhas da tabela na nova página
      addPageNumber( doc, pageCount, margin ); // Adiciona o número da página
    }

    // Desenha a linha da tabela
    drawTableLines( currentY );
    let xOffset = startX;

    doc.text( row.pta, xOffset + tableColumnWidths[ 0 ] / 2, currentY - 14 + rowHeight / 2 + 2, { align: 'center' } );
    xOffset += tableColumnWidths[ 0 ];

    const autuadoText = row.autuado;
    const autuadoLines = doc.splitTextToSize( autuadoText, tableColumnWidths[ 1 ] - 4 );
    autuadoLines.forEach( ( line: string, lineIndex: number ) =>
    {
      doc.text( line, xOffset + 2, currentY - 14 + 6 + ( lineIndex * 5 ), { align: 'left' } );
    } );
    xOffset += tableColumnWidths[ 1 ];

    doc.text( row.modelo, xOffset + tableColumnWidths[ 2 ] / 2, currentY - 14 + rowHeight / 2 + 2, { align: 'center' } );
    xOffset += tableColumnWidths[ 2 ];

    doc.text( row.arquivo, xOffset + tableColumnWidths[ 3 ] / 2, currentY - 14 + rowHeight / 2 + 2, { align: 'center' } );

    currentY += rowHeight; // Avança para a próxima linha
  };

  // Adiciona cabeçalho da tabela na primeira página
  //linhaInicialY = addTextWithMargins( doc, margin );
  currentY += rowHeight; // Avança para a linha de dados

  // Adiciona o número da página na primeira página
  addPageNumber( doc, pageCount, margin );

  // Adiciona as linhas da tabela
  dados.forEach( row =>
  {
    addTableRow( row );
  } );

  // Adiciona o número da última página se necessário
  addPageNumber( doc, pageCount, margin );

  // Retornar a posição Y final da última linha da tabela
  return currentY;
};

const addHeaderWithColumnsTableOne = (
  doc: jsPDF,
  margin: number,
  linhaInicialY: number
): number =>
{
  const tableColumnWidths = [ 200 ]; // Larguras das colunas
  const rowHeight = 10; // Altura de cada linha
  const pageHeight = doc.internal.pageSize.height; // Altura da página
  const marginBottom = 20; // Margem inferior

  // Ajusta a largura da coluna
  const totalWidth = tableColumnWidths.reduce( ( sum, width ) => sum + width, 0 );
  const availableWidth = doc.internal.pageSize.width - 2 * margin;
  const scale = availableWidth / totalWidth;
  const columnWidth = tableColumnWidths.map( width => width * scale );

  // Posição Y da tabela ajustada para iniciar em linhaInicialY
  const tableY = linhaInicialY - 5;

  // Verifica se há espaço suficiente na página para o cabeçalho e tabela
  const headerHeight = rowHeight; // Altura do cabeçalho
  const isPageEnd = tableY + headerHeight > pageHeight - marginBottom;

  if ( isPageEnd )
  {
    // Adiciona uma nova página
    doc.addPage();
    ++pageCount;
    // Adiciona o cabeçalho e ajusta a posição Y para a nova página
    addImageToPDF( doc, margin + 2.5, margin + 0.5, 35, 35 );
    linhaInicialY = addTextWithMargins( doc, margin );
  }

  // Atualiza a posição Y da tabela para a nova linha inicial
  const tableYAdjusted = linhaInicialY - 5;

  // Desenhar a linha superior da tabela
  const startX = margin;
  const tableEndX = startX + columnWidth.reduce( ( sum, width ) => sum + width, 0 );

  doc.setDrawColor( 0, 0, 0 ); // Cor da linha (preto)
  doc.setLineWidth( 0.3 ); // Espessura da linha

  // Linha superior da tabela
  doc.line( startX, tableYAdjusted, tableEndX, tableYAdjusted );

  // Linhas verticais
  let xOffset = startX;
  // Linha vertical inicial à esquerda
  doc.line( xOffset, tableYAdjusted, xOffset, tableYAdjusted + rowHeight - 2 );
  columnWidth.forEach( width =>
  {
    xOffset += width;
    doc.line( xOffset, tableYAdjusted, xOffset, tableYAdjusted + rowHeight - 2 );
  } );

  // Linha inferior da tabela
  doc.line( startX, tableYAdjusted + rowHeight - 2, tableEndX, tableYAdjusted + rowHeight - 2 );

  // Adicionar o texto centralizado
  const text = 'Ausências no Período';
  doc.setFont( 'Verdana', 'bold' );
  doc.setFontSize( 14 );
  const centerX = startX + ( totalWidth * scale ) / 2; // Posição X centralizada
  const centerY = tableYAdjusted + rowHeight / 2; // Posição Y centralizada (ajustada um pouco para alinhamento vertical)

  doc.text( text, centerX, centerY, { align: 'center' } );

  // Retornar a posição Y final da tabela
  return tableYAdjusted + rowHeight;
};


const addHeaderWithColumnsTableFour = ( doc: jsPDF, margin: number, linhaInicialY: number ): number =>
{
  const tableColumnWidths = [ 60, 60, 60 ]; // Larguras das colunas
  const totalWidth = tableColumnWidths.reduce( ( sum, width ) => sum + width, 0 );
  const availableWidth = doc.internal.pageSize.width - 2 * margin;
  const scale = availableWidth / totalWidth; // Ajuste a escala para caber na página

  const columnWidth = tableColumnWidths.map( width => width * scale );
  const rowHeight = 10; // Altura de cada linha

  // A posição Y da tabela é ajustada pelo ponto inicial Y fornecido
  const tableY = linhaInicialY;

  // Verifica se a tabela cabe na página
  const pageHeight = doc.internal.pageSize.height;
  const spaceAvailable = pageHeight - tableY;
  const tableHeight = rowHeight; // Considerando apenas a altura da linha de cabeçalho aqui

  if ( spaceAvailable < tableHeight )
  {
    // Se não há espaço suficiente, adicionar uma nova página
    doc.addPage();
    ++pageCount;
    // Ajustar a posição Y para a nova página
    linhaInicialY = doc.internal.pageSize.height - margin - tableHeight;
  }

  // Redefine a posição Y da tabela após adicionar uma nova página, se necessário
  const adjustedTableY = linhaInicialY - 2;

  // Desenhar a linha superior da tabela
  const startX = margin;
  const tableEndX = startX + columnWidth.reduce( ( sum, width ) => sum + width, 0 );

  doc.setDrawColor( 0, 0, 0 ); // Cor da linha (preto)
  doc.setLineWidth( 0.3 ); // Espessura da linha

  // Linha horizontal no topo da tabela
  //doc.line(startX, adjustedTableY, tableEndX, adjustedTableY);

  // Linha vertical inicial à esquerda
  let xOffset = startX;
  doc.line( xOffset, adjustedTableY, xOffset, adjustedTableY + rowHeight - 2 );

  // Adicionar colunas verticais
  columnWidth.forEach( width =>
  {
    xOffset += width;
    doc.line( xOffset, adjustedTableY, xOffset, adjustedTableY + rowHeight - 2 );
  } );

  // Linha inferior da tabela
  doc.line( startX, adjustedTableY + rowHeight - 2, tableEndX, adjustedTableY + rowHeight - 2 );

  doc.setFont( 'Verdana', 'bold' );
  doc.setFontSize( 12 );

  // Adicionar os textos das colunas com quebra de linha
  const headers = [ 'Data Início', 'Data Fim', 'Motivo' ];
  xOffset = startX;
  headers.forEach( ( header, index ) =>
  {
    const cellWidth = columnWidth[ index ];
    const x = xOffset + cellWidth / 2;

    // Quebra automática de linha
    const splitText = doc.splitTextToSize( header, cellWidth - 4 ); // Ajuste o valor se necessário
    const y = adjustedTableY + rowHeight / 2;

    // Adiciona o texto com quebra de linha
    splitText.forEach( ( line: string, lineIndex: number ) =>
    {
      doc.text( line, x, y + lineIndex * 6, { align: 'center' } ); // Ajuste o espaçamento entre linhas se necessário
    } );

    xOffset += columnWidth[ index ];
  } );

  console.log( adjustedTableY + rowHeight );

  // Retornar a posição Y final da última linha da tabela
  return adjustedTableY + rowHeight; // Este valor representa a posição Y abaixo da última linha desenhada
};



const addDataTableTwo = ( doc: jsPDF, margin: number, dados: IAusencias[], linhaInicialY: number ): number =>
{
  const tableColumnWidths = [ 63.3, 63.3, 63.3 ]; // Larguras das colunas
  const rowHeight = 8; // Altura de cada linha
  const pageHeight = doc.internal.pageSize.height; // Altura total da página
  const marginBottom = 20; // Margem inferior
  const headerHeight = 10; // Altura do cabeçalho da tabela

  // Calcula a largura total da tabela e a posição inicial X
  const totalWidth = tableColumnWidths.reduce( ( sum, width ) => sum + width, 0 );
  const startX = margin;

  // Função para desenhar as linhas da tabela
  const drawTableLines = ( y: number ) =>
  {
    let xOffset = startX;
    doc.setFontSize( 10 );
    doc.setDrawColor( 0, 0, 0 );
    doc.setLineWidth( 0.3 );

    // Linha superior da tabela
    doc.line( startX, y, startX + totalWidth, y );

    // Linhas verticais
    xOffset = startX;
    doc.line( xOffset, y, xOffset, y + rowHeight );
    tableColumnWidths.forEach( width =>
    {
      xOffset += width;
      doc.line( xOffset, y, xOffset, y + rowHeight );
    } );

    // Linha inferior da tabela
    doc.line( startX, y + rowHeight, startX + totalWidth, y + rowHeight );
  };


  // Função para adicionar uma nova linha da tabela
  const addTableRow = ( row: IAusencias ) =>
  {
    const isPageEnd = currentY + rowHeight > pageHeight - marginBottom;
    if ( isPageEnd )
    {
      doc.addPage();
      ++pageCount;
      addImageToPDF( doc, margin + 2.5, margin + 0.5, 35, 35 );
      currentY = addTextWithMargins( doc, margin ); // Adiciona o cabeçalho e ajusta a posição Y
      linhaInicialY = currentY;
      drawTableLines( currentY ); // Desenha as linhas da tabela na nova página
      addPageNumber( doc, pageCount, margin ); // Adiciona o número da página
    }

    // Desenha as linhas da tabela
    drawTableLines( currentY );

    // Define o texto e seu alinhamento nas células
    let xOffset = startX;

    doc.text( row.dtInicio, xOffset + tableColumnWidths[ 0 ] / 2, currentY + rowHeight / 2, { align: 'center' } );
    xOffset += tableColumnWidths[ 0 ];

    doc.text( row.dtFim, xOffset + tableColumnWidths[ 1 ] / 2, currentY + rowHeight / 2, { align: 'center' } );
    xOffset += tableColumnWidths[ 1 ];

    doc.text( row.motivo, xOffset + tableColumnWidths[ 2 ] / 2, currentY + rowHeight / 2, { align: 'center' } );

    currentY += rowHeight; // Avança para a próxima linha
  };

  let currentY = linhaInicialY - 12;

  // Adiciona cabeçalho da tabela na primeira página
  //drawTableHeader( currentY );
  currentY += headerHeight; // Avança para a linha de dados

  // Adiciona o número da página na primeira página
  addPageNumber( doc, pageCount, margin );

  // Adiciona as linhas da tabela
  dados.forEach( row =>
  {
    addTableRow( row );
  } );

  // Adiciona o número da última página se necessário
  addPageNumber( doc, pageCount, margin );

  // Retornar a posição Y final da última linha da tabela
  return currentY;
};




const addHeaderWithColumnsTableTwo = ( doc: jsPDF, margin: number, linhaInicialY: number ): number =>
{
  const tableColumnWidths = [ 200 ]; // Larguras das colunas
  const totalWidth = tableColumnWidths.reduce( ( sum, width ) => sum + width, 0 );
  const availableWidth = doc.internal.pageSize.width - 2 * margin;
  const scale = availableWidth / totalWidth; // Ajuste a escala para caber na página

  const columnWidth = tableColumnWidths.map( width => width * scale );
  const rowHeight = 10; // Altura de cada linha

  // Posição Y da tabela ajustada para iniciar em linhaInicialY
  const tableY = linhaInicialY + 5;

  // Desenhar a linha superior da tabela
  const startX = margin;
  const tableEndX = startX + columnWidth.reduce( ( sum, width ) => sum + width, 0 );

  doc.setDrawColor( 0, 0, 0 ); // Cor da linha (preto)
  doc.setLineWidth( 0.3 ); // Espessura da linha

  // Linha superior da tabela
  doc.line( startX, tableY, tableEndX, tableY );

  // Linhas verticais
  let xOffset = startX;
  // Linha vertical inicial à esquerda
  doc.line( xOffset, tableY, xOffset, tableY + rowHeight - 2 );
  columnWidth.forEach( width =>
  {
    xOffset += width;
    doc.line( xOffset, tableY, xOffset, tableY + rowHeight - 2 );
  } );

  // Linha inferior da tabela
  doc.line( startX, tableY + rowHeight - 2, tableEndX, tableY + rowHeight - 2 );

  // Adicionar o texto centralizado
  const text = 'Informações Complementares';
  doc.setFont( 'Verdana', 'bold' );
  doc.setFontSize( 14 );
  const centerX = startX + ( totalWidth * scale ) / 2; // Posição X centralizada
  const centerY = tableY + rowHeight / 2; // Posição Y centralizada (ajustada um pouco para alinhamento vertical)

  doc.text( text, centerX, centerY, { align: 'center' } ); // Adicionar texto centralizado

  // Retornar a posição Y final da tabela
  return tableY + rowHeight;
};

const addHeaderWithColumnsTableFive = ( doc: jsPDF, margin: number, linhaInicialY: number ): number =>
{
  // Definir larguras das colunas e suas posições
  const tableColumnWidths = [ 60, 50, 50 ]; // Larguras das colunas
  const totalWidth = tableColumnWidths.reduce( ( sum, width ) => sum + width, 0 );
  const availableWidth = doc.internal.pageSize.width - 2 * margin;
  const scale = availableWidth / totalWidth; // Ajuste a escala para caber na página

  const columnWidth = tableColumnWidths.map( width => width * scale );
  const rowHeight = 10; // Altura de cada linha

  // A posição Y da tabela é ajustada pelo ponto inicial Y fornecido
  const tableY = linhaInicialY - 2;

  // Desenhar a linha superior da tabela
  const startX = margin;
  const tableEndX = startX + columnWidth.reduce( ( sum, width ) => sum + width, 0 );

  doc.setDrawColor( 0, 0, 0 ); // Cor da linha (preto)
  doc.setLineWidth( 0.3 ); // Espessura da linha

  // Linha horizontal no topo da tabela
  //doc.line( startX, tableY, tableEndX, tableY );

  // Linha vertical inicial à esquerda
  let xOffset = startX;
  doc.line( xOffset, tableY, xOffset, tableY + rowHeight - 2 );

  // Adicionar colunas verticais
  columnWidth.forEach( width =>
  {
    xOffset += width;
    doc.line( xOffset, tableY, xOffset, tableY + rowHeight - 2 );
  } );

  // Linha inferior da tabela
  doc.line( startX, tableY + rowHeight - 2, tableEndX, tableY + rowHeight - 2 );

  doc.setFont( 'Verdana', 'bold' );
  doc.setFontSize( 12 );

  // Adicionar os textos das colunas com quebra de linha
  const headers = [ 'Informações', 'Cadastrada por', 'Alterada por' ];
  xOffset = startX;
  headers.forEach( ( header, index ) =>
  {
    const cellWidth = columnWidth[ index ];
    const x = xOffset + cellWidth / 2;

    // Quebra automática de linha
    const splitText = doc.splitTextToSize( header, cellWidth - 4 ); // Ajuste o valor se necessário
    const y = tableY + rowHeight / 2;

    // Adiciona o texto com quebra de linha
    splitText.forEach( ( line: string, lineIndex: number ) =>
    {
      doc.text( line, x, y + lineIndex * 6, { align: 'center' } ); // Ajuste o espaçamento entre linhas se necessário
    } );

    xOffset += columnWidth[ index ];
  } );
  console.log( tableY + rowHeight );
  // Retornar a posição Y final da última linha da tabela
  return tableY + rowHeight; // Este valor representa a posição Y abaixo da última linha desenhada
};

const addDataTableTree = (
  doc: jsPDF,
  margin: number,
  dados: IInformacoes[],
  linhaInicialY: number
): number =>
{
  const tableColumnWidths = [ 71.3, 59.3, 59.3 ]; // Larguras das colunas
  const cellPadding = 2; // Espaço interno das células
  const fontSize = 10; // Tamanho da fonte
  const pageHeight = doc.internal.pageSize.height; // Altura total da página
  const marginBottom = 20; // Margem inferior
  const headerHeight = 10; // Altura do cabeçalho da tabela

  // Calcula a largura total da tabela e a posição inicial X
  const totalWidth = tableColumnWidths.reduce( ( sum, width ) => sum + width, 0 );
  const startX = margin;

  // Função para desenhar as linhas da tabela
  const drawTableLines = ( y: number, rowHeight: number ) =>
  {
    const adjustedRowHeight = rowHeight; // Ajusta a altura da linha
    let xOffset = startX;
    doc.setFontSize( fontSize );
    doc.setDrawColor( 0, 0, 0 );
    doc.setLineWidth( 0.3 );

    // Linha superior da tabela
    doc.line( startX, y, startX + totalWidth, y );

    // Linhas verticais
    xOffset = startX;
    doc.line( xOffset, y, xOffset, y + adjustedRowHeight - 10 );
    tableColumnWidths.forEach( width =>
    {
      xOffset += width;
      doc.line( xOffset, y, xOffset, y + adjustedRowHeight - 10 );
    } );

    // Linha inferior da tabela
    doc.line( startX, y - 10 + adjustedRowHeight, startX + totalWidth, y - 10 + adjustedRowHeight );
  };

  // Função para calcular a altura necessária para uma célula com base no texto
  const getCellHeight = ( text: string, width: number ) =>
  {
    const splitText = doc.splitTextToSize( text, width - cellPadding * 2 );
    return splitText.length * fontSize; // Altura da linha (tamanho da fonte)
  };

  // Adiciona uma nova página e ajusta a posição Y
  const addNewPage = () =>
  {
    doc.addPage();
    ++pageCount;
    addImageToPDF( doc, margin + 2.5, margin + 0.5, 35, 35 );
    currentY = addTextWithMargins( doc, margin ); // Adiciona o cabeçalho e ajusta a posição Y
    linhaInicialY = currentY;
    //drawTableLines( currentY, 2 ); // Desenha as linhas da tabela na nova página
    addPageNumber( doc, pageCount, margin ); // Adiciona o número da página

  };

  let currentY = linhaInicialY - 10;
  currentY += headerHeight; // Avança para a linha de dados

  // Adiciona o número da página na primeira página
  addPageNumber( doc, pageCount, margin );

  // Adiciona as linhas da tabela
  dados.forEach( row =>
  {
    const cellHeights = [
      getCellHeight( row.informacao, tableColumnWidths[ 0 ] ),
      getCellHeight( row.cadastradaPor, tableColumnWidths[ 1 ] ),
      getCellHeight( row.alteradaPor, tableColumnWidths[ 2 ] ),
    ];

    const maxRowHeight = Math.max( ...cellHeights );

    // Verifica se há espaço suficiente para a próxima linha
    const isPageEnd = currentY + maxRowHeight > pageHeight - marginBottom;
    if ( isPageEnd )
    {
      addNewPage();
      addPageNumber( doc, pageCount, margin ); // Adiciona o número da página
    }

    // Desenha as linhas da tabela
    drawTableLines( currentY - 2, maxRowHeight );

    // Define o texto e seu alinhamento nas células
    let xOffset = startX;

    // Informacao
    const informacaoLines = doc.splitTextToSize( row.informacao, tableColumnWidths[ 0 ] - 4 );
    informacaoLines.forEach( ( line: string, lineIndex: number ) =>
    {
      doc.text( line, xOffset + 2, currentY + 2 + ( lineIndex * 5 ), { align: 'left' } );
    } );
    xOffset += tableColumnWidths[ 0 ];

    // Cadastrada Por
    const cadastradaPorLines = doc.splitTextToSize( row.cadastradaPor, tableColumnWidths[ 1 ] - 4 );
    cadastradaPorLines.forEach( ( line: string, lineIndex: number ) =>
    {
      doc.text( line, xOffset + 2, currentY + 2 + ( lineIndex * 5 ), { align: 'left' } );
    } );
    xOffset += tableColumnWidths[ 1 ];

    // Alterada Por
    const alteradaPorLines = doc.splitTextToSize( row.alteradaPor, tableColumnWidths[ 2 ] - 4 );
    alteradaPorLines.forEach( ( line: string, lineIndex: number ) =>
    {
      doc.text( line, xOffset + 2, currentY + 2 + ( lineIndex * 5 ), { align: 'left' } );
    } );

    // Avança para a próxima linha
    currentY += maxRowHeight - 10;
  } );

  // Adiciona o número da última página se necessário
  addPageNumber( doc, pageCount, margin );

  // Retornar a posição Y final da última linha da tabela
  return currentY;
};







interface IDados
{
  pta: string;
  autuado: string;
  modelo: string;
  arquivo: string;
}

interface IAusencias
{
  dtInicio: string;
  dtFim: string;
  motivo: string;
}

interface IInformacoes
{
  informacao: string;
  cadastradaPor: string;
  alteradaPor: string;
}

interface IDadosServidor
{
  periodo: string;
  diasUteis: string;
  totalPareceres: string;
  sevidor: string;
  diasUteisTrabalhados: string;
  totalPareceresServidor: string;
  dadosPta: IDados[];
  ausenciasDados: IAusencias[],
  informacoesAudiencia: IInformacoes[];
}

const generatePdf = () =>
{

  const dados: IDadosServidor[] = [
    {
      periodo: '06/2024',
      diasUteis: '22',
      totalPareceres: '30',
      sevidor: '261.947 - Charles Musselwhite da Silva Cordeiro da Silva Cordeiro da Silva Cordeiro',
      diasUteisTrabalhados: '20',
      totalPareceresServidor: '3',
      dadosPta: [
        {
          pta: '01.003005577-51',
          autuado: 'DISTRIBUIDORA DE RACAO SAO FRANCISCO LTDA',
          modelo: 'Calculo',
          arquivo: 'CA0100300557751.xls'
        },
        {
          pta: '01.003005577-51',
          autuado: 'DISTRIBUIDORA DE RACAO SAO FRANCISCO LTDA',
          modelo: 'Calculo',
          arquivo: 'CA0100300557751.xls'
        },
        {
          pta: '01.003005577-51',
          autuado: 'DISTRIBUIDORA DE RACAO SAO FRANCISCO LTDA',
          modelo: 'Calculo',
          arquivo: 'CA0100300557751.xls'
        },
        {
          pta: '01.003005577-51',
          autuado: 'DISTRIBUIDORA DE RACAO SAO FRANCISCO LTDA',
          modelo: 'Calculo',
          arquivo: 'CA0100300557751.xls'
        },
        {
          pta: '01.003005577-51',
          autuado: 'DISTRIBUIDORA DE RACAO SAO FRANCISCO LTDA',
          modelo: 'Calculo',
          arquivo: 'CA0100300557751.xls'
        },
        {
          pta: '01.003005577-51',
          autuado: 'DISTRIBUIDORA DE RACAO SAO FRANCISCO LTDA',
          modelo: 'Calculo',
          arquivo: 'CA0100300557751.xls'
        },
      ],
      ausenciasDados: [
        {
          dtInicio: '01/01/2000',
          dtFim: '01/01/2001',
          motivo: 'Calculo',
        },
        {
          dtInicio: '01/01/2000',
          dtFim: '01/01/2001',
          motivo: 'Calculo Calculo ',
        },
        {
          dtInicio: '01/01/2000',
          dtFim: '01/01/2001',
          motivo: 'Calculo Calculo Calculo',
        },
      ],
      informacoesAudiencia: [
        {
          informacao: 'Reunião conselheiros novatos - dia 07 de dezembro de 2000 - manhã',
          cadastradaPor: 'José almerano da Silva e Silva de Oliveira',
          alteradaPor: 'José almerano da Silva e Silva de Oliveira'
        },
        {
          informacao: 'Reunião conselheiros novatos - dia 07 de dezembro de 2000 - manhã',
          cadastradaPor: 'José almerano da Silva e Silva de Oliveira',
          alteradaPor: 'José almerano da Silva e Silva de Oliveira'
        },
        {
          informacao: 'Reunião conselheiros novatos - dia 07 de dezembro de 2000 - manhã',
          cadastradaPor: 'José almerano da Silva e Silva de Oliveira',
          alteradaPor: 'José almerano da Silva e Silva de Oliveira',
        },
        {
          informacao: 'Reunião conselheiros novatos - dia 07 de dezembro de 2000 - manhã',
          cadastradaPor: 'José almerano da Silva e Silva de Oliveira',
          alteradaPor: 'José almerano da Silva e Silva de Oliveira'
        },
        {
          informacao: 'Reunião conselheiros novatos - dia 07 de dezembro de 2000 - manhã',
          cadastradaPor: 'José almerano da Silva e Silva de Oliveira',
          alteradaPor: 'José almerano da Silva e Silva de Oliveira'
        },
        {
          informacao: 'Reunião conselheiros novatos - dia 07 de dezembro de 2000 - manhã',
          cadastradaPor: 'José almerano da Silva e Silva de Oliveira',
          alteradaPor: 'José almerano da Silva e Silva de Oliveira',
        },
      ]
    },
    {
      periodo: '07/2024',
      diasUteis: '22',
      totalPareceres: '30',
      sevidor: '261.947 - Charles Musselwhite da Silva Cordeiro da Silva Cordeiro da Silva Cordeiro',
      diasUteisTrabalhados: '20',
      totalPareceresServidor: '3',
      dadosPta: [
        {
          pta: '01.003005577-51',
          autuado: 'DISTRIBUIDORA DE RACAO SAO FRANCISCO LTDA',
          modelo: 'Calculo',
          arquivo: 'CA0100300557751.xls'
        },
        {
          pta: '01.003005577-51',
          autuado: 'DISTRIBUIDORA DE RACAO SAO FRANCISCO LTDA',
          modelo: 'Calculo',
          arquivo: 'CA0100300557751.xls'
        },
        {
          pta: '01.003005577-51',
          autuado: 'DISTRIBUIDORA DE RACAO SAO FRANCISCO LTDA',
          modelo: 'Calculo',
          arquivo: 'CA0100300557751.xls'
        },
      ],
      ausenciasDados: [
        {
          dtInicio: '01/01/2000',
          dtFim: '01/01/2001',
          motivo: 'Calculo',
        },
        {
          dtInicio: '01/01/2000',
          dtFim: '01/01/2001',
          motivo: 'Calculo Calculo ',
        },
        {
          dtInicio: '01/01/2000',
          dtFim: '01/01/2001',
          motivo: 'Calculo Calculo Calculo',
        },
        {
          dtInicio: '01/01/2000',
          dtFim: '01/01/2001',
          motivo: 'Calculo',
        },
      ],
      informacoesAudiencia: [
        {
          informacao: 'Reunião conselheiros novatos - dia 07 de dezembro de 2000 - manhã',
          cadastradaPor: 'José almerano da Silva e Silva de Oliveira',
          alteradaPor: 'José almerano da Silva e Silva de Oliveira'
        },
        {
          informacao: 'Reunião conselheiros novatos - dia 07 de dezembro de 2000 - manhã',
          cadastradaPor: 'José almerano da Silva e Silva de Oliveira',
          alteradaPor: 'José almerano da Silva e Silva de Oliveira'
        },
        {
          informacao: 'Reunião conselheiros novatos - dia 07 de dezembro de 2000 - manhã',
          cadastradaPor: 'José almerano da Silva e Silva de Oliveira',
          alteradaPor: 'José almerano da Silva e Silva de Oliveira',
        },
        {
          informacao: 'Reunião conselheiros novatos - dia 07 de dezembro de 2000 - manhã',
          cadastradaPor: 'José almerano da Silva e Silva de Oliveira',
          alteradaPor: 'José almerano da Silva e Silva de Oliveira'
        },
      ]
    },
    {
      periodo: '08/2024',
      diasUteis: '22',
      totalPareceres: '30',
      sevidor: '261.947 - Charles Musselwhite da Silva Cordeiro da Silva Cordeiro da Silva Cordeiro',
      diasUteisTrabalhados: '20',
      totalPareceresServidor: '3',
      dadosPta: [
        {
          pta: '01.003005577-51',
          autuado: 'DISTRIBUIDORA DE RACAO SAO FRANCISCO LTDA',
          modelo: 'Calculo',
          arquivo: 'CA0100300557751.xls'
        },
        {
          pta: '01.003005577-51',
          autuado: 'DISTRIBUIDORA DE RACAO SAO FRANCISCO LTDA',
          modelo: 'Calculo',
          arquivo: 'CA0100300557751.xls'
        },
      ],
      ausenciasDados: [
        {
          dtInicio: '01/01/2000',
          dtFim: '01/01/2001',
          motivo: 'Calculo',
        },
        {
          dtInicio: '01/01/2000',
          dtFim: '01/01/2001',
          motivo: 'Calculo Calculo ',
        },
      ],
      informacoesAudiencia: [
        {
          informacao: 'Reunião conselheiros novatos - dia 07 de dezembro de 2000 - manhã',
          cadastradaPor: 'José almerano da Silva e Silva de Oliveira',
          alteradaPor: 'José almerano da Silva e Silva de Oliveira'
        },
        {
          informacao: 'Reunião conselheiros novatos - dia 07 de dezembro de 2000 - manhã',
          cadastradaPor: 'José almerano da Silva e Silva de Oliveira',
          alteradaPor: 'José almerano da Silva e Silva de Oliveira'
        },
      ]
    }

  ];

  const doc = new jsPDF();
  const margin = 10;

  paginas = dados.length;

  dados.map( ( dado ) =>
  {
    const addContent = () =>
    {
      // Adicione o conteúdo das páginas aqui
      addPageNumber( doc, pageCount, margin );

      addImageToPDF( doc, margin + 2.5, margin + 0.5, 35, 35 );
      linhaInicialY = addTextWithMargins( doc, margin );
      linhaInicialY = addHeaderWithColumns( doc, margin, linhaInicialY, dado );
      linhaInicialY = addHeaderWithColumnsTwo( doc, margin, linhaInicialY, dado );
      linhaInicialY = addHeaderWithColumnsTableTree( doc, margin, linhaInicialY );
      linhaInicialY = addDataTableOne( doc, margin, dado.dadosPta, linhaInicialY );
      linhaInicialY = addHeaderWithColumnsTableOne( doc, margin, linhaInicialY );
      linhaInicialY = addHeaderWithColumnsTableFour( doc, margin, linhaInicialY );
      linhaInicialY = addDataTableTwo( doc, margin, dado.ausenciasDados, linhaInicialY );
      linhaInicialY = addHeaderWithColumnsTableTwo( doc, margin, linhaInicialY );
      linhaInicialY = addHeaderWithColumnsTableFive( doc, margin, linhaInicialY );
      linhaInicialY = addDataTableTree( doc, margin, dado.informacoesAudiencia, linhaInicialY );
    };
    addContent();
    --paginas;

    if ( paginas > 0 )
    {
      doc.addPage(); // Adicione uma nova página se necessário
      // Adicionar numeração final para a última página
      ++pageCount;
    }
  }
  );
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
