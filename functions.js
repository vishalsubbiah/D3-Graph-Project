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
					console.log(start);
				} else {
					row.push(0);
				}

			}
			data_dense.push(row);
		}
		return data_dense
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