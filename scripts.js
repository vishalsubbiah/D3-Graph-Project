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
		var original_data;
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
      console.log(lines);
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
			var w = 1000;
			var h = 600;

			var svg = d3.select("body")
											.append("svg")
											.attr("height", h)
											.attr("width", w);

			var simulation = d3.forceSimulation()
							.force("link", d3.forceLink().id(function(d) {return d.id;}))
							.force("link",d3.forceLink().distance(function(d){return d.value;}).strength(0.1))
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
								.attr("fill", function(d){return color(d.group);});


			simulation.nodes(graph.nodes)
								.on("tick", ticked);

			simulation.force("link")
								.links(graph.links);
			function ticked() {
					link.attr("x1", function(d) { return d.source.x; })
							.attr("y1", function(d) { return d.source.y; })
							.attr("x2", function(d) { return d.target.x; })
							.attr("y2", function(d) { return d.target.y; });

					node.attr("cx", function(d) { return d.x; })
							.attr("cy", function(d) { return d.y; });
				}


		}


		function CSR_dense(data){
			return data;
		}

		function CSC_dense(data){
			return data;
		}

		function COO_dense(data){
			return data;
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

				for(var j=0;j<dimensions[1];j++){
					var indices=[];
					for(var i=0;i<dimensions[0];i++){
						json_data['nodes'].push({"id":i,"group":i})
						if(data_dense[i][j]!=0){
							indices.push(i);
						}
					}
					json_data['links'].push({"source":indices[0],"target":indices[1],"value":data_dense[indices[0]][j]});
				}
			return json_data;
		}
