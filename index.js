const express = require("express");
const app = express();
const fetch=require('node-fetch');
var geolocation = require('geolocation');
const { Navigator } = require("node-navigator");
const navigator = new Navigator();
const port =process.env.PORT || 2000;

// const staticpath = path.join(__dirname ,"/public");
// app.use(express.static(staticpath));


// body parser
app.use(express.urlencoded({extended: true}));

app.use(express.static(__dirname + '/public'));

app.set("view engine", "hbs");


var degToCard = function(deg){
    if (deg>11.25 && deg<=33.75){
      return "NNE";
    }else if (deg>33.75 && deg<=56.25){
      return "ENE";
    }else if (deg>56.25 && deg<=78.75){
      return "E";
    }else if (deg>78.75 && deg<=101.25){
      return "ESE";
    }else if (deg>101.25 && deg<=123.75){
      return "ESE";
    }else if (deg>123.75 && deg<=146.25){
      return "SE";
    }else if (deg>146.25 && deg<=168.75){
      return "SSE";
    }else if (deg>168.75 && deg<=191.25){
      return "S";
    }else if (deg>191.25 && deg<=213.75){
      return "SSW";
    }else if (deg>213.75 && deg<=236.25){
      return "SW";
    }else if (deg>236.25 && deg<=258.75){
      return "WSW";
    }else if (deg>258.75 && deg<=281.25){
      return "W";
    }else if (deg>281.25 && deg<=303.75){
      return "WNW";
    }else if (deg>303.75 && deg<=326.25){
      return "NW";
    }else if (deg>326.25 && deg<=348.75){
      return "NNW";
    }else{
      return "N"; 
    }
  }


function msToHMS(s) {
    var currentTime = new Date();

var currentOffset = currentTime.getTimezoneOffset();

var ISTOffset = 330;   // IST offset UTC +5:30 
    var now = new Date(s*1000+(ISTOffset + currentOffset)*60000);
        let hours = now.getHours();
        let mins = now.getMinutes();
        let periods = "AM";

        if (hours > 11) {
          periods = "PM";
          if (hours > 12) hours -= 12;
        }
        if (mins < 10) {
          mins = "0" + mins;
        }
        
        return `${hours}:${mins}${periods}`;
  }

  app.get('/',(req,res)=>{
  navigator.geolocation.getCurrentPosition((geolocations, error) => {
    console.log(geolocations);
    if (error) {fetch(`https://api.openweathermap.org/data/2.5/weather?q=Delhi&units=metric&appid=887233809a61861b250933775626159a`)
    .then(response=> response.json())
    .then(weatherData=>{
  
              const{name} = weatherData;
              const{temp_max} = weatherData.main;
              const{temp_min} = weatherData.main;
              const{sunrise} = weatherData.sys;
              const{sunset} = weatherData.sys;
              const{description} = weatherData.weather[0];
              const{humidity} = weatherData.main;
              const{speed} = weatherData.wind;
              const{deg} = weatherData.wind;
        
        res.render('index',{
          city :name,
          maxTemprature :temp_max, 
          minTemprature :temp_min,  
          sunrise1 :msToHMS(sunrise),
          sunset1 :msToHMS(sunset),
          sky :description,  
          Humidity :humidity, 
          windSpeed :speed, 
          windDirection :degToCard(deg)
        })
  
    })
    .catch(err=>console.log(err));}


    else{
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${geolocations.latitude}&lon=${geolocations.longitude}&appid=887233809a61861b250933775626159a`)
     .then(response => response.json())
     .then(data =>{
            const{name} = data;
            const{temp_max} = data.main;
            const{temp_min} = data.main;
            const{sunrise} = data.sys;
            const{sunset} = data.sys;
            const{description} = data.weather[0];
            const{humidity} = data.main;
            const{speed} = data.wind;
            const{deg} = data.wind;
    
    res.render('index',{
      city :name,
      maxTemprature :Math.round(temp_max-273), 
      minTemprature :Math.round(temp_min-273),  
      sunrise1 :msToHMS(sunrise),
      sunset1 :msToHMS(sunset),
      sky :description,  
      Humidity :humidity, 
      windSpeed :speed, 
      windDirection :degToCard(deg)
    }) 
    
     }).catch(err=>console.log(err));}
});

});

// app.get('/',(req,res)=>{
//   fetch(`https://api.openweathermap.org/data/2.5/weather?q=Delhi&units=metric&appid=887233809a61861b250933775626159a`)
//   .then(response=> response.json())
//   .then(weatherData=>{

//             const{name} = weatherData;
//             const{temp_max} = weatherData.main;
//             const{temp_min} = weatherData.main;
//             const{sunrise} = weatherData.sys;
//             const{sunset} = weatherData.sys;
//             const{description} = weatherData.weather[0];
//             const{humidity} = weatherData.main;
//             const{speed} = weatherData.wind;
//             const{deg} = weatherData.wind;
      
//       res.render('index',{
//         city :name,
//         maxTemprature :temp_max, 
//         minTemprature :temp_min,  
//         sunrise1 :msToHMS(sunrise),
//         sunset1 :msToHMS(sunset),
//         sky :description,  
//         Humidity :humidity, 
//         windSpeed :speed, 
//         windDirection :degToCard(deg)
//       })

//   })
//   .catch(err=>console.log(err));
// });

// searchButton.addEventListener("click",(e)=>{

//   e.preventDefault();
//   getWeather(searchInput.value);
//   searchInput.value = '';

// });

app.post('/',(req,res)=>{
  console.log(req.body.city);
  res.send("hello");
})

app.get("*",(req,res)=>{
    res.send("404");
});

app.listen(port,()=>{
    console.log(`Listening to port ${port}`);
});

