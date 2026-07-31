//---------- DOM Element ----------

const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const loading = document.getElementById("loading");
const newsContainer = document.getElementById("newsContainer");
const favouritesBtn = document.getElementById("favouritesBtn");
const homeBtn = document.getElementById("homeBtn");

//--------------API Configuration -------------

const API_KEY = "pub_7337feda015544f395760fb56b6097b5";
const BASE_URL = "https://newsdata.io/api/1/latest";

// ---------------- Favourite news save ---------------

let favourites = JSON.parse(localStorage.getItem("favourites")) || [];
let isFavouriteScreen = false;

//------------- Category buttons -----------------

const categoryBtns = document.querySelectorAll(".category-btn");

//------------- category buttons events ----------------

categoryBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
        
        isFavouriteScreen =false;

        homeBtn.classList.remove("active");

        categoryBtns.forEach((btn) => {
            btn.classList.remove("active");
        });
        btn.classList.add("active");

        const category = btn.dataset.category;
        getCategoryNews(category);
    });
});

// ---------------- Display News ----------------

function displayNews(newsArray) {
    newsContainer.innerHTML = "";

    newsArray.forEach((news) => {

        const card = document.createElement("div");
        card.classList.add("news-card");

        const content = document.createElement("div");
        content.classList.add("news-content");

        const cardFooter = document.createElement("div");
        cardFooter.classList.add("card-footer");

// ---------------- Image Card ---------------------
    
         const img = document.createElement("img");

        if (news.image_url) {
            
            img.src = news.image_url;
            
        }

        else{
             
             img.src = "default.jpg";
            
        }

        img.onerror = () => {
            img.src = "default.jpg";
        };

        card.appendChild(img);

//---------------- News Title ----------------        

        const h2 = document.createElement("h2");
        h2.innerText = news.title;

// -------------- News description ------------        

        const p = document.createElement("p");
        p.innerText = news.description;

// ------------- News Source Name -------------        

        const source = document.createElement("p");
        source.innerText = `📰 ${news.source_name}`;

//----------------- Date fecthure --------------

        const date = new Date(news.pubDate);

        const months = [
            "Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ] 

        const day = date.getDate();
        const month = months[date.getMonth()];
        const year = date.getFullYear();

        const formattedDate = `${day} ${month} ${year}`;

        const dateText = document.createElement("p");

        dateText.innerText = `📅 ${formattedDate}`; 

//------------- Favourite News Save ------------

        const favBtn = document.createElement("button");
        favBtn.innerText = "❤️ Favourite";

        const existingNews = favourites.find((item) => {
            return item.link === news.link;
        });

        if (existingNews) {
            favBtn.innerText = "💖 Remove Favourite";
        }

        favBtn.addEventListener("click", () => {

            const existingNews = favourites.find((item) => {
                return item.link === news.link;
            });

            if (!existingNews) {
                favourites.push(news);

                favBtn.innerText = "💖 Remove Favourite";

                localStorage.setItem("favourites", JSON.stringify(favourites));

                updateFavouriteCount();
            }
            else {
                favourites = favourites.filter((item) => {
                    return item.link !== news.link;
                });
                localStorage.setItem("favourites", JSON.stringify(favourites));

                favBtn.innerText = "❤️ Favourite";

                updateFavouriteCount();

                if(isFavouriteScreen) {
                    displayNews(favourites);
                }
            }
            
            
        });
        
//-------------- For Link See More -----------------        

        const link = document.createElement("a");
        link.href = news.link;
        link.innerText = "Read More";
        link.target = "_blank";

//-------------- All child Append -----------------        

        content.appendChild(h2);
        content.appendChild(p);
        content.appendChild(source);
        content.appendChild(dateText);
        cardFooter.appendChild(favBtn)
        cardFooter.appendChild(link);
        content.appendChild(cardFooter);


        card.appendChild(content);
        newsContainer.appendChild(card);
    });
}

// -------------------- Favourite Count ---------------

function updateFavouriteCount() {
    favouritesBtn.textContent = `❤️ Favourites (${favourites.length})`;
}

//-------------- Chek No News ------------------

    function checkNoNews(data) {
            if (!data.results || data.results.length === 0) {
                newsContainer.innerHTML = "<h2>No News Found</h2>";
                return true;
            }

            return false;
        }

// ---------------- Search News ----------------

async function getNews(searchText) {

    loading.style.display = "block";

    try {

        let url;

        if (searchText) {
            url = `${BASE_URL}?apikey=${API_KEY}&q=${searchText}&country=in&language=en`;
        } else {
            url = `${BASE_URL}?apikey=${API_KEY}&country=in&language=en`;
        }

        const response = await fetch(url);
        const data = await response.json();

        loading.style.display = "none";
        
        if (checkNoNews(data)) {
            loading.style.display = "none";
            return;
        }

        displayNews(data.results);

    } catch (error) {
        console.log(error);
        loading.innerText = "";
    }
}

// ---------------- Category News ----------------

async function getCategoryNews(category) {

    
    loading.style.display = "block";
    

    try {

        const url = `${BASE_URL}?apikey=${API_KEY}&category=${category}&country=in&language=en`;

        const response = await fetch(url);
        const data = await response.json();

        loading.style.display = "none";

        if (checkNoNews(data)) {
            loading.innerText = "";
            return;
        }

        displayNews(data.results);

    } catch (error) {
        console.log(error);
        loading.style.display = "none";
    }
}

// ---------------- Default News ----------------

getNews();

updateFavouriteCount();

function searchNews() {
    isFavouriteScreen = false;

    const searchText = searchInput.value;

    if (searchText === "") {
        alert("Please enter a search term");
    } else {
        getNews(searchText);
    }
}

// --------------- Home Return ---------------

homeBtn.addEventListener("click", () => {

    isFavouriteScreen = false;

    categoryBtns.forEach((btn) => {
        btn.classList.remove("active");
    });

    homeBtn.classList.add("active");

    getNews();
})

//----------------- Favourite news --------------

favouritesBtn.addEventListener("click", () => {
    isFavouriteScreen = true;

    homeBtn.classList.remove("active");

    categoryBtns.forEach((btn) => {
        btn.classList.remove("active");
    });
    displayNews(favourites);
})


// ---------------- Search Button ----------------

searchBtn.addEventListener("click", searchNews);




searchInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        searchNews();
    }
});

