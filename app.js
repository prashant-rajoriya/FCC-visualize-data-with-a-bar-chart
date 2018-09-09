d3.json('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json', function(error, data) {
  if (error) throw error;

  let width = 800;
  let height = 400;
  let barPadding = 1;
  let padding = 50;
  let barWidth = width/data.data.length;
  let gdpData = data.data;
  let years = gdpData.map( d => d[0].substring(0,4));
  let gdp = gdpData.map( d => d[1])
  let gdpDomain = d3.extent(gdp);
  let minGdp = d3.min(gdp);
  let maxGdp = d3.max(gdp);
  let yearData = gdpData.map( d => {
    let quarter;
    let temp = d[0].substring(5,7);
    switch(temp){
      case '01' : quarter = 'Q1';
                  break;
      case '04' : quarter = 'Q2';
                  break;
      case '07' : quarter = 'Q3';
                  break;
      case '10' : quarter = 'Q4';
                  break;
    }
    return d[0].substring(0,4)+ " "+ quarter;
  });

  let svg = d3.select('svg')
              .attr('width', width+100)
              .attr('height', height+60);

  let xScale = d3.scaleLinear()
                  .domain(d3.extent(years))
                  .range([padding,width+padding]);

  let yScale = d3.scaleLinear()
                  .domain([minGdp,maxGdp])
                  .range([height,(minGdp/maxGdp)*height]);

  let xAxis = d3.axisBottom(xScale)
                .tickFormat(d3.format('d'));

  let yAxis = d3.axisLeft(yScale)
                .tickFormat(d3.format('d'));

  let tooltip = d3.select(".visHolder").append("div")
                  .attr("id", "tooltip")
                  .style("opacity", 0);
  
  let overlay = d3.select('.visHolder').append('div')
                  .attr('class', 'overlay')
                  .style('opacity', 0);

  svg.append('g')
      .attr('id', 'x-axis')
      .attr('transform', `translate(0,${height})`)
      .call(xAxis);

  svg.append('g')
      .attr('id', 'y-axis')
      .attr('transform', `translate(${padding},0)`)
      .call(yAxis);

  svg.append('text')
      .attr('transform',`rotate(-90)`)
      .attr('x', -height/2)
      .attr('y', 80)
      .text('Gross Domestic Product');

  svg.selectAll('rect')
      .data(gdp)
      .enter()
      .append('rect')
      .classed('bar', true)
      .attr('width', barWidth)
      .attr('height', d => height-yScale(d))
      .attr('x', (d, i) => i * (barWidth))
      .attr('y', d => yScale(d))
      .attr('fill', '#33adff')
      .attr('transform',`translate(${padding},0)`)
      .attr('data-date', (d, i) => data.data[i][0])
      .attr('data-gdp', d => d)
      .on('mouseover', (d, i) => {
        
        let temp = height - yScale(d);
        overlay.transition()
        .duration(0)
        .style('height', temp + 'px')
        .style('width', barWidth + 'px')
        .style('opacity', .9)
        .style('left', (i * barWidth) - 10 + 'px')
        .style('top', yScale(d) + 'px')
        .style('transform', 'translateX(60px)');

        tooltip.transition()
          .duration(200)
          .style('opacity', .9);
          
        tooltip.html(`
          <p>${yearData[i]}</p>
          <p>'$'${d.toFixed(1).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')} Billion</p>`)
          .attr('data-date', data.data[i][0])
          .style('top', height - 100 + 'px')
          .style('left', (i * barWidth) + 30 + 'px')
          .style('transform', 'translateX(60px)');
      })
      .on('mouseout', (d, i) => {
        tooltip.transition()
          .duration(200)
          .style('opacity', 0);
        overlay.transition()
          .duration(200)
          .style('opacity', 0);
    });
})