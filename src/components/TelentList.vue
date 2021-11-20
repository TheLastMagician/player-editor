<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">

  <v-container class="grey lighten-5">
    <v-row>
      <v-col
              v-for="j in jobList"
              :key="j.job"
              sm="2"
              align-self="start"
      >
        <v-btn style="font-size:large" height="60" width="130" :value="j.job"  @click="setCurJob" :color="isPrimary(j.job)">
          {{j.ch18}}
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col
              v-for="n in jobList"
              :key="n"
              v-show="n.job === curJob"
              cols="12"
              sm="12"
      >
          <v-container>
            <v-row>
              <v-col v-for="type in n.types" :key="type.type" cols="12"
                     sm="4">
                <v-row class="mb-5">
                  <v-btn class="ma-2"
                         outlined
                         width="110"
                         color="indigo" style="left:18px;font-size:medium" @click="addAllTelent(type.type,n.job)">{{type.ch18}}<br>全选</v-btn>
                </v-row>
                <v-row v-for="telent in type.telnets" :key="telent.name"  class="mb-6">
                  <TelentListElement @deleteTelent="deleteTelent" @addTelent="addTelent" :name="telent.name" :ch18="telent.ch18" :desc="telent.desc" :icon="telent.icon" :unlock="telentList.indexOf(telent.name) != -1"></TelentListElement>
                </v-row>
              </v-col>
            </v-row>
          </v-container>
      </v-col>
    </v-row>
  </v-container>
  </template>

<script>

import TelentListElement from '@/components/TelentListElement.vue'
import {telnetTree} from "../store/const";
export default {
  data() {
    return {
      curJob:'captain',
    }
  },
  props:{
  },
  computed: {
    isPrimary(){
      return job => {
        if (this.curJob === job)return 'primary'
        else return ''
      }
    },
    curplayer(){
      return this.$store.getters.curSteamId
    },
    jobList(){
      return this.$store.getters.telentTree
    },
    jobMsg(){
      return this.curCharacter.elements.find(el => el.name === 'job').attributes.identifier
    },
    curCharacter() {
      return this.$store.getters.characters.find((el) => el.attributes.steamid === this.$store.getters.curSteamId).elements.find( el => el.name === 'Character')
    },
    telentList() {
      return this.curCharacter.attributes.unlockedtalents
    },
    character() {
      return this.curCharacter
    },


  },
  watch:{
    curplayer: {
      handler(newName, oldName) {
        if (newName != ''){
          this.curJob = this.jobMsg
        }
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    setCurJob(value){
      this.curJob = value.currentTarget.value
    },
    deleteTelent(telentName,ch18){
      let telents = this.telentList.split(',')
      let index = telents.findIndex( (n) => n ==telentName)
      telents.splice(index,1)
      this.character.attributes.unlockedtalents = telents.join(',')
      this.$store.dispatch('showAlert', {
        type: 'success',
        text: `删除天赋 ${ch18}.`,
      })
    },
    addTelent(telentName,ch18){
      let telents = this.telentList.split(',')
      let index = telents.findIndex( (n) => n ==telentName)
      if (index < 0){
        telents.push(telentName)
      }
      this.character.attributes.unlockedtalents = telents.join(',')
      this.$store.dispatch('showAlert', {
        type: 'success',
        text: `添加天赋 ${ch18}.`,
      })
    },
    addAllTelent(type,job){
      console.log(type)
      console.log(job)
      let cnageTelent = []
      let hasAll = true;
      let telents = this.telentList.split(',')
      let allTelents = this.jobList.find((el) => el.job == job).types.find((el) => el.type == type).telnets
      for(let [i,v] of Object.entries(allTelents)){
        let index = telents.findIndex( (n) => n == v.name)
        if (index < 0){
          cnageTelent.push(v.ch18)
          telents.push(v.name)
          hasAll = false
        }
      }
      if (!hasAll){
        this.character.attributes.unlockedtalents = telents.join(',')
      } else{
        cnageTelent = []
        let telent = this.telentList.split(',')
        for(let [i,val] of Object.entries(allTelents)) {
          let index = telent.findIndex((n) => n == val.name)
          telent.splice(index, 1)
          cnageTelent.push(val.ch18)
        }
        this.character.attributes.unlockedtalents = telent.join(',')
      }

      this.$store.dispatch('showAlert', {
        type: 'success',
        text: `批量修改天赋 ${cnageTelent.join(',')}.`,
      })
    }
  },
  components: {
    TelentListElement,
  },
}
</script>

<style scoped>
</style>
