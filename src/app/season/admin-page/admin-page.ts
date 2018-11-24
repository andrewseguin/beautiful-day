import {Component} from '@angular/core';
import {Permissions} from 'app/season/services';
import {isMobile} from 'app/utility/media-matcher';
import {Observable} from 'rxjs';
import {EventsDao, MessagesDao, ProjectsDao} from 'app/season/dao';
import {focusElement, highlight, scroll, SCROLL_ANIMATION_TIME} from 'app/utility/element-actions';

interface AdminTab {
  id: string;
  label: string;
  createObjType?: string;
  create?: () => void;
  guard?: Observable<boolean>;
}

@Component({
  selector: 'admin-page',
  styleUrls: ['admin-page.scss'],
  templateUrl: 'admin-page.html',
})
export class AdminPage {
  selectedTabIndex = 0;
  tabs: AdminTab[] = [
    {
      id: 'messages',
      label: 'Messages',
      createObjType: 'message',
      create: () => this.messagesDao.add({
        text: 'New message',
        bgColor: 'red',
        enabled: true,
      }).then(id => {
        scroll(id);
        highlight(id);
        setTimeout(() => focusElement(id, 'textarea'), SCROLL_ANIMATION_TIME);
      }),
    },
    {
      id: 'groups',
      label: 'Groups',
    },
    {
      id: 'events',
      label: 'Events',
      createObjType: 'event',
      create: () => this.eventsDao.add({}).then(id => {
        highlight(id);
        scroll(id);
        setTimeout(() => focusElement(id, 'input'), SCROLL_ANIMATION_TIME);
      }),
    },
    {
      id: 'projects',
      label: 'Projects',
      createObjType: 'project',
      create: () => this.projectsDao.add({
        name: 'New project',
      }).then(id => {
        highlight(id);
        scroll(id);
      }),
    },
    {
      id: 'owner',
      label: 'Owner',
      guard: this.permissions.isOwner
    },
  ];

  isMobile = isMobile;

  constructor(private permissions: Permissions,
              private eventsDao: EventsDao,
              private projectsDao: ProjectsDao,
              private messagesDao: MessagesDao) {}
}
