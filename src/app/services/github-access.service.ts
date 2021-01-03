import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class GithubAccessService {
  httpData:any;
  private url = "https://api.github.com/users/killianronan";

  constructor(private http: HttpClient) { }
  getPosts() {
    return this.http.get(this.url);
  }
}
