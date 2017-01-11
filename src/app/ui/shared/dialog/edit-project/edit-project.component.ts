import {Component, OnInit, ViewChild, AfterViewChecked} from '@angular/core';
import {MdDialogRef, MdTextareaAutosize} from "@angular/material";
import {Project} from "../../../../model/project";
import {ProjectsService} from "../../../../service/projects.service";

export type EditType =
  'name' |
  'budget' |
  'location' |
  'description' |
  'leads' |
  'director' |
  'acquisitions';

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
  director: string;
  acquisitions: string;
  type: EditType;

  @ViewChild(MdTextareaAutosize) descriptionTextArea: MdTextareaAutosize;

  constructor(private dialogRef: MdDialogRef<EditProjectComponent>,
              private projectsService: ProjectsService) { }

  ngOnInit(): void {
    this.name = this.project.name;
    this.budget = this.project.budget;
    this.description = this.project.description;
    this.location = this.project.location;
    this.leads = this.project.leads ? this.project.leads.split(',') : [''];
    this.director = this.project.director;
    this.acquisitions = this.project.acquisitions;
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
        const leadsArray = [];
        this.leads.forEach(lead => leadsArray.push(lead));
        update.leads = leadsArray.join();
        break;
      case 'director':
        update.director = this.director; break;
      case 'acquisitions':
        update.acquisitions = this.acquisitions; break;
    }

    this.projectsService.update(this.project.$key, update);
    this.close();
  }

  onTextareaKeydown(e: KeyboardEvent): void {
    if (e.keyCode == 13 || e.key == 'Enter') { this.save(); return; }
  }

  leadTrackBy(i: number): number {
    return i;
  }

  removeLead(i: number) {
    this.leads.splice(i, 1);
  }
}
