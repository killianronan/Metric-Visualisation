import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GithubAccessService {
  httpData:any;
  private UserUrl = "https://api.github.com/users/";
  private RepoUrl = "https://api.github.com/repos/killianronan/GithubAccess";
  
  errorMsg: String;

  constructor(private http: HttpClient) { }
  getPosts() {
    return this.http.get("https://api.github.com/users/killianronan");
  }
  getUserData(username: String) {
    return this.http.get(this.UserUrl+username).pipe(
      catchError(error => {
          if (error.error instanceof ErrorEvent) {
              this.errorMsg = `Error: ${error.error.message}`;
          } else {
              this.errorMsg = `Error: ${error.message}`;
          }
          console.log("ERROR");
          return of([]);
      })
  );
  }
  getRepositoryData() {
    this.RepoUrl = "https://api.github.com/repos/d3/d3/contributors";
    const options = {
      headers: {
        authorization: "token "
      }
    };
    return this.http.get(this.RepoUrl,options).pipe(
      catchError(error => {
          if (error.error instanceof ErrorEvent) {
              this.errorMsg = `Error: ${error.error.message}`;
          } else {
              this.errorMsg = `Error: ${error.message}`;
          }
          console.log("ERROR");
          return of([]);
      })
  );
  }
  
}
