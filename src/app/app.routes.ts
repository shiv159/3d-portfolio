import { Routes } from "@angular/router";
import { PortfolioComponent } from "./components/portfolio/portfolio.component";
import { ProjectsComponent } from "./components/projects/projects.component";
import { RobotComponent } from "./components/robot/robot.component";
import { ParticalsComponent } from "./components/particals/particals.component";

export const routes: Routes = [
  { path: "home", component: RobotComponent },
  { path: "", redirectTo: "home", pathMatch: "full" },
  { path: "projects", component: ProjectsComponent },
  { path: "experience", component: PortfolioComponent },
  { path: "partical", component: ParticalsComponent },
];
