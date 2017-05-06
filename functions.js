// function CSR_dense(data){
// 		var numrows = data[2].length-1;
// 		var numcols = data[1].reduce(function(a, b) {
//     		return Math.max(a, b);
// 		});
// 		var data_dense = [];
// 		for (i=0;i<numrows; i++){
// 			var row =[];		
// 			var start = parseFloat(data[2][i]);
// 			for(j=0;j<numcols; j++){
// 				if (j+1 == data[1][start-1]){
// 					row.push(parseFloat(data[0][start-1]));				
// 					start++;
// 				} else {
// 					row.push(0);
// 				}

// 			}
// 			data_dense.push(row);
// 		}
// 		return data_dense
// 	}

// 	function CSC_dense(data){
// 		var numcols = data[2].length-1;
// 		var numrows = data[1].reduce(function(a, b) {
//     		return Math.max(a, b);
// 		});
// 		var data_dense = [];

// 		for (i=0;i<numcols; i++){
// 			var col =[];		
// 			var start = parseFloat(data[2][i]);
// 			for(j=0;j<numrows; j++){
// 				if (j+1 == data[1][start-1]){
// 					col.push(parseFloat(data[0][start-1]));				
// 					start++;
// 					console.log(start);
// 				} else {
// 					col.push(0);
// 				}

// 			}
// 			data_dense.push(col);
// 		}

// 		return data_dense;
// 	}

// 	function COO_dense(data){
// 		var numrows = data[1].reduce(function(a, b) {
// 			return Math.max(a, b);	
// 		});

// 		var numcols = data[2].reduce(function(a, b) {
// 			return Math.max(a, b);	
// 		});

// 		data_dense=[];
// 		j=0;
// 		count=0;
// 		for (i=0;i<numrows; i++){
// 			var row =[];	
// 			for(j=0;j<numcols; j++){
// 				if (data[1][count] == i+1 && data[2][count] == j+1) {row.push(data[0][count]); count++;}
// 				else {row.push(0);}
// 			}
// 			data_dense.push(row);
// 		}

// 		return data_dense;
// 	}

// 	function Adj_json(data_dense){
// 		return data_dense;
// 	}

// 	function Inc_json(data_dense){
// 		return data_dense;
// 	}