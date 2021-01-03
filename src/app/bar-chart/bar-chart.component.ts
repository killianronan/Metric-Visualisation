import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import { GithubAccessService } from '../services/github-access.service';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.css']
})
export class BarChartComponent implements OnInit {
  private data = [
    {title: "title1", score: "166443", "Released": "2014"},
    {title: "title2", score: "150793", "Released": "2013"},
    {title: "title3", score: "62342", "Released": "2016"},
    {title: "title4", score: "27647", "Released": "2010"},
    {title: "title5", score: "21471", "Released": "2011"},
  ];
  private svg;
  private svg2;
  private svg3;
  private svg4;
  private margin = 50;
  private width = 750 - (this.margin * 2);
  private height = 400 - (this.margin * 2);
  public githubData: any;
  constructor(public apiService: GithubAccessService) { }

  ngOnInit(){
    this.getData();
    this.createSvg();
    this.drawBars(this.data);
    this.circle();
    this.marginGraph();
    this.contributionsOverTime();
  }

  public async getData(){
    this.apiService.getPosts().subscribe((value) => {
      console.log("val", value);
      this.githubData = value;
      console.log("Data in component: ", this.githubData);
    });
    this.apiService.getPosts().subscribe((value) => {
      console.log("val", value);
      this.githubData = value;
      console.log("Data in component: ", this.githubData);
    });
  }

  private createSvg(){
    this.svg = d3.select("figure#bar")
    .append("svg")
    .attr("width", this.width + (this.margin * 2))
    .attr("height", this.height + (this.margin * 2))
    .append("g")
    .attr("transform", "translate(" + this.margin + "," + this.margin + ")");

    // this.svg2 = d3.select("#dataviz_area").append("circle")
    //   .attr("cx", 2).attr("cy", 2).attr("r", 40).style("fill", "blue")
    //   .attr("cx", 140).attr("cy", 70).attr("r", 40).style("fill", "red")
    //   .attr("cx", 300).attr("cy", 100).attr("r", 40).style("fill", "green");
  }
  marginGraph(){
    // set the dimensions and margins of the graph
    var margin = {top: 10, right: 40, bottom: 30, left: 30},
    width = 450 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    this.svg3 = d3.select("#Area")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    // translate this svg element to leave some margin.
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Create data
    var data = [ {x:10, y:20}, {x:40, y:90}, {x:80, y:50} ]
    // X scale and Axis
    var x = d3.scaleLinear()
    .domain([0, 100])         // This is the min and the max of the data: 0 to 100 if percentages
    .range([0, width]);       // This is the corresponding value I want in Pixel
    this.svg3.append('g')
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

    // X scale and Axis
    var y = d3.scaleLinear()
    .domain([0, 100])         // This is the min and the max of the data: 0 to 100 if percentages
    .range([height, 0]);       // This is the corresponding value I want in Pixel
    this.svg3.append('g')
    .call(d3.axisLeft(y));

    // Add 3 dots for 0, 50 and 100%
    this.svg3.selectAll("whatever")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", function(d){ return x(d.x) })
    .attr("cy", function(d){ return y(d.y) })
    .attr("r", 7)
  }
  contributionsOverTime(){
    // set the dimensions and margins of the graph
    var margin = {top: 10, right: 30, bottom: 30, left: 60},
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    this.svg4 = d3.select("#my_dataviz")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

    // Add X axis
    var x = d3.scaleLinear()
    .domain([0, 100])
    .range([ 0, width ]);
    this.svg4.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

    // Add Y axis
    var y = d3.scaleLinear()
    .domain([0, 100])
    .range([ height, 0]);
    this.svg4.append("g")
    .call(d3.axisLeft(y));
    var data = [{
      x: 10, 
      y: 2
    },
    {
      x: 20, 
      y: 10
    },
    {
      x: 60, 
      y: 90
    },
  {
    x: 56, 
    y: 47
  }];

    // Add dots
    this.svg4.append('g')
    .selectAll("dot")
    .data(data)
    .enter()
    .append("circle")
      .attr("cx", function (d) { return x(d.x); } )
      .attr("cy", function (d) { return y(d.y); } )
      .attr("r", 1.5)
      .style("fill", "#69b3a2")
  }
  circle(){
    
    this.svg2 = d3.select("#dataviz_area")

    // Create a scale: transform value in pixel
    const x = d3.scaleLinear()
    .domain([0, 100])         // This is the min and the max of the data: 0 to 100 if percentages
    .range([0, 400]);       // This is the corresponding value I want in Pixel
    // Try console.log( x(25) ) to see what this x function does.

    this.svg2.call(d3.axisBottom(x))// Show the axis that corresponds to this scale

    this.svg2.append("circle") 
      .attr("cx", x(10)).attr("cy", 100).attr("r", 40).style("fill", "blue");
    this.svg2.append("circle")
      .attr("cx", x(50)).attr("cy", 100).attr("r", 40).style("fill", "red");
    this.svg2.append("circle")
      .attr("cx", x(100)).attr("cy", 100).attr("r", 40).style("fill", "green");
  }
  private drawBars(data: any[]){
    // Create the X-axis band scale
    const x = d3.scaleBand()
    .range([0, this.width])
    .domain(data.map(d => d.title))
    .padding(0.2);

    // Draw the X-axis on the DOM
    this.svg.append("g")
    .attr("transform", "translate(0," + this.height + ")")
    .call(d3.axisBottom(x))
    .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end");

    // Create the Y-axis band scale
    const y = d3.scaleLinear()
    .domain([0, 200000])
    .range([this.height, 0]);

    // Draw the Y-axis on the DOM
    this.svg.append("g")
    .call(d3.axisLeft(y));

    // Create and fill the bars
    this.svg.selectAll("bars")
    .data(data)
    .enter()
    .append("rect")
    .attr("x", d => x(d.title))
    .attr("y", d => y(d.score))
    .attr("width", x.bandwidth())
    .attr("height", (d) => this.height - y(d.score))
    .attr("fill", "#d04a35");
  }
}
