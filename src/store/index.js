import { createStore } from 'vuex'
import { xml2js } from 'xml-js'
import { Buffer } from 'buffer'
import _random from 'lodash/random'

import { DecompressSub, gsHeader } from '@/helpers/CompressionHelpers'
import {telnetTree, assistant, cpatain, doctor, engineer, mechanic, security,i18n} from "./const";

function initTelentTrees(){
  //初始化天赋名称 对应天赋图标
  let allTelents = []
  for (let [index, value] of Object.entries([ assistant, cpatain, doctor, engineer, mechanic, security])){
    let telents = xml2js(value).elements[0].elements
    for (let [index, telent] of Object.entries(telents)){
      let icon = ''
      let ic = telent.elements.find(item => item.name === 'Icon')
      let [column,row] = ic.attributes.sheetindex.split(',')
      let pngName = ic.attributes.texture.substring(ic.attributes.texture.length - 17,ic.attributes.texture.length - 4)
      icon = pngName + '_' + (parseInt(row) * 8 + parseInt(column) + 1) + '.png'
      allTelents.push({name:telent.attributes.identifier,icon:icon})
    }
  }


  let trees = []
  let eles = xml2js(telnetTree).elements[0].elements
  for (let [index, TalentTree] of Object.entries(eles)) {
    let types = []
    for (let [index, SubTree] of Object.entries(TalentTree.elements)) {
      let telents = []
      for (let [index, TalentOptions] of Object.entries(SubTree.elements)) {
        for (let [index, TalentOption] of Object.entries(TalentOptions.elements)) {
          let name = TalentOption.attributes.identifier
          let obj = allTelents.find(item => item.name === name)
          telents.push({name:name,icon:obj.icon})
        }

      }
      types.push({type:SubTree.attributes.identifier,telnets:telents})
    }
    trees.push({job:TalentTree.attributes.jobidentifier,types:types})
  }

  //添加中文字段
  let ch18 = xml2js(i18n);
  let array = ch18.elements[0].elements
  for (let [index, job] of Object.entries(trees)){
    job.ch18 = array.find((el) => el.name == job.job)?.elements[0]?.text
    for (let [j, type] of Object.entries(job.types)){
      type.ch18 = array.find((el) => el.name == ('talenttree.'+type.type))?.elements[0]?.text
      for (let [i, telnet] of Object.entries(type.telnets)){
        telnet.ch18 = array.find((el) => el.name == ('talentname.'+telnet.name))?.elements[0]?.text
        telnet.desc = array.find((el) => el.name == ('talentdescription.'+telnet.name))?.elements[0]?.text
      }
    }
  }
  console.log(trees)

  return trees
}

