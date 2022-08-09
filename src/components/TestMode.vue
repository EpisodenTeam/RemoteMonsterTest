<template>
  <div class="video" id="videoMain">
    <!-- Local View(자신의 화면) -->
    <video class="local" id="localVideo" playsinline autoplay :muted="localMuteStatus"></video>
    <!-- Remote View(상대방의 화면) -->
    <video id="remoteVideo" playsinline autoplay></video>
    <video id="uRemote01" playsinline autoplay></video>
    <button @click="caller()">전화걸기</button>
    <button @click="callee()">전화받기</button>
    <button @click="callClose()">통화종료</button>
    <button @click="callLocalMute()">음소거</button>
    <button @click="checkRoomList()">방조회</button>
    <button @click="sendMsg()">메세지</button>
  </div>
</template>
<script>
import RemoteMonster from '../js/RemoteMonster'

export default {
  name: 'TestMode',
  props: {
    
  },
  data(){
    return{
      room_id : 'evt_701_004',
      localMuteStatus : true
    }
  },
  methods: {
    async caller(){
      await RemoteMonster.init()
      await RemoteMonster.caller(this.room_id)
    },
    async callee(){
      await RemoteMonster.init()
      await RemoteMonster.callee(this.room_id)
    },
    async callClose(){
      await RemoteMonster.callClose()
    },
    async callLocalMute(){
      this.localMuteStatus = !this.localMuteStatus
      await RemoteMonster.muteLocalAudio(this.localMuteStatus)
    },
    checkRoomList(){
      RemoteMonster.roomList()
    },

    async joinHostRoom(){
      await RemoteMonster.init()
      await RemoteMonster.createRoom(this.room_id)
    },
    async joinRoom(){
      await RemoteMonster.init()
      await RemoteMonster.joinRoom(this.room_id)
    },
    sendMsg() {
      RemoteMonster.sendMsg("너에게 닿기를")
    }
  }
}
</script>
<style scoped>
.video .local {
  transform: rotateY(180deg);
  -webkit-transform:rotateY(180deg); /* Safari and Chrome */
  -moz-transform:rotateY(180deg); /* Firefox */
}
</style>
