
import { ExportFormat } from "../types";

export async function exportData(data: any[], format: ExportFormat, filename: string) {
  if (data.length === 0) return;

  if (format === 'CSV') {
    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(h => {
        const val = row[h] === null || row[h] === undefined ? "" : String(row[h]);
        return `"${val.replace(/"/g, '""')}"`;
      }).join(','))
    ].join('\n');

    const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${filename}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } else {
    // Improved SpreadsheetML format for Excel
    const headers = Object.keys(data[0]);
    
    let xml = `<?xml version="1.0" encoding="utf-8"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:html="http://www.w3.org/TR/REC-html40">
 <Styles>
  <Style ss:ID="Default" ss:Name="Normal">
   <Alignment ss:Vertical="Bottom"/>
   <Borders/>
   <Font ss:FontName="Calibri" x:Family="Swiss" ss:Size="11" ss:Color="#000000"/>
  </Style>
  <Style ss:ID="s62">
   <Alignment ss:Horizontal="Right" ss:Vertical="Center" ss:ReadingOrder="RightToLeft"/>
   <Font ss:FontName="Amiri" ss:Size="14"/>
  </Style>
  <Style ss:ID="header">
   <Font ss:FontName="Calibri" ss:Bold="1" ss:Size="11"/>
   <Interior ss:Color="#EAEAEA" ss:Pattern="Solid"/>
  </Style>
 </Styles>
 <Worksheet ss:Name="Quran_Export">
  <Table>
   <Column ss:AutoFitWidth="0" ss:Width="50"/>
   <Column ss:AutoFitWidth="0" ss:Width="50"/>
   <Column ss:AutoFitWidth="0" ss:Width="300"/>
   <Column ss:AutoFitWidth="0" ss:Width="200"/>
   <Column ss:AutoFitWidth="0" ss:Width="300"/>
   <Row ss:StyleID="header">`;
    
    headers.forEach(h => {
      xml += `<Cell><Data ss:Type="String">${h}</Data></Cell>`;
    });
    xml += `</Row>`;

    data.forEach(row => {
      xml += `<Row>`;
      headers.forEach(h => {
        const isArabic = h === 'arabic_uthmani';
        const val = row[h] === null || row[h] === undefined ? "" : String(row[h])
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&apos;');
        xml += `<Cell${isArabic ? ' ss:StyleID="s62"' : ''}><Data ss:Type="String">${val}</Data></Cell>`;
      });
      xml += `</Row>`;
    });

    xml += `  </Table>
 </Worksheet>
</Workbook>`;

    const blob = new Blob([xml], { type: "application/vnd.ms-excel" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    // .xls extension with SpreadsheetML is the most compatible way to trigger Excel correctly
    link.download = `${filename}.xls`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}
