window.onload = () => {
    const socket = new WebSocket('wss://twilio-d-id-service.onrender.com');
    
    socket.addEventListener('open', (event) => {
        console.log("conectado al socket");
    });

    socket.addEventListener('message', (event) => {
        const data = JSON.parse(event.data);
        switch (data.type) {
            case "message": addMessageToChat(data); break;
            case "videoUrl": loadVideo(data); break;
            case "generating-video": console.log("generando video"); break;
            case "video-generated": console.log("video generado"); break;
            case "error": console.log(data); break;
        }
    });

    socket.addEventListener('close', (event) => {
        console.log("conexion cerrada");
    });

    socket.addEventListener('error', (event) => {
        console.log("error");
    });
}

const videoRep = document.getElementById('video-rep');
const autoRepButton = document.getElementById('auto-rep');
videoRep.style.display = 'none';

autoRepButton.addEventListener('click', () => {
    videoRep.autoplay = true;
    autoRepButton.disabled = true;
})
function addMessageToChat(message){
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




  


