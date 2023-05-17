
let movieTemplate = Handlebars.compile(`
    <img onclick="getMovieDetails('{{imdbID}}')" src="{{Poster}}" alt="{{Title}}"/>
    <div class='right'>
        <h3 class='title'>{{Title}}</h3>
        <h4 class='titleYear'>({{Year}})</h4>
    </div>
    <button class='btnInfo' onclick="getMovieDetails('{{imdbID}}')">Details</button>
`);

let movieDetailsTemplate = Handlebars.compile(`
    <h1>{{Title}} ({{Year}})</h1>
    <div class='block'>
        <img class='imgDet' src="{{Poster}}" alt="{{Title}}"/>
        <div class='listItem'>
            <div class='list'>
                <h3>Released:</h3>
                <p>{{Released}}</p>
            </div>
            <div class='list'>
                <h3>Genre:</h3>
                <p>{{Genre}}</p>
            </div>
            <div class='list'>
                <h3>Country:</h3>
                <p>{{Country}}</p>
            </div>
            <div class='list'>
                <h3>Director:</h3>
                <p>{{Director}}</p>
            </div>
            <div class='list'>
                <h3>Writer:</h3>
                <p>{{Writer}}</p>
            </div>
            <div class='list'>
                <h3>Actors:</h3>
                <p>{{Actors}}</p>
            </div>                
            <div class='list'>
                <h3>Awards:</h3>
                <p>{{Awards}}</p>
            </div>
            <div class='list'>
                <h3>Box Office:</h3>
                <p>{{BoxOffice}}</p>
            </div>
            <div class='list'>
                <h3>Runtime:</h3>
                <p>{{Runtime}}</p>
            </div>
            <div class='list'>
                <h3>Plot:</h3>
                <p>{{Plot}}</p>
            </div>
        </div>
    </div>
`);
