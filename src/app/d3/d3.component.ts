import { Component, OnInit } from '@angular/core';
import { GithubAccessService } from '../services/github-access.service';
import * as d3 from 'd3';

@Component({
  selector: 'app-d3',
  templateUrl: './d3.component.html',
  styleUrls: ['./d3.component.css']
})
export class D3Component implements OnInit {
  repoData: any;
  contributorsData: any;
  userData: any;
  languagesData: any;
  public pieSVG;
  public isHover;

  constructor(public apiService: GithubAccessService) { }

  ngOnInit(): void {
    this.isHover = false;
    this.getD3Data();
  }
  getD3Data(){
    this.apiService.getRepositoryContributors("d3", "d3").subscribe((value) => {
      console.log("Repo Contributors: ",value);
      this.contributorsData = value;
      this.buildPieChart();
    });
    this.apiService.getRepositoryData("d3", "d3").subscribe((value) => {
      console.log("Repo data: ",value);
      this.repoData = value;
    });
    this.apiService.getRepositoryLanguages("d3", "d3").subscribe((value) => {
      console.log("Repo langugages: ",value);
      value = Object.keys(value);
      this.languagesData = value;
      console.log(value);
    });
    this.apiService.getUserData("d3").subscribe((value) => {
      console.log("User data: ",value);
      this.userData = value;
    });
  }
  buildPieChart(){
  // set the dimensions and margins of the graph
  var width = 450
  var height = 450
  var margin = 40

  // The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
  var radius = Math.min(width, height) / 2 - margin

  // append the svg object to the div called 'my_dataviz'
  this.pieSVG = d3.select("#my_dataviz")
    .append("svg")
      .attr("width", width)
      .attr("height", height)
    .append("g")
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

  // set the color scale
  var color = d3.scaleOrdinal()
    .domain(this.contributorsData.map(d => d.contributions.toString()))
    .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56","#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56","#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56","#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56","#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56","#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56"])


  const pie = d3.pie<any>().value((d: any) => Number(d.contributions));
  // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
  this.pieSVG
  .selectAll('pieces')
  .data(pie(this.contributorsData))
  .enter()
  .append('path')
  .attr('d', d3.arc()
    .innerRadius(0)
    .outerRadius(radius)
  )
  .attr('fill', (d, i) => (color(i)))
  .attr("stroke", "#121926")
  .style("stroke-width", "1px");

  // Add labels
  const labelLocation = d3.arc()
  .innerRadius(100)
  .outerRadius(radius);
  
    this.pieSVG
    .selectAll('pieces')
    .data(pie(this.contributorsData))
    .enter()
    .append('text')
    .text(d =>  d.data.contributions)
    .attr("transform", d => "translate(" + labelLocation.centroid(d) + ")")
    .style("text-anchor", "middle")
    .style("font-size", 15);

    d3.selectAll('#my_dataviz')
    .on('click', i => {
      console.log("click");
    })
    .on("mouseover", i =>{
      this.isHover = true;
    })
    .on("mouseout", i => {
      this.isHover = false;
    });
  }
}
