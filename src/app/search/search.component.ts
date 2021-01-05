import { Component, OnChanges, OnInit } from '@angular/core';
import { GithubAccessService } from '../services/github-access.service';
import * as d3 from 'd3';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  public treemapSVG = null;
  treemapData: any = [];
  selectedUser: any;
  username: string;
  orgReposData: any;
  constructor(public apiService: GithubAccessService) { }

  ngOnInit(): void {
    this.username = "";
  }
  findUser(){
    this.remove();
    this.apiService.getUserData(this.username).subscribe((value) => {
      if(value.toString==[].toString){
        alert("Invalid username entered. Try again!");
      }
      else{
        this.selectedUser = value;
        this.getUserRepos();
      }
    });
  }
  getUserRepos(){
    this.apiService.getOrgRepos(this.username).subscribe((value) => {
      this.orgReposData = value;
      this.username = "";
      this.parseRepoData();
      this.buildTreemap();
    });
  }
  parseRepoData(){
    this.treemapData= [];
    for(let index = 0; index< this.orgReposData.length; index++){
      this.treemapData.push({name:this.orgReposData[index].name ,size:100});
    }
    console.log(this.treemapData);
  }
  remove(){
    if(this.treemapSVG!=null){
      this.treemapSVG.selectAll("*").remove();
    }
  }
  resetSearch(){
    location.reload();
  }
  buildTreemap(){
    var margin = {top: 10, right: 10, bottom: 10, left: 10},
    width = 1000 - margin.left - margin.right,
    height = 1000 - margin.top - margin.bottom;

    this.treemapSVG = d3.select("#treemap")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");
      const data = {
          children: this.treemapData.map(item => ({value: item.size, name: item.name}))
      };
      const drawTreeMap = (dataset)=>{
        const hierarchy = d3.hierarchy(dataset).sum(d=>d.value)  //sum every child's values
        const treemap = d3.treemap()
        .size([1000, 1000]) 
        .padding(1);     
        const root = treemap(hierarchy);
        
        this.treemapSVG.selectAll("rect")
        .data(root.leaves())
        .enter()
        .append("rect")
        .attr("x", d=>d.x0)   
        .attr("y", d=>d.y0)
        .attr("width",  d=>d.x1 - d.x0)
        .attr("height", d=>d.y1 - d.y0)
        .attr("fill", "#5AB7A9")

        this.treemapSVG
        .selectAll("text")
        .data(root.leaves())
        .enter()
        .append("text")
        .attr("x", function(d){ return d.x0 +10})    // +10 to adjust position (more right)
        .attr("y", function(d){ return d.y0 +20})    // +20 to adjust position (lower)
        .text(function(d){ return d.data.name})
        .attr("font-size", "15px")
        .attr("fill", "white")            
    }
    drawTreeMap(data);
  }
}
