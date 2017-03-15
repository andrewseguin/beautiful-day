import {Report} from "../../model/report";

export class ReportSearchTransformer {
  static transform(report: Report): string {
    const name = `[name]:${report.name}`;

    const reportStr = name;

    return (reportStr).replace(/ /g, '').toLowerCase();
  }
}
