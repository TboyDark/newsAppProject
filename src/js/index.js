import '../css/style.css';
import _ from 'lodash';
import axios from 'axios';
import { initializeApp } from "firebase/app";


const firebaseConfig = {
    apiKey: process.env.API_KEY,
    authDomain: process.env.AUTH_DOMAIN,
    projectId: process.env.PROJECT_ID,
    storageBucket: process.env.STORAGE_BUCKET,
    messagingSenderId: process.env.MESSAGING_SENDER_ID,
    appId: process.env.APP_ID,        
};
const app = initializeApp(firebaseConfig);


let c= 1;
function fetchData(c){
    axios.get(process.env.HACKER_NEWS_URL)
    .then(response => {
        let newsDisplayed = response.data; 
        let newsContainer = document.createElement("div");
        let containerAll = document.createElement("div");
        containerAll.className = "containerAll";
        newsContainer.className = "containerNews";
        document.body.append(containerAll);
        containerAll.append(newsContainer);
        let i;
        for(i=(c*10)-10; i < 10*c && i < newsDisplayed.length; i++){
            axios.get(process.env.TITLE_NEWS_URL + newsDisplayed[i] + '.json')
            .then(response=>{
                let detailedNews = response.data;                                   
                let titleNews = document.createElement("h2");
                let linkNews = document.createElement("a");
                let dateNews = document. createElement("p");
                let dateTranslator = new Date(_.get(detailedNews, 'time')*1000);
                let hours = dateTranslator.getHours();
                let minutes = "0" + dateTranslator.getMinutes();
                let seconds = "0" + dateTranslator.getSeconds();
                let formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
                linkNews.className = 'linkNews';
                linkNews.setAttribute("target","_blank");
                linkNews.setAttribute("rel","noopener noreferrer")
                dateNews.className = 'dateNews';                      
                titleNews.className = 'newsTitle';
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
                if(i==500){button.style.display = "none";}
            })
            .catch(error => {
                throw(error)
            });
        };    
    })
    .catch(error => {
        throw(error)
    }); 
}
fetchData(c);
let button = document.createElement("button");
button.innerHTML = "Load More";
button.className = 'LoadMoreNews';
document.body.insertAdjacentElement("afterend", button);
button.onclick = function(){
    c=c+1;
    fetchData(c);     
};

