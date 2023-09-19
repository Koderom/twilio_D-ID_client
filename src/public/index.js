//const { response } = require("express");

window.onload = () => {
    //const socket = new WebSocket('wss://twilio-d-id-service.onrender.com');
    const socket = new WebSocket('wss://twilio-d-id-service.onrender.com');
    //mostrarNotificacion("esto es una prueba");
    socket.addEventListener('open', (event) => {
        console.log("conectado al socket");
    });

    socket.addEventListener('message', (event) => {
        const data = JSON.parse(event.data);
        switch (data.type) {
            case "message": addMessageToChat(data); break;
            case "videoUrl": loadVideo(data); break;
            case "generating-video": mostrarNotificacion("Generando video"); break;
            case "video-generated": mostrarNotificacion("Video generado"); break;
            case "error": mostrarNotificacion(`Error: ${data.error}`); break;
            case "music" : onMusic(data); break;
        }
    });

    socket.addEventListener('close', (event) => {
        console.log("conexion cerrada");
    });

    socket.addEventListener('error', (event) => {
        console.log("error");
    });
}

const videoRep = document.getElementById('my-video');
const autoRepButton = document.getElementById('auto-rep');
//videoRep.style.display = 'none';

autoRepButton.addEventListener('click', () => {
    //videoRep.autoplay = true;
    videojs('my-video', {autoplay: true});
    autoRepButton.disabled = true;
    console.log("se preciono");
})
function addMessageToChat(message){
    mostrarNotificacion("Nuevo mensaje recibido")
    const chat = document.getElementById('messages-container');
    const messageItem = document.createElement('div');
    messageItem.className = 'message';
    messageItem.innerHTML = `<b>+${message.from}(${message.profileName}) : </b> ${message.message}`;
    chat.appendChild(messageItem);
}

function loadVideo(video){
    const presenterImage = document.getElementById('presenter-image');
    const videoContainer = document.getElementById('video-container');
    videoRep.src = video.videoUrl;

    videoRep.oncanplay = (event) => {
        videoRep.style.display = 'block';
        presenterImage.style.display = 'none';
    }
    
    videoRep.onended = () => {
        presenterImage.style.display = 'block';
        videoRep.style.display = 'none';
    };
    videoContainer.addEventListener('click', () => {
        loadVideo(video);
    });
}

function mostrarNotificacion(textoNoticacion){
    const contenedor = document.getElementById('notificacion-container');
    const contenerdor_message = document.getElementById('notificacion-text-container');
    const message = document.getElementById('notificacion');

    message.innerHTML = textoNoticacion;
    contenedor.style.display = 'flex';

    contenerdor_message.addEventListener('click',(event)=>{
        contenedor.style.display = 'none';
    })
}

async function onMusic(data){
    try {
        var myPlayer = videojs('my-video');

        

        console.log("solicitando guardado de cancion");
        const respuesta = await saveFileFromURL(data.url);
        const filename = respuesta.filename;
        const filetype = respuesta.filetype;
        //console.log(`${filename}.${filetype}`);    
        const path = `./storage/${filename}.${filetype}`;

        myPlayer.src({type: 'audio/mpeg', src: `${path}`});

        myPlayer.ready(function() {
            myPlayer.play();
            mostrarNotificacion(`Reproduciendo: ${data.title}`);
        });

        // videoRep.innerHTML = `<source src="${path}" type="audio/mpeg"/>`;
        // console.log(videoRep);
        
    } catch (error) {
        console.log(error);
        mostrarNotificacion(error.message);
    }
    
}
  

// function simularPeticion(musicName){
//     const url = 'http://127.0.0.1:3000/test';
//     const body = {music: 'in the end'};
//     axios.post(url, body);
// }
