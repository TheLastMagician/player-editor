<template>
  <div class="d-flex flex-row justify-space-between px-4">
        <v-tooltip large height="50" activator="parent" right>{{title}}</v-tooltip>
        <v-spacer></v-spacer>
      <figure :class="className">
      <img  :src="url" style="display:block;" @click="emitChange">
      </figure>
  </div>
</template>

<script>
  export default {
    data(){
      return{
      }
    },
    props: {
      name: String,
      icon: String,
      desc: String,
      ch18: String,
      unlock:{
          type:Boolean,
          default:true,
      },
    },
    computed:{
      className(){
          if (this.unlock){
              return "unlock";
          }else{
              return "lock"
          }
      },
      url(){
        return "/player-editor/telenticon/"+this.icon
      },
      title(){
        return '天赋名:'+this.ch18 +'   天赋描述:' + this.desc
      }
    },
    methods: {
      emitChange(){
          if (this.unlock){
             this.$emit('deleteTelent', this.name,this.ch18)
          }else{
              this.$emit('addTelent', this.name,this.ch18)
          }
      }
    },
  }
</script>

<style scoped>
  .name {
    display: inline-block;
  }
  .unlock {
      cursor: pointer;
      position: relative;
      -webkit-filter: contrast(90%) brightness(110%);
      filter: contrast(90%) brightness(110%);
  }
  .unlock::before {
      content: "";
      display: block;
      height: 100%;
      width: 100%;
      top: 0;
      left: 0;
      position: absolute;
      pointer-events: none;
      mix-blend-mode: overlay;
      background:  rgba(6, 247, 0, 0.25);
  }
  .lock {
      cursor: pointer;
      position: relative;
      -webkit-filter: contrast(90%) brightness(110%);
      filter: contrast(90%) brightness(110%);
  }
  .lock::before {
      content: "";
      display: block;
      height: 100%;
      width: 100%;
      top: 0;
      left: 0;
      position: absolute;
      pointer-events: none;
      mix-blend-mode: overlay;
      background:  rgba(161, 183, 161, 0.25);
  }
</style>
