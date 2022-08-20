
import Remon from '@remotemonster/sdk'

class RemoteMonster {
   remotemonster = null;
   peerconnection = null;

   config = {
   config : {
      // dev:{
      //    logLevel: 'DEBUG' // SILENT, ERROR, WARN, INFO, DEBUG, VERBOSE 순으로 로그 레벨을 설정
      // },
      credential: {
         serviceId: 'a89a8f14-75bc-43a3-9037-3b0023a0b6fb', // 콘솔에서 획득한 Service ID
         key: '7fa96ed9c2f0ed8ebdad4f9a3f6283fea366f0f7fe52e7978b8bbcfa2b7e199c'               // 콘솔에서 획득한 Service Key
      },
      view: {
         local: '#localVideo', // 로컬(자신) 비디오 태그 지정
         remote: '#remoteVideo', // 리모트(상대방) 비디오 태그 지정
      },
      media: {
         video: {
            width: {max: '640', min: '640'},
            height: {max: '480', min: '480'},
            codec: 'H264',
            frameRate: {max:15, min:15},
            facingMode: 'user',  //user / environment
            // maxBandwidth: '3000'
         },
         audio: {
            channelCount: 2,
            // maxBandwidth: 128,
            autoGainControl: true,
            echoCancellation: true,
            noiseSuppression: true,
         }
         // music: 모든 소리를 가공없이 전달, voice(기본값): 주변 소음을 제거하고 음성을 전달 - 통화에 적합
         // rtc: {audioType: "music"}   
      }
   },
   listener : {
      onInit(token) {
         console.log("token : ", token)   // UI 처리등 Remon 클래스가 초기화 되었을 때 처리하여야 할 작업
      },
      
      onConnect(channelId) {
         console.log("onConnect : ", channelId)
      },
   
      onComplete() {
         console.log("onComplete")
      },
      
      onClose() {
         console.log("onClose 종료")
      },
      async onRoomEvent(evt){      
         let coconfig = {
            config : {
               // dev:{
               //    logLevel: 'DEBUG' // SILENT, ERROR, WARN, INFO, DEBUG, VERBOSE 순으로 로그 레벨을 설정
               // },
               credential: {
                  serviceId: 'a89a8f14-75bc-43a3-9037-3b0023a0b6fb', // 콘솔에서 획득한 Service ID
                  key: '7fa96ed9c2f0ed8ebdad4f9a3f6283fea366f0f7fe52e7978b8bbcfa2b7e199c'               // 콘솔에서 획득한 Service Key
               },
               view: {
                  local: '#localVideo', // 로컬(자신) 비디오 태그 지정
                  remote: '#remoteVideo', // 리모트(상대방) 비디오 태그 지정
               },
               media: {
                  video: true,
                  audio: true
                  // music: 모든 소리를 가공없이 전달, voice(기본값): 주변 소음을 제거하고 음성을 전달 - 통화에 적합
                  // rtc: {audioType: "music"}   
               }
            }
         }
         console.log('event type: '+ evt.event); // join(새로운 참여자 입장 시) 또는 leave(기존 참여자 퇴장 시)
         console.log('channel id: '+ evt.channel.id); // 입장 또는 퇴장한 참여자의 ID
         if(evt.event === 'join') {
           console.log("join remoteMonster init onRoomEvent")
           const newVideo = document.createElement('video');
           const otherVideos = document.getElementById("videoMain")
           newVideo.id = evt.channel.id;
           newVideo.autoplay = true;
 
           // //원하는 위치에 비디오를 추가
           await otherVideos.appendChild(newVideo);
 
           //config에 비디오 태그를 지정
           coconfig.config.view.remote = `#uRemote01`;
           console.log("cocofing", JSON.stringify(coconfig))
           const remon = new Remon(coconfig);
           remon.joinCast(evt.channel.id);
         }
         else if(evt.event === 'leave') {
           //퇴장 시 참여자 비디오 태그 삭제 
           console.log("leave remoteMonster init onRoomEvent")
         //   let video = document.getElementById(evt.channel.id);
         //   otherVideos.removeChild(video);
         }
      },
      onMessage(msg){
         console.log("메시지 도착", msg)
      }
   }
   }
   

  constructor() {

  }

  init() {
   try {
      this.remotemonster = new Remon(this.config)
   } catch(e){
      console.log("init error : ", e)
   }
  }

