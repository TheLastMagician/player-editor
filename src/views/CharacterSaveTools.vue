<template>
  <v-container>
    <!-- row 1 - file input-->
    <v-row>
      <v-col>
        <FileDropper></FileDropper>
      </v-col>
    </v-row>
    <!-- row 2 - save info and download -->
    <v-row>
      <SaveDataBar :blockDownload="!saveLoaded"></SaveDataBar>
    </v-row>
    <!-- row 3 - tools -->
    <v-row v-if="saveLoaded">
      <v-col>
        <label class="text-h4">玩家:  </label>
        <select @change="change">
          <option v-for="player of initPlayer"
                  :key="player.steamid" :value="player.steamid">
            {{player.name}}
          </option>
        </select>
      </v-col>
    </v-row>
    <v-row v-if="saveLoaded">
      <v-col >
        <TelentList></TelentList>
      </v-col>
      <v-col sm="1">

      </v-col>
      <v-col >
        <BaseData></BaseData>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'

import FileDropper from '@/components/FileDropper.vue'
import TelentList from '@/components/TelentList.vue'
import BaseData from '@/components/BaseData.vue'
import SaveDataBar from '@/components/SaveDataBar.vue'


export default {
  name: 'CharacterSaveTools',

  components: {
    FileDropper,
    TelentList,
    SaveDataBar,
    BaseData,
  },
  computed: {
    ...mapGetters(['saveLoaded']),
    initPlayer() {
      let ps = this.$store.getters.characters
      let list = []
      for (let [index, characterCampaignData] of Object.entries(ps)) {
        list.push({
          name: characterCampaignData.attributes.name,
          steamid: characterCampaignData.attributes.steamid
        })
      }
      return list
    },
  },
  data() {
    return {
    }
  },
  methods: {
    change(value){
      this.$store.dispatch('setCurPlayer',value.target.value)
    }
  }

}
</script>


<style scoped>

input {
  border: 1px solid white;
  color: white;
  font-size: 2em;
  padding-left: 8px;
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