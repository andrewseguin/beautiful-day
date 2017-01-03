import {Component, OnInit} from '@angular/core';
import {Params, ActivatedRoute} from '@angular/router';
import {ProjectsService} from '../../../../service/projects.service';
import {Request} from '../../../../model/request';
import {Event} from '../../../../model/event';
import {FirebaseListObservable, FirebaseAuth, FirebaseAuthState} from 'angularfire2';
import {Project} from '../../../../model/project';
import {MdDialog} from '@angular/material';
import {
  EditProjectComponent,
  EditType
} from '../../../shared/dialog/edit-project/edit-project.component';
import {DeleteProjectComponent} from '../../../shared/dialog/delete-project/delete-project.component';
import {PermissionsService, EditPermissions} from "../../../../service/permissions.service";
import {EditEventComponent} from "../../../shared/dialog/edit-event/edit-event.component";
import {EventsService} from "../../../../service/events.service";
import {AdminsService} from "../../../../service/admins.service";
import {UsersService} from "../../../../service/users.service";

@Component({
  selector: 'project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.scss']
})
export class ProjectDetailsComponent implements OnInit {
  canEditEvents: boolean;
  editPermissions: EditPermissions;
  project: Project;
  requests: FirebaseListObservable<Request[]>;
  user: FirebaseAuthState;
  managers: string[];
  director: string;
  acquisitions: string;
  events: Event[];

  constructor(private route: ActivatedRoute,
              private mdDialog: MdDialog,
              private auth: FirebaseAuth,
              private permissionsService: PermissionsService,
              private eventsService: EventsService,
              private adminsService: AdminsService,
              private usersService: UsersService,
              private projectsService: ProjectsService) { }

  ngOnInit() {
    this.auth.subscribe(auth => {
      this.user = auth;

      // Determine if the user is an admin or owner, if so they can edit events
      this.adminsService.isAdmin(auth.auth.email).flatMap(isAdmin => {
        this.canEditEvents = isAdmin;
        return this.usersService.getCurrentUser();
      }).subscribe(user => this.canEditEvents = this.canEditEvents || user.isOwner);
    });

    this.route.parent.params.forEach((params: Params) => {
      this.projectsService.getProject(params['id']).subscribe((project: Project) => {
        this.project = project;

        this.permissionsService.getEditPermissions(this.project.$key)
          .subscribe(editPermissions => {
            this.editPermissions = editPermissions;
          });
      });
    });

    this.eventsService.getEvents().subscribe(events => this.events = events);

  }

  edit(type: EditType) {
    const dialogRef = this.mdDialog.open(EditProjectComponent);
    dialogRef.componentInstance.project = this.project;
    dialogRef.componentInstance.type = type;
  }

  canEdit(): boolean {
    if (!this.user || !this.project || !this.editPermissions) return false;
    return this.editPermissions.details;
  }

  getManagerEmails(): string[] {
    return this.project.managers ? this.project.managers.split(',') : [];
  }

  deleteProject() {
    const dialogRef = this.mdDialog.open(DeleteProjectComponent);
    dialogRef.componentInstance.project = this.project;
  }

  addEvent() {
    this.mdDialog.open(EditEventComponent);
  }

  editEvent(event: Event) {
    const dialogRef = this.mdDialog.open(EditEventComponent);
    dialogRef.componentInstance.event = event;
  }
}
