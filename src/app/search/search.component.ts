import { Component, OnChanges, OnInit } from '@angular/core';
import { GithubAccessService } from '../services/github-access.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  selectedUser: any;
  username: string;
  constructor(public apiService: GithubAccessService) { }

  ngOnInit(): void {
    this.username = "";
    this.getData();
  }
  findUser(){
    this.apiService.getUserData(this.username).subscribe((value) => {
      if(value.toString==[].toString){
        alert("Invalid username entered. Try again!");
      }
      else{
        this.username = "";
        this.selectedUser = value;
        console.log("user data: ",this.selectedUser);
      }
    });
  }
  getData(){
    this.apiService.getRepositoryData().subscribe((value) => {
      console.log("user data: ",value);
    });
  }

}
