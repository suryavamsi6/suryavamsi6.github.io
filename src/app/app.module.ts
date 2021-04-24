import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { IntroComponent } from './intro/intro.component';
import { ProfileComponent } from './profile/profile.component';
import { BackgroundComponent } from './background/background.component';
import { ProjectsComponent } from './projects/projects.component';
import { FontAwesomeModule, FaIconLibrary  } from '@fortawesome/angular-fontawesome';

import { fab, faGithub } from '@fortawesome/free-brands-svg-icons';
import { SkillsComponent } from './skills/skills.component';
import { ContactComponent } from './contact/contact.component';
@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    IntroComponent,
    ProfileComponent,
    BackgroundComponent,
    ProjectsComponent,
    SkillsComponent,
    ContactComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FontAwesomeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {  constructor(library: FaIconLibrary) {
  library.addIconPacks(fab);
  library.addIcons(faGithub);
}

}
