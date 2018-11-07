import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Project, ProjectsDao} from 'app/season/dao';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';

@Component({
  templateUrl: 'project-page.html',
  styleUrls: ['project-page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectPage implements OnInit {
  project: Project;
  isLoading = true;

  private destroyed = new Subject();

  constructor(
    private activatedRoute: ActivatedRoute,
    private cd: ChangeDetectorRef,
    private projectsDao: ProjectsDao) {}

  ngOnInit() {
    const projectId = this.activatedRoute.snapshot.params.id;
    this.projectsDao.get(projectId).pipe(takeUntil(this.destroyed))
        .subscribe(project => {
          this.isLoading = false;
          this.project = project;
          this.cd.markForCheck();
        });
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }
}
