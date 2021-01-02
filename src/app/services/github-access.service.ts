import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class GithubAccessService {
  httpData:any;
  private url = "https://api.github.com/users/killianronan";

  constructor(private http: HttpClient) { }
  async getPosts(){
    return this.http.get(this.url).subscribe(data => {
      console.log("Data retrieved from get: ", data);
    })
  }
}
