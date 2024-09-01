import { Injectable } from '@angular/core';
import { Project } from '../models/project';

@Injectable({
  providedIn: 'root',
})
export class ProjectsService {
  constructor() {}
  projects: Project[] = [];

  getProjects(): Project[] {
    this.projects = [
      {
        id: 1,
        name: 'Assistive Vision',
        description:
          'Generates semantically meaningful and grammatically correct captions for the images using information from picture and caption pairings.',
        image: '/assets/projects/assistive_vision.jpeg',
        url: 'https://github.com/shiv159/Assistive-Vision-Techonology-Final-Year-Project',
      },
      {
        id: 2,
        name: 'TweetApp',
        description:
          'In TweetApp user can login,register,changes password using their email.user can tweet,see others tweet.',
        image: '/assets/projects/tweetApp.jpg',
        url: 'https://github.com/shiv159/TweetApp',
      },
    ];

    return this.projects;
  }
}
