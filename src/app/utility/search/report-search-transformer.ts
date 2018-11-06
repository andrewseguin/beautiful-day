import {Report} from 'app/ui/season/dao';

export class ReportSearchTransformer {
  static transform(report: Report): string {
    const name = `[name]:${report.name}`;

    const reportStr = name;

    return (reportStr).replace(/ /g, '').toLowerCase();
  }
}
