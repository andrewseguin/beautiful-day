import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {Project, ProjectsDao, RequestsDao} from 'app/season/dao';
import {debounceTime, take} from 'rxjs/operators';
import {MatChipInputEvent, MatDialog, MatSnackBar} from '@angular/material';
import {of} from 'rxjs';
import {DeleteConfirmation} from 'app/season/shared/dialog/delete-confirmation/delete-confirmation';

@Component({
  selector: 'editable-project',
  styleUrls: ['editable-project.scss'],
  templateUrl: 'editable-project.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditableProject {
  lists: {id: string, label: string, values: string[]}[];

  @Input() project: Project;

  projectForm: FormGroup;

  constructor(private projectsDao: ProjectsDao,
              private requestsDao: RequestsDao,
              private snackbar: MatSnackBar,
              private dialog: MatDialog) {}

  ngOnInit() {
    this.projectForm = new FormGroup({
      name: new FormControl(this.project.name),
      description: new FormControl(this.project.description),
      location: new FormControl(this.project.location),
      budget: new FormControl(this.project.budget),
      receiptsFolder: new FormControl(this.project.receiptsFolder),
      defaultDropoffDate: new FormControl(this.project.defaultDropoffDate),
      defaultDropoffLocation: new FormControl(this.project.defaultDropoffLocation),
    });

    this.lists = [
      {
        id: 'leads',
        label: 'Leads',
        values: (this.project.leads || []).slice()
      },
      {
        id: 'directors',
        label: 'Directors',
        values: (this.project.directors || []).slice()
      },
      {
        id: 'acquisitions',
        label: 'Acquisitions',
        values: (this.project.acquisitions || []).slice()
      },
      {
        id: 'whitelist',
        label: 'Edit Whitelist',
        values: (this.project.whitelist || []).slice()
      },
    ];

    this.projectForm.valueChanges
        .pipe(debounceTime(500))
        .subscribe(value => {
          const update: Project = {
            name: value.name,
            description: value.description,
            location: value.location,
            budget: value.budget,
            receiptsFolder: value.receiptsFolder,
            defaultDropoffDate: new Date(value.defaultDropoffDate).toISOString(),
            defaultDropoffLocation: value.defaultDropoffLocation,
          };

          this.projectsDao.update(this.project.id, update);
        });
  }

  add(list: string[], event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      list.push(value);
    }

    if (event.input) {
      event.input.value = '';
    }

    this.updateLists();
  }

  remove(list: string[], email: string) {
    const index = list.indexOf(email);
    if (index >= 0) {
      list.splice(index, 1);
    }

    this.updateLists();
  }

  updateLists() {
    const update = {};
    this.lists.forEach(list => {
      update[list.id] = list.values;
    });
    this.projectsDao.update(this.project.id, update);
  }

  deleteProject() {
    const data = {name: of(this.project.name)};

    this.dialog.open(DeleteConfirmation, {data}).afterClosed().pipe(
      take(1))
      .subscribe(confirmed => {
        if (confirmed) {
          this.projectsDao.remove(this.project.id);
          this.requestsDao.getByProject(this.project.id).pipe(
              take(1))
              .subscribe(requests => {
                requests.forEach(r => this.requestsDao.remove(r.id));
              });

          this.snackbar.open(`Project "${this.project.name}" deleted`, null, {duration: 2000});
        }
      });
  }
}
