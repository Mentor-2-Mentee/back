export default class DateFormatting {
  date: Date;
  constructor(getDateValue: Date) {
    this.date = new Date(getDateValue);
  }

  get YYYY_MM_DD(): string {
    const YYYY = this.date.getFullYear().toString();
    const MM = (this.date.getMonth() + 1).toString().padStart(2, "0");
    const DD = this.date.getDate().toString().padStart(2, "0");
    return `${YYYY}-${MM}-${DD}`;
  }

  get HH_MM_SS(): string {
    const HH = this.date.getHours().toString();
    const MM = this.date.getMinutes().toString().padStart(2, "0");
    const SS = this.date.getSeconds().toString().padStart(2, "0");
    return `${HH}:${MM}:${SS}`;
  }
}
