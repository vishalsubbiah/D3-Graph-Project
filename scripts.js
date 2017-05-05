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

			if(opt1=="adjacency"){
				var json_data=Adj_json(data_dense);
			}
			else if(opt2="incident"){
				var json_data = Inc_json(data_dense);
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
			return data_dense;
		}

		function Inc_json(data_dense){
			return data_dense;
		}
