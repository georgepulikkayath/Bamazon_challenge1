var mysql=require("mysql");
var inquirer = require('inquirer');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'mypas',
  database : 'Bamazon'
});
 
connection.connect(function(error){
  if(error)throw error;
  start();
});
 function start(){
connection.query('SELECT item_id,product_name,price from products', function (error, results, fields) {
  if (error) throw error;
  console.log("id\t\t\t     product \t\t\t\t\t  price");
  console.log("------------------------------------------------------------------------------------")
  for(i=0;i<results.length;i++){
     
  console.log(+results[i].item_id+"\t\t\t"+results[i].product_name+"\t\t\t\t\t\t"+results[i].price);
  }
inquirer
  .prompt([
      {
    /* Pass your questions in here */
    type:"input",
    message:"What you would like to buy?",
    name:"item",
    validate:function (item)
{
   var reg = /^\d+$/;
   return reg.test(item) || "It should be a number!";
}
      },{
        type:"input",
        message:"How many units of the product you want to buy?",
        name:"units",
        validate:function (units){
          var reg = /^\d+$/;
          return reg.test(units)|| "it should be a number";
        }
      }

  ])
  .then(answers => {
    
       var itemSelected=answers.item;
       var unitSelected=answers.units;
       process(itemSelected,unitSelected);
       
     
  
     
     
   
    
      
    // Use user feedback for... whatever!!
  });

  


});
 }

function process(item,unit){
  connection.query('SELECT * from products where ?',[{item_id:item}],
  function(error,results){
   for(i=0;i<results.length;i++){ 
   var stock=results[i].stock_quantity;
  
   
   }  
   if(stock<unit){
     console.log("Insufficient quantity!");
     start();
     
   }
   else{
     console.log("The units that you wanted is"+unit);
     var rs=stock-unit;
     update(rs,item,unit);

   }
  });
  
    
  

}
function update(rs,item,unit){
  connection.query("UPDATE products SET ? WHERE ?",[{stock_quantity:rs},{item_id:item}],
  function(error){
    if(error)throw error;
    console.log("updated sucessfully");
    calculate(item,unit);

  })
  
  
}
function calculate(id,unit){
  connection.query("SELECT * from products where ?",[{item_id:id}],
  function(error,results){
    if(error)throw error;
    for(i=0;i<results.length;i++){
      var unitPrice=results[i].price;
      var total=unitPrice*unit;
      console.log("Total price"+total);
    }
  })
  connection.end(); 

}
