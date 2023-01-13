import '../css/style.css';
import _ from 'lodash';
import axios from 'axios';
import { initializeApp } from "firebase/app";


// firebase config for Host
const firebaseConfig = {
    apiKey: process.env.API_KEY,
    authDomain: process.env.AUTH_DOMAIN,
    projectId: process.env.PROJECT_ID,
    storageBucket: process.env.STORAGE_BUCKET,
    messagingSenderId: process.env.MESSAGING_SENDER_ID,
    appId: process.env.APP_ID,        
};
const app = initializeApp(firebaseConfig);


//  Functions
function fetchData(indexArr, sizeArr){
    axios(process.env.HACKER_NEWS_URL)
    .then(response => {        
        let newsDisplayed = response.data;        
        containerAll.append(newsContainer);
        const newsPromise = _(newsDisplayed).slice(indexArr, sizeArr).map(n => fetchNewsData(n));
        Promise.all(newsPromise).then(news => {
            news.forEach(writeNews);
            if (sizeArr == 500) {
                button.style.display = 'none';
            }
        });
    })
    .catch(error => {
        alert("Qualcosa è andato storto! ecco i dettagli: " + error);
    }); 
};

async function fetchNewsData(array){
   try {
        const response = await axios(process.env.TITLE_NEWS_URL + array + '.json');
        return response.data;
    } catch (error) {
        alert("Qualcosa è andato storto! ecco i dettagli: " + error);
    }
};

function dateTranslator(oldDate){
    let dateTranslator = new Date(_.get(oldDate, 'time')*1000);
    let hours = dateTranslator.getHours();
    let minutes = "0" + dateTranslator.getMinutes();
    let seconds = "0" + dateTranslator.getSeconds();
    return hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
};

function writeNews(data){
    let titleNews = document.createElement("h2");
    let linkNews = document.createElement("a");
    let dateNews = document. createElement("p");
    linkNews.className = 'linkNews';
    linkNews.setAttribute("target","_blank");
    linkNews.setAttribute("rel","noopener noreferrer")
    dateNews.className = 'dateNews';                      
    titleNews.className = 'newsTitle';
    let formattedTime = dateTranslator(data);
    titleNews.innerHTML = "•   " + _.get(data, 'title');
    if(_.get(data,"url") == undefined){
        linkNews.innerHTML = "";
    }
    else{
        linkNews.innerHTML =  "         " + "News link";
        linkNews.href = _.get(data, 'url');
    }
    dateNews.innerHTML = "- Date:  " + formattedTime+"   -";
    newsContainer.append(titleNews);
    titleNews.append(dateNews, linkNews);    
};

// DOM manipulation
let newsContainer = document.createElement("div");
let containerAll = document.createElement("div");
containerAll.className = "containerAll";
newsContainer.className = "containerNews";
document.body.append(containerAll);




//main source
let index = 0; 
let size= 10;
fetchData(index, size);


// Button config
let button = document.createElement("button");
button.innerHTML = "Load More";
button.className = 'LoadMoreNews';
document.body.insertAdjacentElement("afterend", button);
button.onclick = function(){ 
    index = size;
    size = size + 10;   
    fetchData(index, size);     
};
