import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// import { BarChartComponent } from './bar-chart/bar-chart.component';
import { D3Component } from './d3/d3.component';
import { SearchComponent } from './search/search.component';

const routes: Routes = [
  // { path: 'bar-chart', component: BarChartComponent },
  { path: 'search', component: SearchComponent },
  { path: 'd3', component: D3Component },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
