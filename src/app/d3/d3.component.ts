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
  branchesData: any;
  collaboratorsData: any;
  contributionsCount: any = [];
  commitStats: any;
  lineGraphData: any = [];

  public pieSVG;
  public barSVG;
  public scatterSVG;
  public histSVG;
  public isHover;

  constructor(public apiService: GithubAccessService) { }

  ngOnInit(): void {
    this.isHover = false;
    this.getD3Data();
  }
  getD3Data(){
    this.apiService.getRepositoryContributors("d3", "d3").subscribe((value) => {
      this.contributorsData = value;
      this.buildPieChart();
    });
    this.apiService.getRepositoryData("d3", "d3").subscribe((value) => {
      this.repoData = value;
    });
    this.apiService.getRepositoryLanguages("d3", "d3").subscribe((value) => {
      value = Object.keys(value);
      this.languagesData = value;
    });
    this.apiService.getRepositoryCommits("d3", "d3").subscribe((value) => {
      this.commitsData = value;
      this.calculateBarChartData();
      this.buildBarChart();
    });
    this.apiService.getRepositoryBranches("d3", "d3").subscribe((value) => {
      this.branchesData = value;
    });
    this.apiService.getRepositoryContributorStats("d3", "d3").subscribe((value) => {
      this.collaboratorsData = value;
      this.calculateScatterChartData();
      this.buildScatterGraph();
    });
    this.apiService.getLatestCommitStats("d3", "d3").subscribe((value) => {
      this.commitStats = value;
      this.calculateLineGraphData();
      this.buildLineGraph();
    });
    this.apiService.getUserData("d3").subscribe((value) => {
      this.userData = value;
    });
  }
  calculateLineGraphData(){
    for(let index = 0; index< this.commitStats.length; index++){
      if(this.commitStats[index].total!=0){
        var date = new Date(this.commitStats[index].week *1000).toLocaleDateString("en-US");
        this.lineGraphData.push({total: this.commitStats[index].total, index: index, date: date});
      }
    }
  }
  buildLineGraph(){
    var margin = {top: 10, right: 30, bottom: 40, left: 100},
    width = 460 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;
    this.histSVG = d3.select("#line-plot")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

    // X axis
    var x = d3.scaleLinear()
    .domain([0, 55])
    .range([ 0, width]);
    this.histSVG.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))
    .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end");

    // Y axis
    var y = d3.scaleBand()
    .range([ 0, height ])
    .domain(this.lineGraphData.map(function(d) { return d.date; }))
    .padding(1);
    this.histSVG.append("g")
    .call(d3.axisLeft(y))


    // Lines
    this.histSVG.selectAll("myline")
    .data(this.lineGraphData)
    .enter()
    .append("line")
    .attr("x1", function(d) { return x(d.total); })
    .attr("x2", x(0))
    .attr("y1", function(d) { return y(d.date); })
    .attr("y2", function(d) { return y(d.date); })
    .attr("stroke", "grey")

    // Circles
    this.histSVG.selectAll("mycircle")
    .data(this.lineGraphData)
    .enter()
    .append("circle")
    .attr("cx", function(d) { return x(d.total); })
    .attr("cy", function(d) { return y(d.date); })
    .attr("r", "4")
    .style("fill", "#69b3a2")
    .attr("stroke", "black");
  }
  calculateScatterChartData(){
    this.contributionsCount = [];
    var additions = 0;
    var deletions = 0;
    for(let index = 0; index< this.collaboratorsData[99].weeks.length; index++){
      var weekCount = 0;
      additions=this.collaboratorsData[99].weeks[index].a;
      deletions=this.collaboratorsData[99].weeks[index].d;
      weekCount = additions+deletions;
      if(weekCount != 0){
        this.contributionsCount.push({changes: weekCount, commits: this.collaboratorsData[99].weeks[index].c, index: index});
      }
    }
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
  }
  buildScatterGraph(){
      var margin = {top: 50, right: 0, bottom: 30, left: 50},
      width = 500 - margin.left - margin.right,
      height = 400 - margin.top - margin.bottom;

    this.scatterSVG = d3.select("#my_dataviz")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

    // X axis
    var x = d3.scaleLinear()
    .domain([0, 572])
    .range([ 0, width ]);
    this.scatterSVG.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

    this.scatterSVG.append("text")             
    .attr("transform",
          "translate(" + 60 + " ," + 
                         height+1 + ")")
    .style("text-anchor", "middle")
    .text("Date");

    // Y axis
    var y = d3.scaleLinear()
    .domain([0, 75000])
    .range([ height, 0]);
    this.scatterSVG.append("g")
    .call(d3.axisLeft(y));

    // dots
    this.scatterSVG.append('g')
    .selectAll("dot")
    .data(this.contributionsCount)
    .enter()
    .append("circle")
      .attr("cx", function (d) { return x(d.index); } )
      .attr("cy", function (d) { return y(d.changes); } )
      .attr("r", 1.5)
      .style("fill", "#69b3a2")
  }

  buildBarChart(){
    var margin = 50;
    var width = 600 - (margin * 2);
    var height = 400 - (margin * 2);
    this.barSVG = d3.select("figure#bar")
    .append("svg")
    .attr("width", width + (margin * 2))
    .attr("height", height + (margin * 2))
    .append("g")
    .attr("transform", "translate(" + margin + "," + margin + ")");
    // X-axis band scale
    const x = d3.scaleBand()
    .range([0, width])
    .domain(this.uniqueX.map(d => d))
    .padding(0.5);

    // X-axis
    this.barSVG.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))
    .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end");

    // Y-axis band scale
    const y = d3.scaleLinear()
    .domain([0, 25])
    .range([height, 0]);

    // Y-axis
    this.barSVG.append("g")
    .call(d3.axisLeft(y));
    for(let index = 0; index< this.uniqueX.length; index++){
      this.combinedData.push({
        user: this.uniqueX[index],
        count: this.uniqueXCount[index]
      })
    }
    // bars
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
  var width = 450
  var height = 450
  var margin = 40
  var radius = Math.min(width, height) / 2 - margin

  this.pieSVG = d3.select("#my_dataviz")
    .append("svg")
      .attr("width", width)
      .attr("height", height)
    .append("g")
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

  // colors
  var color = d3.scaleOrdinal()
    .domain(this.contributorsData.map(d => d.contributions.toString()))
    .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56","#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56","#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56","#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56","#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56","#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56"])


  const pie = d3.pie<any>().value((d: any) => Number(d.contributions));
  //pie chart
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

  // labels
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