export default createStore({

  state: {
    telentTrees:initTelentTrees(),
    alert: false,
    alertTimout: null,
    gamesession: {},
    curSteamid:'',
    isLoading: false,
    savefileName: null,
    subfiles: {},
    playerCharacters: {},
  },
  getters: {
    curSteamId:(state) => {
      return state.curSteamid
    },
    characters:(state) => {
      return state.playerCharacters.elements?.[0]?.elements
    },
    telentTree:(state) => {
      return state.telentTrees
    },
    campaign: (state) => {
      return state.gamesession.elements?.[0]?.elements?.find(
        (el) => el.name === 'MultiPlayerCampaign' || el.name === 'SinglePlayerCampaign',
      )
    },
    isMultiPlayer: (state) => {
      return state.gamesession.elements?.[0]?.elements?.findIndex((el) => el.name === 'MultiPlayerCampaign') !== -1
    },
    saveLoaded: (state) => {
      return state.savefileName !== null
    },
  },
  mutations: {
    SHOW_TREE(state) {
      console.log(state.telentTrees)
    },
    SET_ALERT(state, value) {
      state.alert = value
    },
    SET_ALERT_TIMEOUT(state, fn) {
      state.alertTimout = setTimeout(fn, 10000)
    },
    CLEAR_ALERT_TIMEOUT(state) {
      clearTimeout(state.alertTimout)
    },
    SET_SAVEFILENAME(state, newName) {
      state.savefileName = newName
    },
    SET_GAMESESSION(state, newData) {
      state.gamesession = newData
    },
    // add submarine file as attached to savefile
    ADD_SUBFILE(state, { name, data }) {
      state.subfiles[name] = data
    },
    // add characters to the SP crew
    ADD_CHARACTERS(state, characters) {
      let crew = state.gamesession.elements[0].elements
        ?.find((el) => el.name === 'SinglePlayerCampaign')
        .elements.find((el) => el.name === 'crew')
      for (let char of characters) crew.elements.push(char)
    },
    // add characters to the MP bot crew
    ADD_BOTS(state, characters) {
      let bots = state.gamesession.elements?.[0]?.elements
        ?.find((el) => el.name === 'MultiPlayerCampaign')
        .elements.find((el) => el.name === 'bots')
      if (bots.attributes.hasbots !== 'true') bots.attributes.hasbots = 'true'
      if (!bots.elements) bots.elements = []
      for (let char of characters) bots.elements.push(char)
    },
    // sets isLoading
    SET_LOADING(state, value) {
      state.isLoading = value
    },
    CLEAR_PLAYERS(state) {
      state.playerCharacters = {}
    },
    SET_PLAYERS(state,newData) {
      state.playerCharacters = newData
    },
    SET_CUR_PLAYER(state,value){
      state.curSteamid = value
    }

  },
  actions: {
    setCurPlayer({ commit }, value){
      commit('SET_CUR_PLAYER',value)
    },
    showTree({ commit }){
      commit('SHOW_TREE')
    },
    showAlert({ commit }, value) {
      if (!value) {
        commit('CLEAR_ALERT_TIMEOUT')
        commit('SET_ALERT', false)
      }
      commit('SET_ALERT', value)
      commit('SET_ALERT_TIMEOUT', () => {
        commit('SET_ALERT', false)
      })
    },
    subUploaded({ commit, dispatch }, file) {
      // .sub submarine
      if (file.name.endsWith('.sub')) {
        let sub = xml2js(DecompressSub(Buffer.from(file.data)))
        commit('SET_SUBFILE', { name: file.name, data: sub })
      }
      // .xml submarine
      else if (file.name.endsWith('.xml')) {
        commit('SET_SUBFILE', {
          name: file.name.slice(0, -4) + '.sub',
          data: xml2js(Buffer.from(file.data).toString('utf-8')),
        })
      }
      // transfer from save editor
      else if (file.name.endsWith('.raw')) {
        commit('SET_SUBFILE', { name: file.name.slice(0, -4), data: file.data })
      }
      // other file types
      else {
        console.warn(`wrong file type uploaded - ${file.name}`)
        dispatch('showAlert', {
          type: 'warning',
          text: `Unrecognized file type: ${file.name}.`,
        })
      }
      commit('SET_LOADING', false)
    },
    fileUploaded({ commit, dispatch, state, getters }, file) {
      if (file.name.endsWith('CharacterData.xml')) {
        commit('CLEAR_PLAYERS')
        commit('SET_SAVEFILENAME', file.name)

        let players = xml2js(file.data.substring(gsHeader.length))
        commit('SET_PLAYERS', players)
      } else if (!state.savefileName) {
        dispatch('showAlert', {
          type: 'info',
          text: `No .save file loaded to attach additional files to.`,
        })
        console.warn(`No .save file to attach additional files to`)
      }
      // additional .sub file uploaded, or .raw transfer from submarine editor
     else if (file.name.endsWith('CharacterData.xml1')) {
        let dataObject = xml2js(file.data.substring(gsHeader.length))
        let characters = []
        let count = 0
        for (let chData of dataObject?.elements?.[0]?.elements) {
          // for some reason inventory and health in characterdata.xml are adjacent to <Character> instead of nested inside it
          let character = chData.elements.find((el) => el.name == 'Character')
          let inventory = chData.elements.find((el) => el.name == 'inventory')
          let health = chData.elements.find((el) => el.name == 'health')
          character.elements.push(inventory)
          character.elements.push(health)
          characters.push(character)
          count++

          state.playerCharacters.push(chData.attributes)
        }
        if (count === 0) {
          console.warn(`Character import failed - file might be invalid or empty`)
          dispatch('showAlert', {
            type: 'warning',
            text: `Character import failed - file might be invalid or empty.`,
          })
        } else {
          if (getters.isMultiPlayer) commit('ADD_BOTS', characters)
          else commit('ADD_CHARACTERS', characters)
          dispatch('showAlert', {
            type: 'success',
            text: `Succesfully imported ${count} characters.`,
          })
        }
      } else {
        console.warn(`Unrecognized file type: ${file.name}`)
        dispatch('showAlert', {
          type: 'warning',
          text: `Unrecognized file type: ${file.name}.`,
        })
      }
      commit('SET_CUR_PLAYER', getters.characters?.[0].attributes.steamid)
      commit('SET_LOADING', false)
    },
    convertSaveFile({ commit, dispatch, state, getters }) {
      // MP to SP convertion
      if (getters.isMultiPlayer) {
        // convert bots to crew
        let crew = getters.campaign.elements.find((el) => el.name == 'bots')
        crew.name = 'crew'
        if (crew.attributes.hasbots) delete crew.attributes.hasbots

        // strip available subs
        let availSubListIndex = getters.campaign.elements.findIndex((el) => el.name === 'AvailableSubs')
        getters.campaign.elements.splice(availSubListIndex, 1)

        // rename campaign
        getters.campaign.name = 'SinglePlayerCampaign'

        // show alert
        dispatch('showAlert', {
          type: 'success',
          text: `Converted savefile to single-player format.`,
        })
      }
      // SP to MP conversion
      else {
        // convert crew to bots
        let bots = getters.campaign.elements.find((el) => el.name == 'crew')
        bots.name = 'bots'
        if (!bots.attributes) bots.attributes = {}
        bots.attributes.hasbots = 'true'

        // add available subs
        let availSubList = {
          type: 'element',
          name: 'AvailableSubs',
          elements: [
            { type: 'element', name: 'Sub', attributes: { name: 'Azimuth' } },
            { type: 'element', name: 'Sub', attributes: { name: 'Berilia' } },
            { type: 'element', name: 'Sub', attributes: { name: 'Dugong' } },
            { type: 'element', name: 'Sub', attributes: { name: 'Humpback' } },
            { type: 'element', name: 'Sub', attributes: { name: 'Kastrull' } },
            { type: 'element', name: 'Sub', attributes: { name: 'Orca' } },
            { type: 'element', name: 'Sub', attributes: { name: 'R-29' } },
            { type: 'element', name: 'Sub', attributes: { name: 'Remora' } },
            { type: 'element', name: 'Sub', attributes: { name: 'Typhon' } },
            { type: 'element', name: 'Sub', attributes: { name: 'Typhon2' } },
          ],
        }
        getters.campaign.elements.push(availSubList)

        // rename campaign
        getters.campaign.name = 'MultiPlayerCampaign'

        // set campaign id to random
        state.gamesession.elements[0].attributes.campaignid = _random(50, 100).toString()

        // show alert
        dispatch('showAlert', {
          type: 'success',
          text: `Converted savefile to multi-player format.`,
        })
      }
      commit('SET_LOADING', false)
    },
    setLoading({ commit, state }, value) {
      if (state.isLoading !== !!value) commit('SET_LOADING', !!value)
    },
  },
  modules: {},
})
