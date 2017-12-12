var fs = require('fs');
var re = require('request');

var buildHtml = '<!DOCTYPE html>'
         + '<html> <header> <style> .event{background-color:rgba(128, 128, 128, 0.5); margin-bottom: 30px; width:900px;}</style></header> <body>';
var endHtml = '</body>' + '</html>';
var meetupPage;
var topicsArray = [
    {"id": 242, "name": "Outdoors & Adventure"},
    {"id": 292, "name": "Tech"},
    {"id": 232, "name": "Family"},
    {"id": 302, "name": "Health & Wellness"},
    {"id": 282, "name": "Sports & Fitness"},
    {"id": 562, "name": "Learning"},
    {"id": 262, "name": "Photography"},
    {"id": 162, "name": "Food & Drink"},
    {"id": 582, "name": "Writing"},
    {"id": 212, "name": "Language & Culture"},
    {"id": -1, "name":"Exit"}
];
var eventDate = '2017-12-16';
var meetupTopicsString;
var eventRadius;
var flag = false;
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let ans = '';
var main = ()=>{
    
    var fileName = '/home/mike/labs/script_lab3/index.html';
    var stream = fs.createWriteStream(fileName);

    function addElement (name, link, description = "", group = ""){
        var el = '<div class="event"><a href=' + link +'>'+  name +'</a>'+'<div>group:'+ group +'</div>'+ '<div>'+description+"</div></div>";
        return el;
    }

    let mp;
    let div;
    var writeStream = fs.createWriteStream(fileName); 
    setTimeout(()=>{
        mp = "{body:"+meetupPage+"}";
        mp = JSON.parse(meetupPage);
        mp = mp.events;
        writeStream.write( buildHtml);
        mp.forEach(element => {
            let div = addElement(element.name, element.link, element.description, element.group.name);
            writeStream.write(div);       
        });
        console.log("Done!");
        rl.close();
    },20000);
}

setTimeout(()=>{{
    console.log("wait a bit ");
    re(`https://api.meetup.com/find/upcoming_events?&sign=true&photo-host=public&end_date_range=${eventDate}T23:59:59&topic_category=${meetupTopicsString}&start_date_range=${eventDate}T00:00:01&page=40&radius=${eventRadius}&key=2553b67542e223917595c426d7a6f72`, function (error, response, body) {
        meetupPage = body;
    });
    main();
}},15000);

setTimeout(()=>{     
    rl.question('select a radius ', (answer) => {
        eventRadius = answer;
    });
}, 4000);

setTimeout(()=>{     
    rl.question('select date in format 2017-12-16 ', (answer) => {
        eventDate = answer;
    });
}, 6000);

let exit = true;

var pickTopic = () =>{
    for (let topic = 0; topic < topicsArray.length;topic++){
        console.log(topic +'.  '+topicsArray[topic].name);
    }
    rl.question('select a topic ', (answer) => {
        if (answer != -1){
            if (flag){
                meetupTopicsString = meetupTopicsString +' ' + topicsArray[answer].id;
            } else {
                meetupTopicsString = '' + topicsArray[answer].id;
                flag = true;
            }                
        } else{
            exit = false;
        }
    });
}

pickTopic();