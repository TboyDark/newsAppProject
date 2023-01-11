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
function fetchData(size){
    axios.get(process.env.HACKER_NEWS_URL)
    .then(response => {
        let newsDisplayed = response.data;        
        containerAll.append(newsContainer);
        _(newsDisplayed).slice(0, size).forEach((n)=>{
            fetchNewsData(n);
        });    
    })
    .catch(error => {
        alert(error);
    }); 
};

function fetchNewsData(array){
   return axios.get(process.env.TITLE_NEWS_URL + array + '.json')
    .then(response=>{                
        let detailedNews = response.data;                
        let titleNews = document.createElement("h2");
        let linkNews = document.createElement("a");
        let dateNews = document. createElement("p");
        linkNews.className = 'linkNews';
        linkNews.setAttribute("target","_blank");
        linkNews.setAttribute("rel","noopener noreferrer")
        dateNews.className = 'dateNews';                      
        titleNews.className = 'newsTitle';
        let formattedTime = dateTranslator(detailedNews);
        titleNews.innerHTML = "•   " + _.get(detailedNews, 'title');
        if(_.get(detailedNews,"url") == undefined){
             linkNews.innerHTML = "";
        }
        else{
            linkNews.innerHTML =  "         " + "News link";
            linkNews.href = _.get(detailedNews, 'url');
        }
        dateNews.innerHTML = "- Date:  " + formattedTime+"   -";
        newsContainer.append(titleNews);
        titleNews.append(dateNews, linkNews);
         })
        .catch(error => {
            alert(error);
        });
}

function dateTranslator(oldDate){
    let dateTranslator = new Date(_.get(oldDate, 'time')*1000);
    let hours = dateTranslator.getHours();
    let minutes = "0" + dateTranslator.getMinutes();
    let seconds = "0" + dateTranslator.getSeconds();
    return hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
}


// DOM manipulation
let newsContainer = document.createElement("div");
let containerAll = document.createElement("div");
containerAll.className = "containerAll";
newsContainer.className = "containerNews";
document.body.append(containerAll);




//html 
let size= 10;
function showData(){
    fetchData(size);
}
showData();

// Button config
let button = document.createElement("button");
button.innerHTML = "Load More";
button.className = 'LoadMoreNews';
document.body.insertAdjacentElement("afterend", button);
button.onclick = function(){    
    fetchData(size);     
};
