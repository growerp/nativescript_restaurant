<template lang="html">
  <Page @loaded="pageLoaded()">
    <ActionBar>
      <GridLayout width="100%" columns="auto, *, auto">
        <Label class="title" :text="$t('menu')" col="0" @tap="openDrawer()"/>
        <StackLayout orientation="horizontal" @tap="$navigateTo($routes.Home)" col="1"
            horizontalAlignment="center">
          <Image src="~/assets/images/go-back-arrow.png" height="15"/>
          <Label class="title" :text="$t('help')"/>
        </StackLayout>
        <Label @tap="onAddTap" :text="currentTab==1?$t('add'):''" col="2"/>
      </GridLayout>
    </ActionBar>
    <TabView :selectedIndex="currentTab" paddingTop="10"
        @selectedIndexChange="tabChange">

        <TabViewItem :title="$t('FAQ')">
          <GridLayout columns="*,*" rows="auto,*">
            <Accordion row="1" col="0" colSpan="3" ref="accordionFAQ"
              allowMultiple="true"
              for="item of faqList" childItems="notes"  height="100%">
              <v-template name="title">
                <Label backgroundColor="rgb(211, 215, 207)"
                    :text="item.requestName" class="h2"/>
              </v-template>
              <v-template name="content">
                  <HtmlView :html="item.text"
                      @tap="addNote('faq',item.requestId)"/>
              </v-template>
            </Accordion>
          </GridLayout>
        </TabViewItem>

        <TabViewItem :title="$t('myQuestions')">
          <GridLayout columns="*,*" rows="auto,*">
            <Accordion row="1" col="0" colSpan="3" allowMultiple="true"  height="100%"
                for="item of questionList" childItems="notes"  ref="accordionQuest">
              <v-template name="title">
                <Label backgroundColor="rgb(211, 215, 207)"
                    :text="item.requestName" class="h2"/>
              </v-template>
              <v-template name="content" >
                <GridLayout columns="50, *, auto" rows="*" class="item"
                      paddingRight="5" paddingLeft="5">
                  <HtmlView :html="item.text" col="1"
                    @tap="addNote('question',item.requestId)"/>
                  <Label :text="item.date" class="p" col="2"
                    @tap="addNote('question',item.requestId)"/>
               </GridLayout>
              </v-template>
            </Accordion>
          </GridLayout>
        </TabViewItem>
    </TabView>
  </Page>
</template>

<script>
import sideDrawer from '~/mixins/sideDrawer'
import TaskAdd from './modalPages/TaskAdd'
import RequestAdd from './modalPages/RequestAdd'
import RequestNoteAdd from './modalPages/RequestNoteAdd'
import general from '~/mixins/general'
export default {
  mixins: [ sideDrawer, general ],
  props: {
      startTab: Number
  },
  data () {
    return {
      currentTab: '',
      faqList: [],
      questionList: [],
    }
  },
  created() {
    this.$backendService.getRequestList(false).then( result => {
        this.faqList = result.data.requests})
        this.faqList.sort(function (a, b) {
          return a.requestName.toLowerCase().localeCompare(b.requestName.toLowerCase())
        });
    this.$backendService.getRequestList(true).then( result => {
        this.questionList = result.data.requests
    })
  },
  methods: {
      tabChange(args) {
        this.currentTab = args.value
      },
      onHeaderTap() {
        this.$navigateTo(this.$routes.Home)
      },
      onAddTap() { //get new item and add to end
        this.$showModal(RequestAdd).then (result => {
          if (result) this.questionList.push(result)
          })
      },
      addNote(type,requestId) {
        this.$showModal(RequestNoteAdd, { props: {requestId: requestId}})
        .then (result => {
          if (result && type ==='faq') {
            for (let i=0; i < this.faqList.length; i++) {
              if (this.faqList[i].requestId === result.requestId) {
                this.faqList[i].notes.push(result); break }}}
          if (result && type ==='question') {
            for (let i=0; i < this.questionList.length; i++) {
              if (this.questionList[i].requestId === result.requestId) {
                this.questionList[i].notes.push(result); break  }}}
        })
      },
  }
}
</script>

<style lang="css">
</style>
