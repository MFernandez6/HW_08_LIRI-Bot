//Set variables with the dotenv package:
require("dotenv").config();

//Send requests to the OMDB API.
var request = require("request");
//Spotify package to send requests to the Spotify API.
var Spotify = require("node-spotify-api");

//Figlet package to create drawings from text.
var figlet = require("figlet");
// fs for reading and writing files
var fs = require("fs");

//Access all of the keys in the keys.js file
var keys = require("./keys.js");

//process.argv to print out any command line arguments.
var input = process.argv;

//spotify-this-song, movie-this, do-what-it-says array
var liriCommand = input[2];

//movie-this variable to hold the movie name.
var movieName = "";

//spotify-this-song variable to hold the song name.
var songName = "";

//variable that contains text file with information requested was added to log file.
var addedToLogFile = "Results added to log.txt file.";

//Output information about that movie if command is movie-this.
if (liriCommand === "movie-this") {
    getMovieInfo();
    }

    //Show song info for the specified song if command is spotify-this-song.
    else if (liriCommand === "spotify-this-song") {
    getSongInfo(songName);
    }

    //If do-what-it-says, text inside of random.txt is used to run spotify-this-song for "I want it that way."
    else if (liriCommand === "do-what-it-says") {
    //log to log.txt.
    logData("liri command: do-what-it-says");
    doWhatItSays();
    }

    //If command is help, display command line help page.
    else if (liriCommand === "help") {
    showHelp();
    }

    //If the user enters a command that is not available, notify the user that the command was not found.
    else {
    console.log(
        "Command not found. Run 'node liri.js help' to see a list of available commands."
    );
}

//Run function to get movie info for the specified movie.
function getMovieInfo() {
    //If the movie name is longer than one word, join the words together on one line so that the movie name is all one string.
    //Rather than having separate lines for each word.
    for (var i = 3; i < input.length; i++) {
        if (i > 2 && i < input.length) {
        movieName = movieName + " " + input[i];
        }
    }

    //If no movie name is specified on the command line, then show the movie info for the movie, Mr. Nobody.
    if (!movieName) {
        movieName = "Mr Nobody";
        console.log(
        "If you haven't watched Mr. Nobody, then you should: http://www.imdb.com/title/tt0485947/"
        );
        console.log("It's on Netflix!");
    }

    //figlet npm used to convert the movieName text to art/drawing.
    figlet(movieName, function(err, data) {
        if (err) {
        console.log("Something went wrong...");
        console.dir(err);
        return;
        }
        console.log(data);
    });

    //Request to the OMDB API movieName value.
    request(
        "http://www.omdbapi.com/?t=" + movieName + "&apikey=trilogy",
        function(error, response, body) {
        //If the request is successful (i.e. if the response status code is 200)
        if (!error && response.statusCode === 200) {
            //Parse the body of the JSON object that holds the movie data and display.
            var movieInfo = JSON.parse(body);
            //console.log(movieInfo);

            // Variable for Rotten Tomatoes Rating.
            var tomatoRating = movieInfo.Ratings[1].Value;

            //movieName Output information .
            var movieResult =
            "=======================================================================================================" +
            "\r\n" +
            //Output command plus movieName
            "liri command: movie-this " +
            movieName +
            "\r\n" +
            "=======================================================================================================" +
            "\r\n" +
            //Title of the movie.
            "Title: " +
            movieInfo.Title +
            "\r\n" +
            //Year the movie came out.
            "Year movie was released: " +
            movieInfo.Year +
            "\r\n" +
            //IMDB Rating of the movie.
            "IMDB movie rating (out of 10): " +
            movieInfo.imdbRating +
            "\r\n" +
            //Rotten Tomatoes rating of the movie.
            "Rotten Tomatoes rating (out of 100%): " +
            tomatoRating +
            "\r\n" +
            //Country where the movie was produced.
            "Filmed in: " +
            movieInfo.Country +
            "\r\n" +
            //Language of the movie.
            "Language: " +
            movieInfo.Language +
            "\r\n" +
            //Plot of the movie.
            "Movie plot: " +
            movieInfo.Plot +
            "\r\n" +
            //Actors in the movie.
            "Actors: " +
            movieInfo.Actors +
            "\r\n" +
            //Line break
            "=======================================================================================================";

            //Output the movie information to the terminal.
            console.log(movieResult);
            //Output the movie information to the log.txt file.
            logData(movieResult);
        }
        }
    );
}

