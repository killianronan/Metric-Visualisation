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
  commitsData: any;
  uniqueX: any = [];
  uniqueXCount: any = [];
  combinedData: any = [];

  public pieSVG;
  public barSVG;
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
    });
    this.apiService.getRepositoryCommits("d3", "d3").subscribe((value) => {
      console.log("Repo commits: ",value);
      this.commitsData = value;
      this.calculateBarChartData();
      this.buildBarChart();
    });
    this.apiService.getUserData("d3").subscribe((value) => {
      console.log("User data: ",value);
      this.userData = value;
    });
  }
  calculateBarChartData(){
    this.uniqueXCount = [];
    for(let index = 0; index<this.commitsData.length; index++){
      if(this.uniqueX.includes(this.commitsData[index].author.login)){
        var index2 = this.uniqueX.indexOf(this.commitsData[index].author.login);
        this.uniqueXCount[index2]++;
      }
      if(!this.uniqueX.includes(this.commitsData[index].author.login)){
        this.uniqueX.push(this.commitsData[index].author.login);
        this.uniqueXCount.push(1);
      }
    }
    console.log("Unique: ",this.uniqueX);
    console.log("Unique count: ",this.uniqueXCount);
  }
  buildBarChart(){
    var data = [
      {title: "title1", score: "166443", "Released": "2014"},
      {title: "title2", score: "150793", "Released": "2013"},
      {title: "title3", score: "62342", "Released": "2016"},
      {title: "title4", score: "27647", "Released": "2010"},
      {title: "title5", score: "21471", "Released": "2011"},
    ];

    var margin = 50;
    var width = 600 - (margin * 2);
    var height = 400 - (margin * 2);
    this.barSVG = d3.select("figure#bar")
    .append("svg")
    .attr("width", width + (margin * 2))
    .attr("height", height + (margin * 2))
    .append("g")
    .attr("transform", "translate(" + margin + "," + margin + ")");
    // Create the X-axis band scale
    const x = d3.scaleBand()
    .range([0, width])
    .domain(this.uniqueX.map(d => d))
    .padding(0.5);

    // Draw the X-axis on the DOM
    this.barSVG.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))
    .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end");

    // Create the Y-axis band scale
    const y = d3.scaleLinear()
    .domain([0, 25])
    .range([height, 0]);

    // Draw the Y-axis on the DOM
    this.barSVG.append("g")
    .call(d3.axisLeft(y));
    for(let index = 0; index< this.uniqueX.length; index++){
      this.combinedData.push({
        user: this.uniqueX[index],
        count: this.uniqueXCount[index]
      })
    }
    console.log("OBJECT: ", this.combinedData);
    // Create and fill the bars
    this.barSVG.selectAll("bars")
    .data(this.combinedData)
    .enter()
    .append("rect")
    .attr("x", d => x(d.user))
    .attr("y", d => y(d.count))
    .attr("width", x.bandwidth())
    .attr("height", (d) => height - y(d.count))
    .attr("fill", "#d04a35");
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
