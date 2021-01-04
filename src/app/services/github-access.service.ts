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
  getRepositoryContributors(username: String, repo: String) {
    this.RepoUrl = "https://api.github.com/repos/"+username+"/"+repo+"/contributors";
    const options = {
      headers: {
        authorization: "token 749b8208147b89da6a7b1d12c7dddd95346efc74"
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
  getRepositoryData(username: String, repo: String) {
    this.RepoUrl = "https://api.github.com/repos/"+username+"/"+repo;
    const options = {
      headers: {
        authorization: "token 749b8208147b89da6a7b1d12c7dddd95346efc74"
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
  getRepositoryLanguages(username: String, repo: String) {
    this.RepoUrl = "https://api.github.com/repos/"+username+"/"+repo+"/languages";
    const options = {
      headers: {
        authorization: "token 749b8208147b89da6a7b1d12c7dddd95346efc74"
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
