import {ChangeDetectionStrategy, Component, Input, OnDestroy} from '@angular/core';
import {Subject} from 'rxjs';
import {Project} from 'app/season/dao';
import {Router} from '@angular/router';
import {ActivatedSeason} from 'app/season/services';
import {EXPANSION_ANIMATION} from 'app/utility/animations';

@Component({
  selector: 'project-summary',
  templateUrl: 'project-summary.html',
  styleUrls: ['project-summary.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: EXPANSION_ANIMATION
})
export class ProjectSummary implements OnDestroy {
  @Input() project: Project;

  expandContacts = false;
  mayExpandContacts = false;

  private destroyed = new Subject();

  constructor(private router: Router,
              private activatedSeason: ActivatedSeason) {}

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }

  navigateToProject() {
    this.router.navigate([
        `${this.activatedSeason.season.value}/project/${this.project.id}`]);
  }
}
