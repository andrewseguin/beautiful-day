import {Component} from '@angular/core';
import {Project} from 'app/model/project';
import {MatDialogRef, MatSnackBar, MatSnackBarConfig} from '@angular/material';
import {ProjectsDao, RequestsDao} from 'app/ui/season/dao';
import {take} from 'rxjs/operators';

@Component({
  templateUrl: 'delete-project.html',
  styleUrls: ['delete-project.scss']
})
export class DeleteProject {
  project: Project;
  deleteCheck = '';

  constructor(private dialogRef: MatDialogRef<DeleteProject>,
              private mdSnackbar: MatSnackBar,
              private requestsDao: RequestsDao,
              private projectsDao: ProjectsDao) { }

  close() {
    this.dialogRef.close();
  }

  deleteProject() {
    if (this.deleteCheck.toLowerCase().trim() != 'delete') { return; }

    // Delete requests
    this.requestsDao.getByProject(this.project.id).pipe(take(1)).subscribe(requests => {
      requests.forEach(request => this.requestsDao.remove(request.id));
    });

    // Delete project
    this.projectsDao.remove(this.project.id);

    const snackbarConfig = new MatSnackBarConfig();
    snackbarConfig.duration = 2000;
    this.mdSnackbar.open(`Project ${this.project.name} deleted`, null, snackbarConfig);

    // TODO(andrewjs): Navigate to projects

    this.close();
  }
}
