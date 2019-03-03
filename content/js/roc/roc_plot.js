"use strict";

/* https://github.com/d3/d3-ease Copyright 2015 Michael Bostock, Copyright 2001 Robert Penner. */

const params = {
    threshold: 750,
    people: [
      {name: 'andy', payback: false, score: [650, 600, 610]},
      {name: 'heather', payback: false, score: [630, 620, 650]},
      {name: 'bobby', payback: true, score: [715, 650, 630]},
		  {name: 'charles', payback: false, score: [670, 680, 760]},
      {name: 'inga', payback: true, score: [750, 710, 780]},
      {name: 'del', payback: false, score:[680, 740, 720]},
      {name: 'elenor', payback:true, score: [800, 780, 680]},
      {name: 'frankie', payback:true, score: [820, 810, 810]},
      {name: 'martha', payback: true, score: [845, 840, 845]} 
    ],
    modelNumber: 1,
		numRejected: 0,
}

const margin = 140,
	outerSize = 960,
	innerSize = outerSize - margin * 2;

const minCreditScore = 600,
	maxCreditScore=850;

const creditScale = d3.scale.linear()
	.domain([minCreditScore, maxCreditScore])
	.range([0, innerSize]);

var y = d3.scale.linear()
	.domain([0, 1])
	.range([innerSize, 0]);

var yAxis = d3.svg.axis()
	.scale(y)
	.orient("left")
	.tickSize(-innerSize)
	.tickPadding(8);

var x = d3.scale.linear()
	.domain([0, 1])
	.range([0, innerSize]);

var xAxis = d3.svg.axis()
	.scale(x)
	.orient("bottom")
	.tickSize(-innerSize)
	.tickPadding(8);

const peopleSvg = d3.select('#people').append("svg")
	.attr({preserveAspectRatio: "xMinYMin meet", viewBox: `0 0 ${outerSize} ${outerSize/4}`})
	.classed("svg-content", true)
	.on("mousemove", mouseThreshold)
	.append("g")
	.attr("transform", `translate(${margin}, 10)`);

const plotSvg = d3.select('#plot_area').append("svg")
	.attr({preserveAspectRatio: "xMinYMin meet", viewBox: `0 0 ${outerSize} ${Math.round(0.8*outerSize)}`})
	.classed("svg-content", true)
	.append("g")
	.attr("transform", `translate(${margin}, 10)`);

const makePeople = (scoreArray, modelNumber) => {
	const svg = peopleSvg;

	const people = svg.selectAll("circle")
		.data(scoreArray, d => d.name)
		.enter()
		.append("g")
		.attr('class', 'person')
		.attr("transform", d => `translate(${creditScale(d.score[modelNumber])}, 0)`);

	const headCenter=40, armHeight=60, bodyEnd=80, legEnd=100;
	const colorFunction = (d) => d.payback ? 'black': 'red';

	people.attr("fill",  colorFunction)
		.append("circle")
		.attr({cx: 0, cy: headCenter, r: 10});

	people.append("line")
				.attr({x1: 0, x2: 0, y1: headCenter, y2:bodyEnd, 'stroke-width': 4})
				.attr('stroke', colorFunction);

	people.append("line")
				.attr({x1: -10, x2:0, y1: legEnd, y2: bodyEnd, 'stroke-width': 4})
				.attr('stroke', colorFunction);

	people.append("line")
				.attr({x1: 10, x2:0, y1: legEnd, y2: bodyEnd, 'stroke-width': 4})
				.attr('stroke', colorFunction);

	people.append("line")
				.attr({x1: -10, x2:10, y1: armHeight, y2: armHeight, 'stroke-width': 4})
				.attr('stroke', colorFunction);

	people.append("text")
				.attr('class', 'axis axis--x')
				.attr({x: 0, y: headCenter - 30, 'text-anchor': 'middle'})
				.text(d=>d.score[modelNumber]);

	svg.append('rect')
		 .classed('highlight-defaults', true)
		 .attr({x: creditScale(minCreditScore) - 20, y: -5,
			  	  width: creditScale(params.threshold) - creditScale(minCreditScore) + 20,
			  	  height: legEnd + 30, fill: 'black', 'fill-opacity': 0.4});
	svg.append('line')
		 .classed('dividing-line', true)
		 .attr({x1: creditScale(params.threshold), x2: creditScale(params.threshold),
			 		  y1: -5, y2: legEnd + 30});

	return people;
}

