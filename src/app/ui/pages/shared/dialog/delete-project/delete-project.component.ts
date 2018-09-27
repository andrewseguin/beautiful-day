import {Component} from '@angular/core';
import {Project} from 'app/model/project';
import {MatDialogRef, MatSnackBar, MatSnackBarConfig} from '@angular/material';
import {ProjectsService} from 'app/service/projects.service';
import {RequestsService} from 'app/service/requests.service';

@Component({
  selector: 'app-delete-project',
  templateUrl: './delete-project.component.html',
  styleUrls: ['./delete-project.component.scss']
})
export class DeleteProjectComponent {
  project: Project;
  deleteCheck = '';

  constructor(private dialogRef: MatDialogRef<DeleteProjectComponent>,
              private mdSnackbar: MatSnackBar,
              private requestsService: RequestsService,
              private projectsService: ProjectsService) { }

  close() {
    this.dialogRef.close();
  }

  deleteProject() {
    if (this.deleteCheck.toLowerCase().trim() != 'delete') { return; }

    // Delete requests
    this.requestsService.getProjectRequests(this.project.$key).subscribe(requests => {
      requests.forEach(request => this.requestsService.remove(request.$key));
    });

    // Delete project
    this.projectsService.remove(this.project.$key);

    const snackbarConfig = new MatSnackBarConfig();
    snackbarConfig.duration = 2000;
    this.mdSnackbar.open(`Project ${this.project.name} deleted`, null, snackbarConfig);

    // TODO(andrewjs): Navigate to projects

    this.close();
  }
}
