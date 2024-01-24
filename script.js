"use strict";

const MOVIEURL = "https://api.tvmaze.com/search/shows?q=girls"
//const MOVIEURL = "https://api.tvmaze.com/shows?q=1"

const addEventOnElements = function(elements,eventType,callback){
    for (const elem of elements) {
        elem.addEventListener(eventType,callback)
    };
}

const searchBox = document.querySelector(".search-box");
const searchToggle = document.querySelectorAll(".search-btn");

addEventOnElements(searchToggle,"click",function(){
    searchBox.classList.toggle("active");
})

const pageContent = document.querySelector(".container")


const fetchData = async() => {
    const data = await fetch(MOVIEURL);
    const json = await data.json();
    //console.log(json);
    heroBanner(json);
    createMovieList(json);
    search(json)
}

const heroBanner = (value) => {
    //console.log(value)
    const banner = document.createElement("section");
    banner.classList.add("banner");
    banner.ariaLabel = "Popular Movies";
    banner.innerHTML = `
    <div class="banner-slider"></div>

    <div class="slider-control">
        <div class="control-inner">
        </div>
    </div>
    `

    let controlItemIndex = 0;

    value.map((val)=>{
        const img = "https://wallpapers.com/images/hd/avengers-endgame-mghdp4gaqzu4q4us.jpg"
        let {name,genres,rating,image,summary,language} = val.show
        const sliderItem = document.createElement("div")
        sliderItem.classList.add("slider-item")
        sliderItem.setAttribute("slider-item","")
        sliderItem.innerHTML = `
        <img
            src="${image?.original || img}"
            alt="${name}"
            class="img-cover"
            loading="eager"
        />
        <div class="banner-content">
            <h2 class="heading">${name}</h2>
            <div class="meta-list">
                <div class="meta-item">${language}</div>
                <div class="meta-item card-badge">${rating.average || 7.5}</div>
            </div>
            <p class="genre">${genres.join(", ")}</p>
            <h4 class="banner-text">${summary}</h4>
            <a href="" class="btn">
                <i class="fa-solid fa-play"></i>
                <span class="span">Watch Now</span>
            </a>
        </div>
        `

        banner.querySelector(".banner-slider").appendChild(sliderItem);

        const controlItem = document.createElement("button")
        controlItem.classList.add("poster-box", "slider-item")
        controlItem.setAttribute("slider-control", `${controlItemIndex}`)

        controlItemIndex++;

        controlItem.innerHTML = `
            <img
            src="${image?.original || img}"
            alt="${name}"
            loading="lazy"
            draggable="false"
            class="img-cover"
            />
        `;
        banner.querySelector(".control-inner").appendChild(controlItem);

    })

    pageContent.appendChild(banner);

    addSlider();

    
}

const addSlider = () => {
    const sliderItems = document.querySelectorAll(".slider-item")
    const sliderControls = document.querySelectorAll(".slider-control")
    let lastSliderItem = sliderItems[0]
    let lastSliderControl = sliderControls[0]
    
    lastSliderItem.classList.add("active")
    lastSliderControl.classList.add("active")

    // const sliderStart = function(){

    //     lastSliderItem.classList.remove("active")
    //     lastSliderControl.classList.remove("active")

    //     sliderItems[Number(this.getAttribute("slider-control"))].classList.add("active");
    //     this.classList.add("active")

    //     //lastSliderItem = sliderItems[Number(this.getAttribute("slider-control"))];
    //     lastSliderControl = this;
    // }

    // addEventOnElements(sliderControls, "click", sliderStart)

}

fetchData();


const createMovieList = function(value){
    
    let gens = [ "Drama","Romance","Comedy","Science-Fiction","Crime","Thriller","Supernatural"]
    let result1 = value;
    for(let i=0;i<7;i++){
        let result = []
        for(let k=0; k<result1.length;k++){
            for(let j=0;j<result1[k].show.genres.length;j++){
                //console.log(result1[i].show.genres[j]);
                if(gens[i]=== result1[k].show.genres[j]){
                    result.push(result1[k])
                    break
                }
            }
        }
        //console.log(result)
        const movieListElem = document.createElement("section")
        movieListElem.classList.add("movie-list")
        movieListElem.innerHTML = `
            <div class="title-wrapper">
                <h3 class="title-large">${gens[i]}</h3>
            </div>
    
            <div class="slider-list">
                <div class="slider-inner">
                </div>
            </div>
        `;
    
        for(const val of result){
            const movieCard =  createMoviecard(val);
            movieListElem.querySelector(".slider-inner").appendChild(movieCard)
        }
    
        pageContent.appendChild(movieListElem);   
        
    }

    // movieListElem.innerHTML = `
    // <div class="title-wrapper">
    //     <h3 class="title-large">All Movies</h3>
    // </div>

    // <div class="slider-list">
    //     <div class="slider-inner">
    //     </div>
    // </div>
    // `;

    

    // for(const val of value){
    //     const movieCard = createMoviecard(val)
    //     movieListElem.querySelector(".slider-inner").appendChild(movieCard)
    // }

    // pageContent.appendChild(movieListElem);
}


function search(val){
    //console.log(val);
    const searchWrapper = document.querySelector(".search-wrapper")
    const searchField = document.querySelector(".search-field");

    const searchResultModal = document.createElement("div")
    searchResultModal.classList.add("search-modal")
    document.querySelector("main").appendChild(searchResultModal)

    let searchTimeout ;

    searchField.addEventListener("input",function(){
        console.log(searchField.value.length);
        if(!searchField.value.trim()){
            searchResultModal.classList.remove("active")
            searchWrapper.classList.remove("searching");
            clearTimeout(searchTimeout);
            return;
        }

        searchWrapper.classList.add("searching");
        clearTimeout(searchTimeout);


        searchTimeout = setTimeout(async function(){
            const searchValue = await fetch(`https://api.tvmaze.com/search/shows?q=${searchField.value}`)
            const searchJson = await searchValue.json();
            //console.log(searchJson);
            function mySearchValue(searchJson) {
                searchWrapper.classList.remove("searching")
                searchResultModal.classList.add("active")
                searchResultModal.innerHTML= "";

                searchResultModal.innerHTML=`
                <p class="label">Results for</p>
                <h1 class="heading">${searchField.value}</h1>
                <div class="movie-list">
                    <div class="grid-list">
                    </div>
                </div>
                
                `
                for(const val of searchJson){
                    const movieCard = createMoviecard(val);
                    searchResultModal.querySelector(".grid-list").appendChild(movieCard);

                }

            }

            mySearchValue(searchJson);
        },500) 
    })
}


function createMoviecard(val){
    const img = "https://wallpapers.com/images/hd/avengers-endgame-mghdp4gaqzu4q4us.jpg"
    let {id,name,genres,rating,image,summary,language} = val.show

    const card = document.createElement("div");
    card.classList.add("movie-card");

    card.innerHTML = `
    <figure class="poster-box card-banner">
        <img src="${image?.original || img}" alt="${name}" class="img-cover" loading="eager"/>
    </figure>
    <h4 class="title">${name}</h4>
    <div class="meta-list">
        <div class="meta-item">
            <img
            src="./images/star.png"
            width="20"
            height="20"
            alt="star-rating"
            loading="lazy"
            />
            
            <span class="span">${rating.average || 7.5}</span>
        </div>
    <div class="card-badge">${language}</div>
    <a href="" class="card-btn" title="${name}"></a>
    `

    return card;
}

//search();
