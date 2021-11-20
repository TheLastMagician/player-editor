<template >
  <v-container class="grey lighten-5 mb-6">
    <v-row class="mb-6">
      <v-col>
        <v-card>
      <div class="text-h6">人物名</div>
      <input v-model="name" @change="changeName">
        </v-card>
      </v-col>
      <v-col>
        <v-card>
      <div class="text-h6">职业</div>
        <select v-model="curJob"
                @change="change">
      <option v-for="job of jobList.map((el) => el)"
              :key="job.job" :value="job.job" :name="job.ch18">
        {{job.ch18}}
      </option>
        </select>
        </v-card>
      </v-col>
    </v-row>
  </v-container>

  <v-container class="grey lighten-5 mb-6">
      <v-row  no-gutters v-for="sk in skills" :key="sk.attributes.identifier">
        <v-card
                class="pa-2"
                outlined
                tile
        >

        <div class="text-h6">{{allSkills.find((el) => el.skill == sk.attributes.identifier).ch18}}</div>
        <input :value="sk.attributes.level" @change="skillChange($event,sk.attributes.identifier)">
        </v-card>
    </v-row>
  </v-container>
  </template>

<script>

export default {
  data() {
    return {
      curJob:'captain',
      name:'',
      allSkills:[
        {skill:'helm',ch18:'驾驶水平'},
        {skill:'weapons',ch18:'武器操作'},
        {skill:'mechanical',ch18:'机械工程'},
        {skill:'electrical',ch18:'电气工程'},
        {skill:'medical',ch18:'医疗水平'},
      ]
    }
  },
  computed: {
    curplayer(){
      return this.$store.getters.curSteamId
    },
    jobList(){
      return this.$store.getters.telentTree
    },
    jobMsg(){
      return this.curCharacter.elements.find(el => el.name === 'job').attributes.identifier
    },
    skills(){
      return this.curCharacter.elements.find(el => el.name === 'job').elements
    },
    curCharacter() {
      return this.$store.getters.characters.find((el) => el.attributes.steamid === this.$store.getters.curSteamId).elements.find( el => el.name === 'Character')
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
          this.name =  this.curCharacter.attributes.name
        }
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    skillChange(value,id){
      this.curCharacter.elements.find(el => el.name == 'job').elements.find((el) => el.attributes.identifier == id).attributes.level = value.target.value
      this.$store.dispatch('showAlert', {
        type: 'success',
        text: `修改成功 ${id} level = ${value.target.value}.`,
      })
    },
    change(value){
      this.curCharacter.elements.find(el => el.name == 'job').attributes.identifier = value.target.value
      this.curCharacter.elements.find(el => el.name == 'job').attributes.name = this.jobList.find((el) => el.job == value.target.value).ch18
      this.$store.dispatch('showAlert', {
        type: 'success',
        text: `修改成功 job = ${value.target.value}.`,
      })
    },
    changeName(value){
      this.curCharacter.attributes.name = value.target.value
      this.$store.dispatch('showAlert', {
        type: 'success',
        text: `修改成功 Name = ${value.target.value}.`,
      })
    },
    addTelent(telentName){
      let telents = this.telentList.split(',')
      let index = telents.findIndex( (n) => n ==telentName)
      if (index < 0){
        telents.push(telentName)
      }
      this.character.attributes.unlockedtalents = telents.join(',')
      this.$store.dispatch('showAlert', {
        type: 'success',
        text: `添加天赋 ${telentName}.`,
      })
    },
  },
  components: {

  },
}
</script>

<style scoped>
  input {
    border: 1px solid white;
    color: white;
    font-size: 170%;
  }
  option {
    background: rgb(var(--v-theme-surface));
    color: white;
  }
  select {
    border: 1px solid white;
    font-size: 2em;
    padding-left: 8px;
    line-height: 40px;
    cursor: pointer;
    border-radius: 5px;
    color:white;
  }
</style>
