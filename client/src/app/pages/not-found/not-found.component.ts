import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.scss'
})
export class NotFoundComponent implements OnInit {
  public invalidCode = signal<string | null>(null);

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.invalidCode.set(this.route.snapshot.queryParamMap.get('shortCode'));
  }
}
