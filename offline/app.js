// set up Parse
var Parse = require('node-parse-api').Parse;

var APP_ID = "dpfdUhCXPPBflubK1bKkI8eeUAgyLf8FQZ86h1bq";
var MASTER_KEY = "HJLJR3GhjWv0N9QdQ7LZBFfD6IfyJb7WgEjIB4Oi";

var app = new Parse(APP_ID, MASTER_KEY);


var fs = require('fs');
var AlchemyAPI = require('alchemy_mini');
//var alchemyapi = new AlchemyAPI('9cb0f3b96861912dea72ef3ba3b358d98722da43'); // 2015/1/19 11:21PM gmail
//var alchemyapi = new AlchemyAPI('1683a8e86a10e7a193da6560d095fc158c9d0728'); // 2015/1/20 7:00AM qq
//var alchemyapi = new AlchemyAPI('27d5c2aa18afd3f580eaf54a6099474ac00308ea'); //  2015/1/20 8:20AM yahoo



var courses = require('./data/course').data;


// ===================================
// Task: upload courses to Parse
// Bottle neck: Parse. 
// ===================================

// for (var i = 0; i < 1000; i++) {
//   c = courses[i];
//   app.insert('Course', {code: c.code, url: c.url, description: c.description, title: c.title, instructor: c.instructor ,distribution: c.distribution, offered: c.offered}, function (err, response) {
//   });
// }

// for (var i = 1000; i < 2000; i++) {
//   c = courses[i];
//   app.insert('Course', {code: c.code, url: c.url, description: c.description, title: c.title, instructor: c.instructor ,distribution: c.distribution, offered: c.offered}, function (err, response) {
//   });
// }

// for (var i = 2000; i < courses.length; i++) {
//   c = courses[i];
//   app.insert('Course', {code: c.code, url: c.url, description: c.description, title: c.title, instructor: c.instructor ,distribution: c.distribution, offered: c.offered}, function (err, response) {
//   });
// }

// ===================================
// Task: upload taxonomy to Parse
// Bottle neck: Alchemy API limit
// ===================================

// done 0-2227


// processCourse(0, courses.length, 2024);

// function uploadTaxonomy(total, currentCount, taxonomy, courseLow, courseHigh, courseIndex){
//   if (currentCount === total) {
//     processCourse(courseLow, courseHigh, courseIndex + 1);
//   } else {

//     var aTaxonomy = taxonomy[currentCount];

//     app.insert('Taxonomy', {label: aTaxonomy.label, score: parseFloat(aTaxonomy.score), confident: aTaxonomy.confident, code: courses[courseIndex].code}, function (err, response) {

//       console.dir("uploading [#" + courseIndex + ":" + courses[courseIndex].code + "] taxonomy [" + aTaxonomy.label + "]");
//       uploadTaxonomy(total, currentCount + 1, taxonomy, courseLow, courseHigh, courseIndex);

//     });
//   }
// }

// function processCourse(low, high, index){

//   if (index < high) {

//     alchemyapi.taxonomy('url', courses[index].url, null, function(response) {
//       // console.log(response);
      
//         setTimeout(function(){ uploadTaxonomy(response.taxonomy.length, 0, response.taxonomy, low, high, index); }, 3000);
      
//     });
//   }
// }


// ===================================
// Task: upload concepts to Parse
// Bottle neck: Alchemy API limit
// ===================================

// done: 0-2227

// processCourse(0, courses.length, 0);

// function uploadConcept(total, currentCount, concepts, courseLow, courseHigh, courseIndex){
//   if (currentCount === total) {
//     processCourse(courseLow, courseHigh, courseIndex + 1);
//   } else {

//     var concept = concepts[currentCount];

//     app.insert('Concept', {text: concept.text, relevance: parseFloat(concept.relevance), code: courses[courseIndex].code}, function (err, response) {

//       console.dir("uploading [#" + courseIndex + ":" + courses[courseIndex].code + "] concept [" + concept.text + "]");
//       uploadConcept(total, currentCount + 1, concepts, courseLow, courseHigh, courseIndex);

//     });
//   }
// }

// function processCourse(low, high, index){

//   if (index < high) {

//     alchemyapi.concepts('url', courses[index].url, null, function(response) {
//       // console.log(response);
      
//         setTimeout(function(){ uploadConcept(response.concepts.length, 0, response.concepts, low, high, index); }, 3000);
      
//     });
//   }
// }


