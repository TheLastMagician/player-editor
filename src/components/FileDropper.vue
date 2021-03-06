<template>
  <v-card class="pa-4" elevation="1">
    <div class="d-flex flex-row align-center justify-center mb-1">
      <div class="h3 mb-1">拖拽或者点击图标上传:</div>
      <v-spacer></v-spacer>
      <!-- locate file dialog -->
      <v-btn @click.stop="fileLocDialog = true" size="x-small" icon>
        <v-icon>mdi-file-find-outline</v-icon>
        <v-tooltip anchor="bottom" activator="parent">玩家人物文件路径</v-tooltip>
      </v-btn>
      <v-dialog class="filedropper" v-model="fileLocDialog">
        <v-card>
          <v-card-title>
            <span class="text-h5">玩家人物文件路径</span>
            <v-spacer></v-spacer>
            <v-btn color="red" size="x-small" icon @click="fileLocDialog = false">
              <v-icon>mdi-close-thick</v-icon>
            </v-btn>
          </v-card-title>
          <v-divider></v-divider>
          <!-- save editor -->
          <v-card-text class="pl-8">
            <div class="text-h6 text-center">各系统文件路径:</div>
            <ul>
              <li>
                Windows:
                <span class="text-primary">
                  C:\Users\%username%\AppData\Local\Daedalic Entertainment GmbH\Barotrauma\Multiplayer\XXX_CharacterData.xml
                </span>
              </li>
              <li>
                Linux:
                <span class="text-primary"> /home/$USER/.local/share/Daedalic Entertainment GmbH/Barotrauma/Multiplayer/XXX_CharacterData.xml </span>
              </li>
              <li>
                MacOS:
                <span class="text-primary"> /$USER/Library/Application Support/Daedalic Entertainment GmbH/Barotrauma\Multiplayer/XXX_CharacterData.xml </span>
              </li>
            </ul>
          </v-card-text>
        </v-card>
      </v-dialog>
      <!-- help dialog -->
      <v-dialog class="filedropper" v-model="helpDialog">
        <v-card>
          <v-card-title>
            <span class="text-h5">What files can i load here?</span>
            <v-spacer></v-spacer>
            <v-btn color="red" size="x-small" icon @click="helpDialog = false">
              <v-icon>mdi-close-thick</v-icon>
            </v-btn>
          </v-card-title>
          <v-divider></v-divider>
          <!-- save editor -->
          <v-card-text class="pl-8">
            <div class="text-h6 text-center">
              Save editor needs to load <span class="text-primary font-weight-bold">.save</span> file first, then it
              accepts:
            </div>
            <ul>
              <li>
                <span class="text-primary font-weight-bold">.sub</span> - Add a new owned submarine or update file of an
                existing one
              </li>
              <li>
                <span class="text-primary font-weight-bold">gamesession.xml</span> - Replace gamesession.xml inside the
                loaded save
              </li>
              <li>
                <span class="text-primary font-weight-bold">(...)_CharacterData.xml</span> - Import player characters
                from multiplayer save as bots
              </li>
            </ul>
          </v-card-text>
        </v-card>
      </v-dialog>
    </div>
    <div
      class="dropzone"
      @drop.prevent="dropHandler"
      @click="dropzoneClickHandler"
      @dragenter.stop.prevent="dragEnter"
      @dragleave.stop.prevent="dragLeave"
      @dragover.stop.prevent
      :style="{ borderColor: hovered ? getBorderColor : '', backgroundImage: `url(${fileImage})` }"
    ></div>
    <input
      ref="fileInput"
      class="dropzoneInput"
      type="file"
      @change="selectHandler"
      multiple="false"
      :accept="'.xml'"
    />
  </v-card>
</template>

<script>
import fileImage from '@/assets/file-upload-outline.png'

import { Buffer } from 'buffer'

import { DecompressSave } from '@/helpers/CompressionHelpers.js'

export default {
  props: {
  },
  data() {
    return {
      hovered: false,
      fileLocDialog: false,
      helpDialog: false,
    }
  },
  methods: {
    async loadFile(file) {
      await this.$store.dispatch('setLoading', true)
      // give vue time to update component before synchronous decompression
      await new Promise((r) => setTimeout(r, 50))

      const reader = new FileReader()

      reader.readAsArrayBuffer(file)
      reader.onload = (e) => {
        /**@type {ArrayBuffer} */
        const resultRaw = e.target.result
        var resultFile = {
          name: file.name,
          data: null,
        }

        // uploads from save editor
         if (file.name.endsWith('.xml'))
            resultFile.data = Buffer.from(resultRaw).toString('utf-8')
         else {
            resultFile.data = resultRaw
          }
          this.$store.dispatch('fileUploaded', resultFile)
      }
    },
    selectHandler(ev) {
      this.$store.dispatch('showTree')
      if (ev.target?.files[0]) this.loadFile(ev.target.files[0])
      ev.target.value = null
    },
    dropHandler(ev) {
      this.hovered = false
      if (ev.dataTransfer?.files[0]) this.loadFile(ev.dataTransfer.files[0])
    },
    dropzoneClickHandler() {
      this.$refs.fileInput.click()
    },
    dragEnter() {
      this.hovered = true
    },
    dragLeave() {
      this.hovered = false
    },
  },
  computed: {
    getBorderColor() {
      return this.$vuetify.theme.themes.dark.colors.secondary
    },
    fileImage() {
      return fileImage
    },
  },
}
</script>

<style scoped>
input.dropzoneInput {
  display: none;
}
.dropzone {
  border: 2px dashed #bbb;
  border-radius: 5px;
  padding: 50px;
  text-align: center;
  cursor: pointer;
  position: relative;
  background-position: center;
}
</style>

<style>
.v-dialog.filedropper .v-overlay__content {
  max-width: 780px !important;
  max-height: 650px !important;
}
</style>
