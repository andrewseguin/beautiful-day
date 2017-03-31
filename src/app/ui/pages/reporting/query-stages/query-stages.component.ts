import {Component, Input, EventEmitter, Output} from "@angular/core";
import {QueryStage} from "../../../../model/report";
import {Subject} from "rxjs";

@Component({
  selector: 'query-stages',
  templateUrl: 'query-stages.component.html',
  styleUrls: ['query-stages.component.scss']
})
export class QueryStagesComponent {
  inputChange = new Subject<void>();

  @Input() queryStages: QueryStage[];

  @Output() queryStagesChange: EventEmitter<QueryStage[]> = new EventEmitter();

  constructor() {
    this.inputChange.asObservable().debounceTime(250).subscribe(() => {
      this.queryStagesChange.emit(this.queryStages);
    });
  }

  removeQuery(queryStageIndex: number, querySet: string[], queryIndex: number) {
    // If the query set has more than one query, just remove this one query.
    if (querySet.length > 1) {
      querySet.splice(queryIndex, 1);
    } else {
      // This is the last query of the stage. If there is only one stage, then return. Otherwise,
      // remove the stage.
      if (this.queryStages.length != 1) {
        // Remove the query stage since the last query is being removed.
        this.queryStages.splice(queryStageIndex, 1);
      }
    }

    this.inputChange.next();
  }

  trackByIndex(i: number) { return i; }
}
