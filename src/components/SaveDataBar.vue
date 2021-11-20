<template>
  <v-col>
    <v-card elevation="1" class="pr-2">
      <v-btn color="secondary" :disabled="blockDownload" @click="download" width="160">下载</v-btn>
      <div class="float-right ma-1">
        加载文件: <span class="text-primary">{{ filename }}</span>
      </div>
    </v-card>
  </v-col>
</template>

<script>
import { desanitized_js2xml, CompressSave, CompressSub, gsHeader } from '@/helpers/CompressionHelpers.js'

export default {
  props: {
    blockDownload: Boolean,
  },
  computed: {
    filename() {
      return this.$store.state.savefileName || 'none'
    },
    modificationDate() {
      let timestamp = this.$store.state.gamesession.elements?.[0]?.attributes?.savetime
      if (!timestamp) return '-'
      let date = new Date(parseInt(timestamp) * 1000)
      return date.toLocaleString()
    },
  },
  methods: {
    download() {
      var save = {}

      // convert gamesession to xml string and prepend header
      let xmlString =gsHeader + desanitized_js2xml(this.$store.state.playerCharacters, { spaces: 4 })

      // trigger download
      let a = document.createElement('a')
      a.href = URL.createObjectURL(new Blob([xmlString], { type: 'application/xml' }))
      a.download = this.$store.state.savefileName
      a.click()
    },
  },
}
</script>

<style scoped></style>
