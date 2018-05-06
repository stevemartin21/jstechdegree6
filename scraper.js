
//Do the 4 p's Prepare, plan, perform, perfect

// __ =   ===  __  __  ` `  % %

var d = new Date();
var day = d.getDate();
var year = d.getFullYear();
var month = d.getMonth();

//Create 

var fileDate = `${year}-${month}-${day}`;

// Next Steps create director fs.stat   and then get data into csv file and write file and put in data director 

// Directory 

var dataDir ='./data/' ;

//Variable for directory name & required fs module to create file systems
const fs = require('fs');

// Try / catch astatement to test if the directory already exisits, if not then it will be created 
try{
var stats = fs.statSync(dataDir);
console.log('True or False? Does the data directory exist already? ' + stats.isDirectory());
}catch(err){
	fs.mkdir(dataDir, function(err){
		console.log('The directory was made Succcess')
	});
	
}

//IMported modules request, json2Csv and Cheerio to scrape web site and grab information to manipulate it

const request = require('request');
const Json2csvParser = require('json2csv').Parser;
const cheerio = require('cheerio');

const http = require('http');

// Request to web site 

request('http://shirts4mike.com/shirts.php', function (error, response, html) {

	//check status code to see if there is an internet connection

	if(response.statusCode===200){
		console.log('It is connected!')
	// Create multiple arrays to hold information 
				let newLinks = [];
				let shirtLinks= [];		

		// Load HTMl receved from the request to cheerio so I can use jquery to selected elements	  			   			
				var $ = cheerio.load(html);
				$('.products li a').each(function(key, value){
					shirtLinks = $(this).attr('href');  
					// shirtlines equalls all the links to each page and looped over;
					newLinks = ' http://shirts4mike.com/' + shirtLinks;
					console.log(newLinks);
				});
				
				// second request to each new link to be able to grab price, title, imageURl and url

				request(newLinks, function(error, response, body){
					var $ = cheerio.load(body);
					var price =$('.price').text();
					
					var title = $('.shirt-details h1').text().replace(price,"");
					var	imageUrl = $('.shirt-picture img').attr('src');
					var	url = newLinks;
					var time = d;

					//var results = [];
					
					var results = {title,price, imageUrl, url, time};
					//added variables to object to be able add to the csv 
					const fields = ['title', 'price', 'imageUrl','url', 'time'];
			//create title fields for the csv
					const json2csvParser = new Json2csvParser({ fields });
					
					const csv = json2csvParser.parse(results);
				// parse results of the request 

					fs.writeFile(`./data/${fileDate}.csv` , csv , function (err) {
  					if (err) throw err;
  					console.log('CSV has Been created!');
					});
			});
		}else if(!response.statusCode ===200){
			console.error('There is an error with your internet connection' + error.message)
		}

	});
// Directory 


