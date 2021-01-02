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
  private margin = 50;
  private width = 750 - (this.margin * 2);
  private height = 400 - (this.margin * 2);
  public githubData: any;
  constructor(public apiService: GithubAccessService) { }

  ngOnInit(){
    this.getData();
    this.createSvg();
    this.drawBars(this.data);
  }

  public async getData(){
    await this.apiService.getPosts().then((value) => {
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
