import {Component, OnInit, ViewChild, AfterViewChecked} from '@angular/core';
import {MatDialogRef, MatTextareaAutosize} from '@angular/material';
import {Project} from 'app/model/project';
import {ProjectsDao} from 'app/ui/season/dao';

export type EditType =
  'name' |
  'budget' |
  'location' |
  'description' |
  'leads' |
  'directors' |
  'acquisitions' |
  'receipts folder';

@Component({
  selector: 'edit-project',
  templateUrl: './edit-project.component.html',
  styleUrls: ['./edit-project.component.scss']
})
export class EditProjectComponent implements OnInit, AfterViewChecked {
  project: Project;
  name: string;
  budget: number;
  description: string;
  location: string;
  leads: string[];
  directors: string[];
  acquisitions: string[];
  receiptsFolder: string;
  type: EditType;

  @ViewChild(MatTextareaAutosize) descriptionTextArea: MatTextareaAutosize;

  constructor(private dialogRef: MatDialogRef<EditProjectComponent>,
              private projectsDao: ProjectsDao) { }

  ngOnInit(): void {
    this.name = this.project.name;
    this.budget = this.project.budget;
    this.description = this.project.description;
    this.location = this.project.location;
    this.leads = this.project.leads || [];
    this.directors = this.project.directors || [];
    this.acquisitions = this.project.acquisitions || [];
    this.receiptsFolder = this.project.receiptsFolder;
  }

  ngAfterViewChecked() {
    if (this.descriptionTextArea) { this.descriptionTextArea.resizeToFitContent(); }
  }

  close(): void {
    this.dialogRef.close();
  }

  save(): void {
    let update: Project = {};

    switch (this.type) {
      case 'name':
        update.name = this.name; break;
      case 'budget':
        if (this.budget != undefined) {
          this.budget = Math.max(0, this.budget);
          update.budget = this.budget;
        }
        break;
      case 'location':
        update.location = this.location; break;
      case 'description':
        update.description = this.description; break;
      case 'leads':
        update.leads = this.leads; break;
      case 'directors':
        update.directors = this.directors; break;
      case 'acquisitions':
        update.acquisitions = this.acquisitions; break;
      case 'receipts folder':
        update.receiptsFolder = this.receiptsFolder; break;
    }

    this.projectsDao.update(this.project.id, update);
    this.close();
  }

  onTextareaKeydown(e: KeyboardEvent): void {
    if (e.keyCode == 13 || e.key == 'Enter') { this.save(); return; }
  }

  indexTrackBy(i: number): number {
    return i;
  }

  removeLead(i: number) {
    this.leads.splice(i, 1);
  }

  removeDirector(i: number) {
    this.directors.splice(i, 1);
  }
}
