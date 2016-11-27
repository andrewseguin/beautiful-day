import {Component, OnInit, ViewChild} from '@angular/core';
import * as CodeMirror from 'codemirror';

@Component({
  selector: 'project-notes',
  templateUrl: './project-notes.component.html',
  styleUrls: ['project-notes.component.scss']
})
export class ProjectNotesComponent implements OnInit {
  @ViewChild('editor') editor;

  constructor() { }

  ngOnInit() {
    CodeMirror.fromTextArea(this.editor.nativeElement, {
      lineWrapping: true,
      electricChars: false
    });
  }

}
