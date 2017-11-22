import {Component} from '@angular/core';
import {Project} from '../../../../model/project';
import {MatDialogRef, MatSnackBar, MatSnackBarConfig} from '@angular/material';
import {ProjectsService} from '../../../../service/projects.service';
import {RequestsService} from '../../../../service/requests.service';
import {NotesService} from '../../../../service/notes.service';
import {Router} from '@angular/router';

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
              private notesService: NotesService,
              private projectsService: ProjectsService) { }

  close() {
    this.dialogRef.close();
  }

  deleteProject() {
    if (this.deleteCheck.toLowerCase().trim() != 'delete') { return; }

    // Delete requests
    this.requestsService.getProjectRequests(this.project.$key).subscribe(requests => {
      requests.forEach(request => this.requestsService.removeRequest(request.$key));
    });

    // Delete notes
    this.notesService.getProjectNotes(this.project.$key).subscribe(notes => {
      notes.forEach(note => this.notesService.remove(note.$key));
    });

    // Delete project
    this.projectsService.remove(this.project.$key);

    const snackbarConfig = new MatSnackBarConfig();
    snackbarConfig.duration = 2000;
    this.mdSnackbar.open(`Project ${this.project.name} deleted`, null, snackbarConfig);

    // TODO(andrewjs): Navigate to home

    this.close();
  }
}
