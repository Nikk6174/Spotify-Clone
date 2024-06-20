console.log("lets write js")
let currentSong = new Audio();
let songs;
let currFolder;

// to bring all the songs 
async function getSongs(folder) {
    currFolder = folder;
    let a = await fetch(`http://127.0.0.1:5500/${folder}/`)
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response
    let as = div.getElementsByTagName("a")
    songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1])
        }

    }

    //SHOW ALL THE SONGS IN THE PLAYLIST
    let songUL = document.querySelector(".songList ul")
       
    songUL.innerHTML = ""  
    for (const song of songs) {
            // songUL.innerHTML = songUL.innerHTML + `<li> ${song.replace("%20","  ")} </li>`;
        songUL.innerHTML = songUL.innerHTML + `<li>    
        <img src="images/music.svg" alt="">
        <div class="info">
            <div>${song.replaceAll("%20"," ")}</div>
            <div>Nikk</div>
        </div>
        <div class="playnow">
            <span>play now</span>
            <img src="images/play.svg" alt="">
        </div>  
        </li>`;
    }
    
    //ATTACH AN EVENT LISTENER TO EACH SONG
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e=>{
        e.addEventListener("click", element => {
            console.log(e.querySelector(".info").firstElementChild.innerHTML)
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
    
        })
    })
        
    
}

const playMusic = (track) =>{
    // let audio = new Audio("/songs/" + track)
    currentSong.src = `/${currFolder}/` + track
    currentSong.play()
    play.src = "images/pause.svg"
    document.querySelector(".songinfo").innerHTML = decodeURIComponent(track);
    document.querySelector(".songtime").innerHTML = "00:00/00:00"

}

async function main(){

    //GET LIST OF ALL THE SONGS
    await getSongs("songs/cs")
    console.log(songs)

    //DISPLAY ALL THE ALBUMS PAGE
     

    //ATTACH AN EVENT LISTENER TO PLAY NEXT AND PREVIOUS
    play.addEventListener("click", ()=>{
        if(currentSong.paused){
            currentSong.play()
            play.src = "images/pause.svg"
        }
        else{
            currentSong.pause()
            play.src = "images/play.svg"
        }
    })

    // LISTEN FOR TIME UPDATE EVENT
    currentSong.addEventListener("timeupdate", () => {
        // console.log(currentSong.currentTime, currentSong.duration)
        // Get the current time and duration
        const currentTime = currentSong.currentTime;
        const duration = currentSong.duration;

        // Display the current time and duration
        document.querySelector(".songtime").innerHTML = `${currentTime} / ${duration}`;
        document.querySelector(".circle").style.left = (currentTime/duration)*100 + "%";
    });

    //ADD AN EVENT LISTENER TO SEEK BAR
    document.querySelector(".seekbar").addEventListener("click", e =>{
        let percent = (e.offsetX/e.target.getBoundingClientRect().width)*100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = ((currentSong.duration)*percent)/100

        // getBoundingClientRect() tells where the cursor is on the pageXOffset, the above ConvolverNode, the Nr changes as we click on different location of the seekbar but the Dr is the total width of the seekbar which is constant
    })

    //ADD EVENT LISTENER TO HAMBURGER
    document.querySelector(".hamburger").addEventListener("click", ()=>{
        document.querySelector(".left").style.left = "0"
    })

    //ADD EVENT LISTENER TO CLOSE
    document.querySelector(".close").addEventListener("click", ()=>{
        document.querySelector(".left").style.left = "-100%"
    })

    //ADD AN EVENT LISTENER TO PREVIOUS  AND NEXT
    previous.addEventListener("click", ()=>{
        currentSong.pause()
        console.log("prev clicked")
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if((index-1)>=0){
            playMusic(songs[index-1])
        }
        console.log(index) 
    })

    next.addEventListener("click", ()=>{
        currentSong.pause()
        console.log("next clicked")

        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if((index+1)<songs.length){
            playMusic(songs[index+1])
        }
        console.log(index)        
    })

    //LOAD THE PLAYLIST WHEN CLICKED
    Array.from(document.getElementsByClassName("card")).forEach(e=>{
        e.addEventListener("click", async item =>{
            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)
            console.log(songs)
        })
    })
}

main() 
  
