
const sheetUrl = "https://spreadsheets.google.com/feeds/list/19ymeQL2Ik1JoEMiFa3sODu3H41IoEB5WhTZbjuK-OP4/1/public/values?alt=json"
 //The array which we will put the data in.
 let googleSheet = [];
 let dateArray = []; 
 let titleArray = []; 
 let imagesArray =[];
 let links = []; 
 let writersArray = [];
 let newsNumber = 0; 

//Number of latest news you want to show. 

let params = { method:'get','url':sheetUrl}
$(document).ready(function(){
  searchForMyNews(); 
      setInterval(() => {
        //check for news every 5 seconds [ change to preferred time interval]
        searchForMyNews();
      }, 5000);

}); 

//Fetching Google Sheet
searchForMyNews =()=>{
  
  $.ajax(params)
    .then(function(data){
      //reset the arrays
        googleSheet = [];
        dateArray = []; 
        titleArray = []; 
        imagesArray = [];
        links = [];
        writersArray = [];
        googleSheet = data.feed.entry ? data.feed.entry.reverse() : [];
         
        for (var i = 0; i < googleSheet.length; i += 1){
            dateArray.push(googleSheet[i].gsx$date.$t);
            titleArray.push(googleSheet[i].gsx$title.$t);
            imagesArray.push(googleSheet[i].gsx$image.$t);
            links.push(googleSheet[i].gsx$link.$t);
            writersArray.push(googleSheet[i].gsx$writer.$t);
        }  
        newsNumber = googleSheet.length > 3 ? 3 : googleSheet.length;
        //Trigger initialize content
        updateHtml();

    }).fail(function(){
        //If loading is not successful....
        console.log("Oh no, Can't load Google Docs!");
    })
}

updateHtml= () =>{
  //remove old data
 
  if(document.getElementById("pong-paper")){
    document.getElementById("pong-paper").remove(); 
  }
  
    //recreate the removed div
    var bigDiv = document.getElementById("sheetUpdate");
    var container = document.createElement('div');
   
   
    container.id = "pong-paper";
    for(var i = 0 ; i< newsNumber ; i++){ 
        var outerLayer = document.createElement('div');
        outerLayer.className = "block-21 mb-5 d-flex"; 
        var metaDiv = document.createElement('div'); 
        var textDiv = document.createElement('div'); 
        textDiv.className="text";
        metaDiv.className = "meta";  
        createImage(outerLayer,imagesArray[i]);
        createLink(textDiv,links[i],titleArray[i]);
        createDate(metaDiv,dateArray[i]); 
        createWriter(metaDiv,writersArray[i]);
        
        //put everything in a parent div 
        textDiv.appendChild(metaDiv);
        outerLayer.appendChild(textDiv);
        container.appendChild(outerLayer);
        bigDiv.appendChild(container, writersArray[i]);
    }
}

createImage = (parentContainer,src)=>{
  let img = document.createElement('img'); 
  img.className = "blog-img mr-4";  
  img.src=src;
  //img.style.backgroundImage = "url('"+src+"')";
  parentContainer.appendChild(img);
}

createLink = (parentContainer,url, title)=>{
  let h3 = document.createElement('h3');
  h3.className ="heading";
  let link = document.createElement('a'); 
  link.className=""; 
  link.target = "_blank"; 
  link.href = url;
  link.appendChild(document.createTextNode(title)); 
  h3.appendChild(link);
  parentContainer.appendChild(h3);
}

createDate = (parentContainer,date)=>{
  //anchor, span 
  let dateNode = document.createElement('div');
  dateNode.style.color = "white";
  dateNode.appendChild(document.createTextNode(date)); 
  parentContainer.appendChild(dateNode); 
  
}

createWriter =(parentContainer, writerName) =>{
  let name = document.createElement('div');
  name.style.color = "white";
  name.appendChild(document.createTextNode(writerName)); 
  parentContainer.appendChild(name); 
}
