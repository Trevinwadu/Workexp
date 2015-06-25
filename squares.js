var svg;
var boundingRect;
var rects;

function start(n) {

  var width = 400,
      height = 400,
      radius = 50;

  var drag = d3.behavior.drag()
      .on("drag", dragmove)
      .on("dragstart", dragstart);

  svg = d3.select("body").append("div").append("svg")
      .attr("width", width)
      .attr("height", height);

  var gs =
    svg
      .selectAll("g")
      .data(d3.range(n))
      .enter()
      .append("g")
      .datum(function(d,i) { return { gx:50+50*i, gy:50, rot:10 } });

  gs.each(function(){updateLoc(this)});

  rects = gs
      .append("rect")
      .attr("width", radius)
      .attr("height", radius)
      .attr("x", -25) // function(d) { return d.x; })
      .attr("y", -25) // function(d) { return d.y; })
      .attr("stroke", "green")
      .attr("fill", "white")
      .call(drag);

  var circs = gs
    .append("circle")
    .attr("r",10)
    .attr("cx",15)
    .attr("cy",10)
    .attr("fill","red")
    .call(drag);

  boundingRect =
    svg.append("rect")
       .attr("x", 0)
       .attr("y", 0)
       .attr("fill", "none")
       .attr("stroke", "blue");
}

function dragmove(d) {
  var g = this.parentNode;
  var p = d3.select(g);
  var dat = p.datum();
  if (dat.corner == true) {
    dat.rot = d3.mouse(svg.node())[0];
  } else {
    var ngx = dat.sgx + (d3.mouse(svg.node())[0] - dat.sdx);
    dat.gx = ngx;
    dat.gy = dat.sgy + (d3.mouse(svg.node())[1] - dat.sdy);
  }
  updateLoc(g);
  updateBounds();
}

function updateBounds() {
  var xmax = 0;
  var ymax = 0;
  rects.each(function() {
    var g = this.parentNode;
    var gsel = d3.select(g);
    var dat = gsel.datum();
    var x = dat.gx + 25;
    var y = dat.gy + 25;
    xmax = Math.max(xmax, x);
    ymax = Math.max(ymax, y);
  });
  var maxmax = Math.max(xmax, ymax);
  boundingRect.attr("width", maxmax);
  boundingRect.attr("height", maxmax);
}

function updateLoc(g) {
  var gsel = d3.select(g);
  var dat = gsel.datum();
  gsel.attr("transform", "translate("+dat.gx+","+dat.gy+") rotate("+dat.rot+","+(0)+","+(0)+")");
}


function dragstart(d) {
  var p = d3.select(this.parentNode);
  var dat = p.datum();
  dat.sdx = d3.mouse(svg.node())[0];
  dat.sdy = d3.mouse(svg.node())[1];
  dat.sgx = dat.gx;
  dat.sgy = dat.gy;
  dat.corner = (this.tagName == "circle");
}

