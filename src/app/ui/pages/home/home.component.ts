import {Component} from '@angular/core';
import {HeaderService} from 'app/service/header.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  show2017Projects = false;

  constructor(headerService: HeaderService) {
    headerService.title = 'Home';
  }
}
