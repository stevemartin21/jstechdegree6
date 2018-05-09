
//Do the 4 p's Prepare, plan, perform, perfect

// __ =   ===  __  __  ` `  % %

// Dependencies 

const request = require('request');
const Json2csvParser = require('json2csv').Parser;
const cheerio = require('cheerio');
const http = require('http');
const fs = require('fs');

let num =0;
let newArray2	=[];

const fields = ['title', 'price', 'imageUrl','url', 'time'];

var d = new Date();
var day = d.getDate();
var year = d.getFullYear();
var month = d.getMonth();

var entryAddress = 'http://shirts4mike.com/shirts.php'

//Create 

var fileDate = `${year}-${month}-${day}`;

// Next Steps create director fs.stat   and then get data into csv file and write file and put in data director 

// Directory 

var dataDir ='./data/' ;

//Variable for directory name & required fs module to create file systems


// Try / catch astatement to test if the directory already exisits, if not then it will be created 
try{
var stats = fs.statSync(dataDir);
console.log('True or False? Does the data directory exist already? ' + stats.isDirectory());
}catch(err){
	fs.mkdir(dataDir, function(err){
		console.log('The directory was made Succcess')
	});
	
}

function callArray(num){
	newArray2[num];
	
}

//IMported modules request, json2Csv and Cheerio to scrape web site and grab information to manipulate it



// Request to web site 

request('http://shirts4mike.com/shirts.php', function (error, response, html) {

	//check status code to see if there is an internet connection

	if(response.statusCode===200){
		console.log('It is connected!')
	// Create multiple arrays to hold information 
				let newLinks = [];
				let shirtLinks= '';	
				let newArray =[];
				
				let ObjectMaker = {}

		// Load HTMl receved from the request to cheerio so I can use jquery to selected elements	  			   			
				var $ = cheerio.load(html);
				var links = $('.products li a');
				//console.log(links.length);
				links.each(function(i, value){
					shirtLinks = $(this).attr('href'); 
					
					// shirtlines equalls all the links to each page and looped over;
					newLinks ='http://shirts4mike.com/' + shirtLinks;

					//console.log(newLinks)
				newArray.push(newLinks);
				newArray2.push(newLinks);
				

				
				});	

				//console.log(newArray2);

				var results = [];

				for(i=0; i<newArray.length; i++){
					request(newArray[i], function(error, response, body){
						var $ = cheerio.load(body);
						
						var price =$('.price').text();
						var title = $('.shirt-details h1').text().replace(price,"");
						var	imageUrl = $('.shirt-picture img').attr('src');
						//console.log(imageUrl)
						var time = d;
						//console.log(price);
						var url = newArray2[num];
						console.log(url);
						num++
						

					
						
						
						
						
						results.push({title, price, imageUrl, url,time});
						//console.log(results);
						const json2csvParser = new Json2csvParser({ fields });
					
						const csv = json2csvParser.parse(results);

						console.log(csv);

						fs.writeFile(`./data/${fileDate}.csv` , csv , function (err) {
  						if (err) throw err;
  						//console.log('CSV has Been created!');
					});


					})	
				}

		}else if(!response.statusCode ===200){
			console.error('There is an error with your internet connection' + error.message)
		}

	});
// Directory 


