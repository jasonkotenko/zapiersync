var Zap = {
    dvd_releases_post_poll: function(bundle) {
        return movie_post_poll(bundle);
    },
    
    opening_post_poll: function(bundle) {
        return movie_post_poll(bundle);
        //testing a change
    }
};


var movie_post_poll = function(bundle) {
    var data;
    try {
        data = JSON.parse(bundle.response.content);
    } catch(e) {
        throw new ErrorException('Oops! The response from the API was not what we expected. The specific error was:\n' + e);
    }
    
    //Uncomment this line to test similar movie logic (see comment above the function first)
    //return simplify_abridged(retrieve_similar(data, bundle));
    return simplify_abridged(data);
};


var simplify_abridged = function(data) {
    
    for (var i = 0; i < data.movies.length; i++) {
        movie = data.movies[i];
        var cast = [];
        for (var j = 0; j < movie.abridged_cast.length; j++) {
            cast.push(movie.abridged_cast[j].name);
        }
        movie.abridged_cast = cast;
    }
    
    return data;
};


// Turns out that new movies in Rotten Tomatoes have no similar movies defined, so
// even if we could make this execute only after filters are applied, it wouldn't 
// be worth it.  Current test triggers show no similar movies.
var retrieve_similar = function (data, bundle) {
    
    for (var i = 0; i < data.movies.length; i++) {
        movie = data.movies[i];
        
        var request = {
          method: 'GET',
          url: movie.links.similar,
          params: {
              apikey: bundle.auth_fields.apikey
          },
          headers: {
            Accept: 'application/json'
          },
          auth: null,
          data: null
        };
        
        var similar;
        try {
            response = z.request(request);
            similar = JSON.parse(response.content);
        } catch (e) {
            throw new ErrorException('Oops! The response from the API was not what we expected. The specific error was:\n' + e);
        }
        
        
        var similar_list = [];
        //It appears that JSON.parse is returning undefined for an empty list here, so must check if movies is even an array
        for (var j = 0; $.isArray(similar.movies) && j < similar.movies.length; j++) {
            similar_list.push(similar.movies[j].title);
        }
        
        movie.similar_movies = similar_list;
    }
    
    return data;
 };