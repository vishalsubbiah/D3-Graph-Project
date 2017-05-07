var original_data;
d3.json("data.json",function(d){
  d3.select("body")
     .append("h2")
     .attr("class","apple")
     .text("Je suis Poisson");
     // .style("text-align","center");

	d3.select("body")
	  .append("p")
	  .attr("class","bodywords")
	  .text("As an example, here's the graph of the stiffness matrix after discretizing the Dirichlet Poisson problem with periodic right hand side. It is an interesting question whether or not the structure of a matrix derived from a system (for example, physical systems in the case of discretized PDEs) can be identified with the structure of the graph upon reaching equilibrium with respect to the edge-forces. The collection of beautiful visualizations of large sparse matrices collected by Tim Davis might suggest this is the case. However, it is not clear that the structure imposed by positing a force law for the edges overshadows any structure that might be inherent in the matrices and the systems they represent. For the sake of curiosity, other researches might try to visualize their problem with this app. Whether or not it will have consequential interpretations, is up to the researcher. ");


  makegraph1(d,0.1);


});

d3.json("ten.json",function(d){

  d3.select("body")
     .append("h2")
     .attr("class","apple")
     .text("Tree");
     // .style("text-align","center");

  d3.select("body")
	  .append("p")
	  .attr("class","bodywords")
	  .text("We also hope this visualization might be useful for people who want to quickly take matrices from spectral graph theory and linear algebra classes to visualize them. For example we constructed the adjacency matrix for a tree and then found the permutation so that it was more obviously in bipartite form. ");


  makegraph1(d,0.1);




});

function handleFiles(files) {
      // Check for the various File API support.
      if (window.FileReader) {
          // FileReader are supported.
          getAsText(files[0]);
      }
			else {
          alert('FileReader are not supported in this browser.');
      }
    }

    function getAsText(fileToRead) {
      var reader = new FileReader();
      // Read file into memory as UTF-8
      reader.readAsText(fileToRead);
      // Handle errors load
      reader.onload = loadHandler;
      reader.onerror = errorHandler;
    }

    function loadHandler(event) {
      var csv = event.target.result;
      original_data=processData(csv);
    }

    function processData(csv) {
        var allTextLines = csv.split(/\r\n|\n/);
        var lines = [];
        for (var i=0; i<(allTextLines.length-1); i++) {
            var data = allTextLines[i].split(',');
                var tarr = [];
                for (var j=0; j<data.length; j++) {
                    tarr.push(data[j]);
                }
                lines.push(tarr);
        }
			return lines;
    }

    function errorHandler(evt) {
      if(evt.target.error.name == "NotReadableError") {
          alert("Canno't read file !");
      }
    }

		function options(){
			var data=original_data;
			var opt1=document.getElementById('option1').value;
			var opt2=document.getElementById('option2').value;
      var str= document.getElementById("mytext").value;
      str=str/100.0;
			if(opt2=="csr"){
				 var data_dense=CSR_dense(data);
			}
			else if(opt2=="csc"){
				var data_dense=CSC_dense(data);
			}
			else if(opt2=="coo"){
				var data_dense=COO_dense(data);
			}
			else{
				var data_dense=data;
			}

			if(opt1=="Adjacency"){
				var graph=Adj_json(data_dense);
			}
			else if(opt2="Incident"){
				var graph = Inc_json(data_dense);
			}
      console.log(graph);
			makegraph(graph,str);

			}


			function makegraph(graph,str){

			var w = 1200;
			var h = 600;

      d3.selectAll("svg").remove();
      d3.selectAll("h2.apple").remove();
      d3.selectAll("p.bodywords").remove();

			var svg = d3.select("body")
											.append("svg")
											.attr("height", h)
											.attr("width", w);

			var simulation = d3.forceSimulation()
							.force("link", d3.forceLink().id(function(d) {return d.id;}))
							.force("link",d3.forceLink().distance(function(d){return d.value;}).strength(str))
							.force("charge", d3.forceManyBody())
							.force("center", d3.forceCenter(w / 2, h / 2));

			var color = d3.scaleOrdinal(d3.schemeCategory20);

			var link = svg.append("g")
								.attr("class","links")
								.selectAll("line")
								.data(graph.links)
								.enter()
								.append("line")
								.attr("stroke-width","2px")
								.attr("fill", 'black');

			var node = svg.append("g")
								.attr("class","nodes")
								.selectAll("circle")
								.data(graph.nodes)
								.enter()
								.append("circle")
								.attr("r", "5px")
								.attr("fill", function(d){return color(d.group);})
                .call(d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended));

			simulation.nodes(graph.nodes)
								.on("tick", ticked);

			simulation.force("link")
								.links(graph.links);
			function ticked() {
					link.attr("x1", function(d) { return d.source.x; })
							.attr("y1", function(d) { return d.source.y; })
							.attr("x2", function(d) { return d.target.x; })
							.attr("y2", function(d) { return d.target.y; });

					node.attr("cx", function(d) { return validate(d.x,0,w); })
							.attr("cy", function(d) { return validate(d.y,0,h); });
				}
        function validate(x, a, b) {
            if (x < a) x = a+5;
            if (x > b) x = b-5;
            return x;
}

        function dragstarted(d) {
          if (!d3.event.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
          }

        function dragged(d) {
          d.fx = d3.event.x;
          d.fy = d3.event.y;
        }

        function dragended(d) {
          if (!d3.event.active) simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        }
		}


		function CSR_dense(data){
					var numrows = data[2].length-1;
		var numcols = data[1].reduce(function(a, b) {
    		return Math.max(a, b);
		});
		var data_dense = [];
		for (i=0;i<numrows; i++){
			var row =[];
			var start = parseFloat(data[2][i]);
			for(j=0;j<numcols; j++){
				if (j+1 == data[1][start-1]){
					row.push(parseFloat(data[0][start-1]));
					start++;
				} else {
					row.push(0);
				}

			}
			data_dense.push(row);
		}
		return data_dense;
		}

		function CSC_dense(data){
			var numcols = data[2].length-1;
  		var numrows = data[1].reduce(function(a, b) {
      		return Math.max(a, b);
  		});
  		var data_dense = [];

  		for (i=0;i<numcols; i++){
  			var col =[];
  			var start = parseFloat(data[2][i]);
  			for(j=0;j<numrows; j++){
  				if (j+1 == data[1][start-1]){
  					col.push(parseFloat(data[0][start-1]));
  					start++;
  				} else {
  					col.push(0);
  				}

  			}
  			data_dense.push(col);
  		}

  		return data_dense;
		}

		function COO_dense(data){
			var numrows = data[1].reduce(function(a, b) {
				return Math.max(a, b);
			});

			var numcols = data[2].reduce(function(a, b) {
				return Math.max(a, b);
			});

			data_dense=[];
			j=0;
			count=0;
			for (i=0;i<numrows; i++){
				var row =[];
				for(j=0;j<numcols; j++){
					if (data[1][count] == i+1 && data[2][count] == j+1) {row.push(data[0][count]); count++;}
					else {row.push(0);}
				}
				data_dense.push(row);
			}

			return data_dense;
		}


		function Adj_json(data_dense){
			var json_data={"nodes":[],"links":[]};
			var dimensions = [ data_dense.length, data_dense[0].length ];
			for(var i=0;i< dimensions[0];i++){
				json_data['nodes'].push({"id":i,"group":i})
				for(var j=0;j<i;j++){
          if(data_dense[i][j]!=0){
					json_data['links'].push({"source":i,"target":j,"value":data_dense[i][j]});
        }
				}
			}
			return json_data;
		}

		function Inc_json(data_dense){
			var json_data={"nodes":[],"links":[]};
			var dimensions = [ data_dense.length, data_dense[0].length ];
      for(var i=0;i<dimensions[0];i++){
        json_data['nodes'].push({"id":i,"group":i})
      }
				for(var j=0;j<dimensions[1];j++){
					var indices=[];
					for(var i=0;i<dimensions[0];i++){
						//json_data['nodes'].push({"id":i,"group":i})
						if(data_dense[i][j]!=0){
							indices.push(i);
						}
					}
					json_data['links'].push({"source":indices[0],"target":indices[1],"value":data_dense[indices[0]][j]});
				}
			return json_data;
		}