//Get information about the specified song.
function getSongInfo(songName) {
    //This for loop ensures that if the song name is longer than one word, all of the words in the song name stay on the same line.
    for (var i = 3; i < input.length; i++) {
        songName = songName + " " + input[i];
    }

    //console.log(songName);
    //Line break to keep log.txt file organized.
    logData(
        "=========================================================================="
    );
    //log command to log.txt.
    logData("liri command: spotify-this-song");

    //var spotify = new Spotify(keys.spotify);
    var spotify = new Spotify({
        id: process.env.SPOTIFY_ID,
        secret: process.env.SPOTIFY_SECRET
    });

    //If no song name is specified on the command line, show song info for "The Waiting" by The Mowgli's by default.
    if (!songName) {
        //If no song is specified, set the songName variable to "The Waiting."
        songName = "The Waiting";
    }

    //Use the figlet npm package to convert songName text to art/drawing.
    figlet(songName, function(err, data) {
        if (err) {
        console.log("Something went wrong...");
        console.dir(err);
        return;
        }
        console.log(data);
    });

    //Use the Spotify package to search for a song/track. Set search results limit to 10.
    spotify.search({ type: "track", query: songName, limit: 10 }, function(
        err,
        data
    ) {
        //If there is an error, log it.
        if (err) {
        return console.log("Error occurred: " + err);
        }

        // JSON.stringify to print the data in string format.
        // JSON.stringify argument of "2" to make the format pretty.
        //console.log(JSON.stringify(data, null, 2));

        //If no song is provided, then the app will default to "The Waiting" by Tom Petty.
        if (songName === "The Waiting") {
        //output the default song information
        var defaultSong =
            //Output the artist
            "Artist: " +
            data.tracks.items[5].artists[0].name +
            "\r\n" +
            //Output the song's name.
            "Song title: " +
            data.tracks.items[5].name +
            "\r\n" +
            //Output a preview link of song from Spotify.
            "Preview song: " +
            data.tracks.items[5].preview_url +
            "\r\n" +
            //Output the album that  song is from.
            "Album: " +
            data.tracks.items[5].album.name +
            "\r\n";

        //Output default song info to terminal
        console.log(defaultSong);
        console.log(addedToLogFile);
        //Output default song info to log.txt file.
        logData(defaultSong);
        logData(
            "=========================================================================="
        );
        }

        //If song name is provided, output first 10 songs with that name.
        else {
        console.log("Top 10 songs on Spotify with the name, " + songName);
        logData("Top 10 songs on Spotify with the name, " + songName);
        //Loop through the JSON data to display the top songs.
        for (var i = 0; i < data.tracks.items.length; i++) {
            var trackInfo = data.tracks.items[i];

            //Create variable for song preview link.
            var previewSong = trackInfo.preview_url;
            //If the song preview is null (not available), tell the user that the song preview is not available.
            if (previewSong === null) {
            previewSong = "Song preview is not available for this song.";
            }
            //output the song results.
            var songResults =
            //Line break to keep log.txt file clean and organized.
            "==========================================================================" +
            "\r\n" +
            //Display song number for each song. For example, the first song returned will be Song #1, etc.
            "Song #" +
            (i + 1) +
            "\r\n" +
            //Output artist
            "Artist: " +
            trackInfo.artists[0].name +
            "\r\n" +
            //Output song's name.
            "Song title: " +
            trackInfo.name +
            "\r\n" +
            //Output a preview link of song from Spotify.
            "Preview song: " +
            previewSong +
            "\r\n" +
            //Output the album that song is from.
            "Album: " +
            trackInfo.album.name +
            "\r\n" +
            //Line break to keep log.txt file clean and organized.
            "==========================================================================";

            //This will display song info.
            console.log(songResults);
            //Display song info in log.txt file.
            logData(songResults);
        }
        }
    });
}

//doWhatItSays function...
//If the liriCommand is do-what-it-says, take the text inside of random.txt and then use it to run spotify-this-song for "I want it that way."
function doWhatItSays() {
    //This code will read from the random.txt file.
    // It's important to include the "utf8" parameter or the code will provide stream data (garbage)
    // The code will store the contents of the reading inside the variable "data"
    fs.readFile("random.txt", "utf8", function(error, data) {
        // If the code experiences any errors it will log the error to the console.
        if (error) {
        return console.log(error);
        }
        // We will then print the contents of data
        //console.log(data);

        // Then split it by commas (to make it more readable)
        var songdataArray = data.split(",");

        // We will then re-display the content as an array.
        //console.log(songdataArray);
        //console.log(songdataArray[1]);
        //Call the getSongInfo function to display the song info for "I want it that way."
        getSongInfo(songdataArray[1]);
    });
}

//Output the data to a .txt file called log.txt.
function logData(logResults) {
  //Append the contents to file
  // If the file didn't exist then it gets created on the fly.
    fs.appendFile("log.txt", logResults + "\r\n", function(err) {
        if (err) {
        console.log(err);
        }

        // If no error, we'll log the phrase "Content Added" to our node console.
        else {
        //console.log("Content Added!");
        }
    });
}

//Function to show command line help.
function showHelp() {
  //Use figlet npm package to convert text to art/drawing.
    figlet("LIRI help", function(err, data) {
        if (err) {
        console.log("Something went wrong...");
        console.dir(err);
        return;
        }
        console.log(data);
    });
    var helpInfo = "Usage: node liri.js <command> [arguments]";
    var helpColumns = [
        {
        Command: "movie-this [movie_name]",
        Description:
            "Shows information about the specifid movie. If no movie is specified, Mr. Nobody is displayed by default."
        },
        {
        Command: "spotify-this-song [song_name]",
        Description:
            "Shows top 10 songs on Spotify that have specified name. If no song is specified, The Waiting by The Mowgli's is displayed by default."
        },
        {
        Command: "do-what-it-says",
        Description:
            "Shows the top 10 songs on Spotify for the song, 'I want it that way.'"
        }
    ];
    console.log(
        "=================================================================================================="
    );
    console.log(helpInfo);
    console.log(
        "=================================================================================================="
    );
    console.log(helpColumns);
}