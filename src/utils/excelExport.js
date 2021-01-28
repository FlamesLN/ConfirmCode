export function Workbook() {
    if (!(this instanceof Workbook)) return new Workbook();
   this.SheetNames = [];
    this.Sheets = {};
}