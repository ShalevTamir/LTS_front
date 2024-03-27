import { Component, OnInit } from '@angular/core';
import { NavigationStart, Router, RouterLink, RouterLinkActive, RoutesRecognized } from '@angular/router';
import { RouterService } from '../../common/services/router-service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink,RouterLinkActive, NgIf],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent{
}
