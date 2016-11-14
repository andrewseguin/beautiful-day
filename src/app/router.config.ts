import {ProjectComponent} from "./project/project.component";

export const ROUTER_CONFIG = [
  { path: 'project/:id', component: ProjectComponent},
  { path: '', component: ProjectComponent },
];
