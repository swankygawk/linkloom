import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';


export interface Link {
  id: number;
  longUrl: string;
  shortCode: string;
  createdAt: string;
}

export interface PaginatedLinksResponse {
  items: Link[];
  total: number;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private http: HttpClient) {}

  public createLink(longUrl: string): Observable<Link> {
    return this.http.post<Link>('/api/links', { longUrl });
  }

  public getAllLinks(page: number, pageSize: number): Observable<PaginatedLinksResponse> {
    return this.http.get<PaginatedLinksResponse>('/api/links', {
      params: {
        page: page.toString(),
        pageSize: pageSize.toString(),
      },
    });
  }

  public getLinkByShortCode(shortCode: string): Observable<Link> {
    return this.http.get<Link>(`/api/links/${shortCode}`);
  }
}
