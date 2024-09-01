import exceljs from 'exceljs';
import { UploadAttendaceDTO } from '../domain/dto/attendance.dto';

class FileUtils {
  public static readonly validateExtension = (
    filename: string,
    extensions: string[],
  ): boolean => {
    const fileNameParts = filename.split('.');
    const extension = fileNameParts[fileNameParts.length - 1];

    if (fileNameParts.length < 2 && !extension) {
      return false;
    }
    return extensions.includes(extension);
  };

  public static readonly excelBufferToJSON = (
    buffer: Buffer,
  ): Promise<UploadAttendaceDTO[]> => {
    const workbook = new exceljs.Workbook();
    return workbook.xlsx.load(buffer).then(() => {
      const worksheet = workbook.worksheets[0];
      const headers: string[] = [];
      const rows: string[] = [];

      worksheet.eachRow((row, rowNumber) => {
        if (rowNumber === 1) {
          row.eachCell((cell) => {
            headers.push(cell.value?.toString() ?? '');
          });
        } else {
          const rowObject: any = {};
          row.eachCell((cell, colNumber) => {
            rowObject[headers[colNumber - 1]] = cell.value;
          });
          rows.push(rowObject);
        }
      });
      return rows as unknown as UploadAttendaceDTO[];
    });
  };
}

export default FileUtils;