  async caller(channelId) {
    console.log("caller실행");
    await this.remotemonster.connectCall(channelId);

    this.peerconnection = this.remotemonster.context.peerConnection;
    if (this.peerconnection) {
      this.setPeerconnectionHandler();
    }
  }

  async callee(channelId) {
    console.log("callee실행");
    await this.remotemonster.connectCall(channelId);

    this.peerconnection = this.remotemonster.context.peerConnection;
    if (this.peerconnection) {
      this.setPeerconnectionHandler();
    }
  }

  callClose(){
   console.log("callClose실행")
   this.remotemonster.close()
  }

  muteLocalAudio(status){
   console.log("muteLocalAudio", status)
   this.remotemonster.muteLocalAudio(status)
  }
  async roomList(){
   const roomList = await this.remotemonster.fetchCalls()
   roomList.forEach((call) => {
      if(call.status === 'WAIT'){
         // 통화 대기중 상태로, Caller는 입장했으나 Callee가 입장하지 않은 상태
         console.log("방조회 wait : ", JSON.stringify(call))
      } else if (call.status === 'COMPLETED') {
         // 통화 연결이 완료된 상태로 발신자와 Callee가 모두 입장하여 통화가 연결된 상태
         console.log("방조회 complete : ", JSON.stringify(call))
      }
   })
  }

  // 호스트방 리스트 조회
  async hostRoomList(hostRoomId){
   var searchResult= await this.remotemonster.fetchRooms(hostRoomId); 
   searchResult.forEach( ({id}, i) => {
     console.log("호스트방에 있는 사람들 아이디 : ", id, i)
     const newVideo = document.createElement('video');
     newVideo.id = id;
     newVideo.autoplay = true;
      
     // //원하는 위치에 비디오를 추가
     // otherVideos.appendChild(newVideo);
  
     // //config에 비디오 태그를 지정
     this.config.config.view.remote = `#${newVideo.id}`;
     console.log("cocofing", JSON.stringify(this.config))
     const remon = new Remon(this.config)
     console.log("remon", remon)
     remon.joinCast(id);
     console.log("error", JSON.stringify(this.config))
   })
 }

 setPeerconnectionHandler() {
  // connectionstatechange
  this.peerconnection.addEventListener("connectionstatechange", () => {
    console.log(
      `connectionstatechange: ${this.peerconnection.connectionState}`
    );
  });

  // iceconnectionstatechange
  this.peerconnection.addEventListener("iceconnectionstatechange", () => {
    console.log(
      `iceconnectionstatechange: ${this.peerconnection.iceConnectionState}`
    );
  });

  // iceconnectionstatechange
  this.peerconnection.addEventListener("iceconnectionstatechange", () => {
    console.log(
      `iceconnectionstatechange: ${this.peerconnection.iceGatheringState}`
    );
  });

  // signalingstatechange
  this.peerconnection.addEventListener("signalingstatechange", () => {
    console.log(
      `signalingstatechange: ${this.peerconnection.signalingState}`
    );
  });

  // get stats
  const interval = 10;
  let bytesReceived = 0;
  let bytesSent = 0;
  let outboundBitrate = 0;
  let inboundBitrate = 0;
  setInterval(async () => {
    const stats = await this.peerconnection.getStats(); // 브라우저마다 다를 수 있으니 확인 필요.
    stats.forEach((report) => {
      if (report.type === "inbound-rtp" && report.kind === "video") {
        inboundBitrate = parseInt(
          ((report.bytesReceived - bytesReceived) * 8) / interval
        );
        bytesReceived = report.bytesReceived;
      }
      if (report.type === "outbound-rtp" && report.kind === "video") {
        outboundBitrate = parseInt(
          ((report.bytesSent - bytesSent) * 8) / interval
        );
        bytesSent = report.bytesSent;
      }
    });

    console.log(
      `stats: outbound bitrate:${outboundBitrate} inbound bitrate:${inboundBitrate}`
    );
  }, interval * 1000);
}

  async createRoom(hostRoomId){
   this.remotemonster.createRoom(hostRoomId)
   await this.hostRoomList(hostRoomId)
  }

  async joinRoom(hostRoomId){
   console.log("호스트 방", hostRoomId)
   await this.hostRoomList(hostRoomId)
   // this.remotemonster.connectCall(hostRoomId)
  }

  sendMsg(text) {
   this.remontemonster.sendMessage(text)
  }
}  

export default new RemoteMonster