function mouseThreshold() {
	let thresholdScore = Math.round(creditScale.invert(d3.mouse(this)[0] - margin));
	thresholdScore = Math.max(minCreditScore, thresholdScore);
	moveThreshold(Math.min(maxCreditScore, thresholdScore));
}

const moveThreshold = (newThreshold) => {
	params.threshold = newThreshold;

	d3.select('.dividing-line').attr({x1: creditScale(params.threshold), x2: creditScale(params.threshold)});
	d3.select('.highlight-defaults').attr({width: creditScale(params.threshold) - creditScale(minCreditScore) + 20});
	const thresholdLabels = document.getElementsByClassName('threshold_label');
	[].forEach.call(thresholdLabels, (el) => {el.innerHTML = newThreshold;});

	const {payback, noPayback, numRejected} = getTally(params.people, params.threshold, params.modelNumber);

	params.numRejected = numRejected;
	updateTable(payback, noPayback);
	drawPoints();
}

const changeModelNumber = (modelNumber, delay=2500) => {
	params.modelNumber = modelNumber;

	people.transition()
			  .attr("transform", d => `translate(${creditScale(d.score[modelNumber])}, 0)`)
				.duration(delay)
				.selectAll('text')
				.text(d=>d.score[modelNumber]);
	drawPoints();
	moveThreshold(params.threshold);
}

const makePlot = () => {
	const svg = plotSvg;

	svg.append("rect")
		.attr("class", "background")
		.attr("width", innerSize)
		.attr("height", innerSize);

	svg.append("g")
		.attr("class", "axis axis--x")
		.attr("transform", "translate(0," + innerSize + ")")
		.call(xAxis)
		.append("text")
		.attr("x", innerSize-20)
		.attr("y", 35)
		.attr("dy", ".71em")
		.style("text-anchor", "end")

	svg.append('g')
		.attr('class', 'axis-title')
		.append('text')
		.text("FPR")
		.attr("transform", "translate(0," + innerSize + ")")
		.attr('x', innerSize-45)
		.attr('y', 45);

	svg.append('g')
		.attr('class', 'axis-title')
		.append('text')
		.text("TPR")
		.attr("transform", "translate(0," + 20 + ")rotate(-90)")
		.attr('x', -35)
		.attr('y', -50);

	svg.append("g")
		.attr("class", "axis axis--y")
		.call(yAxis)
		.append("text")
		.attr("class", "axis-title")
		.attr("x", -24)
		.attr("dy", ".32em")
		.style("text-anchor", "end");

}

const drawPoints = () => {
	const fpr = falsePositiveRate(getPlayerOrder(params.people, params.modelNumber));
	const tpr = truePositiveRate(getPlayerOrder(params.people, params.modelNumber));

	plotSvg.selectAll(".point").remove();
	plotSvg.selectAll("path").remove();

	const points = plotSvg.selectAll(".point")
		.data(fpr)
		.enter()
		.append("circle")
		.attr("class", "point")
		.attr("cx", fpr_value => x(fpr_value))
		.attr("cy", (fpr_value, index) => y(tpr[index]))
		.attr("r", (fpr_value, index) => (index == params.numRejected ? 10:5));


	const lineGenerator = d3.svg.line()
		.x((d, index) => x(fpr[index]))
		.y((d, index) => y(tpr[index]))

	plotSvg.append("path")
		.data([fpr])
		.attr("class", "line")
		.attr("d", lineGenerator)
		.attr('fill', 'none')
		.attr('stroke', 'black')
		.attr('stroke-width', 1.2);
}


const people = makePeople(params.people, 1);
makePlot();
changeModelNumber(1);
