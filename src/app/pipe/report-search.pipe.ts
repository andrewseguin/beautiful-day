import {Pipe, PipeTransform} from "@angular/core";
import {Item} from "../model/item";
import {Report} from "../model/report";
import {ReportSearchTransformer} from "../utility/search/report-search-transformer";

// Should match the keys of a report.
export type ReportSort = 'name' | 'modifiedDate' | 'createdDate';

@Pipe({name: 'reportSearch'})
export class ReportSearchPipe implements PipeTransform {

  transform(reports: Report[], query: string, sort: ReportSort, reverseSort: boolean): Item[] {
    const tokens = query.split(' ');

    const filteredReports = reports.filter(report => {
      return tokens.every(token => this.reportMatchesSearch(report, token));
    });

    const sortedRequests = filteredReports.sort((a: Report, b: Report) => {
      return (a[sort] < b[sort]) ? -1 : 1;
    });
    return reverseSort ? sortedRequests.reverse() : sortedRequests;
  }

  reportMatchesSearch(report: Report, token: string) {
    return ReportSearchTransformer.transform(report).indexOf(token.toLowerCase()) != -1;
  }
}
