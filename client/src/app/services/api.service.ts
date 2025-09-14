import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';


export interface Link {
  id: number;
  longUrl: string;
  shortCode: string;
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private http: HttpClient) {}

  public createLink(longUrl: string): Observable<Link> {
    return this.http.post<Link>('/api/links', { longUrl });
  }
}
