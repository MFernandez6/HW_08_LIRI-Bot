
// Require
require("dotenv").config();

var request = require("request");
var fs = require("request");

// Link Key Page
var keys = require("./keys.js");

// Initialize Spotify
var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify);

// User Command and Input
var userInput = process.argv[2]
var userQuery = process.argv[3];

command(userInput, userQuery);

// APP Logic
function command (userInput, userQuery) {
    switch (userInput) {
    case 'concert-this':
        concertThis(userQuery);
        break;
    case 'spotify-this-song':
        spotifyThis(userQuery)
        break;
    case 'movie-this':
        movieThis(userQuery);
        break;
    case 'do-what-it-says':
        doThis()
        break;
    default:
        console.log("ERROR! Type any of the following phrases: 'concert-this' 'spotify-this-song' 'movie-this' 'do-what-it-says'")
   
    }
}

function concertThis(userQuery) {
    var queryUrl = "https://rest.bandsintown.com/artists/" + userQuery + "/events?app_id=codingbootcamp";
    request(queryUrl, function(error, response, body) {
    //IF THERE IS NO ERROR GIVE US A 200 STATUS CODE (EVERYTHING OK!)
    if (!error && response.statusCode === 200) {
        // CAPTURE DATA AND USE JSON TO FORMAT
        var concerts = JSON.parse(body);
        //PARSE DATA AND USE FOR LOOP TO ACCESS PATHS TO DATA
        for (var i = 0; i < concerts.length; i++) {  
            console.log("**********EVENT INFO*********");  
            fs.appendFileSync("log.txt", "**********EVENT INFO*********\n");//Append in log.txt file
            console.log(i);
            fs.appendFileSync("log.txt", i+"\n");
            console.log("Name of the Venue: " + concerts[i].venue.name);
            fs.appendFileSync("log.txt", "Name of the Venue: " + concerts[i].venue.name+"\n");
            console.log("Venue Location: " +  concerts[i].venue.city);
            fs.appendFileSync("log.txt", "Venue Location: " +  concerts[i].venue.city+"\n");
            console.log("Date of the Event: " +  concerts[i].datetime);
            fs.appendFileSync("log.txt", "Date of the Event: " +  concerts[i].datetime+"\n");
            console.log("*****************************");
            fs.appendFileSync("log.txt", "*****************************"+"\n");
        }
    } else{
      console.log('Concert Not Found');
    }

});}

function spotifyThis(userQuery) {
    if (userQuery === undefined) {
        userQuery = "God's Plan"; 
    }
    spotify.search(
        {
            type: "track",
            query: userQuery
        },
        function (err, data) {
            if (err) {
                console.log("Error: " + err);
                return;
            }
            var songs = data.tracks.items;

            for (var i = 0; i < songs.length; i++) {
                console.log("**********SONG INFO*********");
                fs.appendFileSync("log.txt", "**********SONG INFO*********\n");
                console.log(i);
                fs.appendFileSync("log.txt", i +"\n");
                console.log("Song name: " + songs[i].name);
                fs.appendFileSync("log.txt", "song name: " + songs[i].name +"\n");
                console.log("Preview song: " + songs[i].preview_url);
                fs.appendFileSync("log.txt", "preview song: " + songs[i].preview_url +"\n");
                console.log("Album: " + songs[i].album.name);
                fs.appendFileSync("log.txt", "album: " + songs[i].album.name + "\n");
                console.log("Artist(s): " + songs[i].artists[0].name);
                fs.appendFileSync("log.txt", "artist(s): " + songs[i].artists[0].name + "\n");
                console.log("*****************************");  
                fs.appendFileSync("log.txt", "*****************************\n");
             }
        }
    );
};

function movieThis(userQuery){
    if (userQuery === undefined) {
        userQuery = "Eternal Sunshine of the Spotless Mind"
        console.log("-----------------------");
        fs.appendFileSync("log.txt", "-----------------------\n");
        console.log("If you haven't watched 'Mr. Nobody,' then you should: http://www.imdb.com/title/tt0485947/");
        fs.appendFileSync("log.txt", "If you haven't watched 'Mr. Nobody,' then you should: http://www.imdb.com/title/tt0485947/" +"\n");
        console.log("It's on Netflix!");
        fs.appendFileSync("log.txt", "It's on Netflix!\n");
    }
    var queryUrl = "http://www.omdbapi.com/?t=" + userQuery + "&y=&plot=short&apikey=7cd5d480";
    request(queryUrl, function(error, response, body) {
    //IF THERE IS NO ERROR GIVE US A 200 STATUS CODE (EVERYTHING OK!)
    if (!error && response.statusCode === 200) {
        var movies = JSON.parse(body);
        console.log("**********MOVIE INFO*********");  
        fs.appendFileSync("log.txt", "**********MOVIE INFO*********\n");
        console.log("Title: " + movies.Title);
        fs.appendFileSync("log.txt", "Title: " + movies.Title + "\n");
        console.log("Release Year: " + movies.Year);
        fs.appendFileSync("log.txt", "Release Year: " + movies.Year + "\n");
        console.log("IMDB Rating: " + movies.imdbRating);
        fs.appendFileSync("log.txt", "IMDB Rating: " + movies.imdbRating + "\n");
        console.log("Rotten Tomatoes Rating: " + getRottenTomatoesRatingValue(movies));
        fs.appendFileSync("log.txt", "Rotten Tomatoes Rating: " + getRottenTomatoesRatingValue(movies) + "\n");
        console.log("Country of Production: " + movies.Country);
        fs.appendFileSync("log.txt", "Country of Production: " + movies.Country + "\n");
        console.log("Language: " + movies.Language);
        fs.appendFileSync("log.txt", "Language: " + movies.Language + "\n");
        console.log("Plot: " + movies.Plot);
        fs.appendFileSync("log.txt", "Plot: " + movies.Plot + "\n");
        console.log("Actors: " + movies.Actors);
        fs.appendFileSync("log.txt", "Actors: " + movies.Actors + "\n");
        console.log("*****************************");  
        fs.appendFileSync("log.txt", "*****************************\n");
    } else{
      console.log('Error occurred.');
    }

});}

function getRottenTomatoesRatingObject (data) {
    return data.Ratings.find(function (item) {
       return item.Source === "Rotten Tomatoes";
    });
  }

  function getRottenTomatoesRatingValue (data) {
    return getRottenTomatoesRatingObject(data).Value;
  }

  function doThis(){
	fs.readFile('random.txt', 'utf8', function(err, data){
		if (err){ 
			return console.log(err);
		}
        var dataArr = data.split(',');
        command(dataArr[0], dataArr[1]);
	});
}