function makegraph1(graph,str){

var w = 1200;
var h = 600;

var svg = d3.select("body")
                .append("svg")
                .attr("height", h)
                .attr("width", w);

var simulation = d3.forceSimulation()
        .force("link", d3.forceLink().id(function(d) {return d.id;}))
        .force("link",d3.forceLink().distance(function(d){return d.value;}).strength(str))
        .force("charge", d3.forceManyBody())
        .force("center", d3.forceCenter(w / 2, h / 2));

var color = d3.scaleOrdinal(d3.schemeCategory20);

var link = svg.append("g")
          .attr("class","links")
          .selectAll("line")
          .data(graph.links)
          .enter()
          .append("line")
          .attr("stroke-width","2px")
          .attr("fill", 'black');

var node = svg.append("g")
          .attr("class","nodes")
          .selectAll("circle")
          .data(graph.nodes)
          .enter()
          .append("circle")
          .attr("r", "5px")
          .attr("fill", function(d){return color(d.group);})
          .call(d3.drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended));

simulation.nodes(graph.nodes)
          .on("tick", ticked);

simulation.force("link")
          .links(graph.links);
function ticked() {
    link.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    node.attr("cx", function(d) { return validate(d.x,0,w); })
        .attr("cy", function(d) { return validate(d.y,0,h); });
  }
  function validate(x, a, b) {
      if (x < a) x = a+5;
      if (x > b) x = b-5;
      return x;
}

  function dragstarted(d) {
    if (!d3.event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
    }

  function dragged(d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
  }

  function dragended(d) {
    if (!d3.event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }
}
