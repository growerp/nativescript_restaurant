<template>
  <Page @loaded="pageLoaded()">
    <ActionBar><NavigationButton visibility="collapsed"/>
      <myActionBar :onHeaderTap="onHeaderTapHome" :openDrawer="openDrawer"
          header="help" :onActionTap="onAddTap" :plus="true"/>
    </ActionBar>
    <TabView :selectedIndex="currentTab" 
            @selectedIndexChange="tabChange" id="tabViewId">
        <TabViewItem :title="$t('FAQ')">
          <GridLayout columns="*,*" rows="auto,*" padding="10">
            <Accordion row="1" col="0" colSpan="3" ref="accordionFAQ"
              allowMultiple="true"
              for="item of faqs" childItems="notes"  height="100%">
              <v-template name="title">
                <Label backgroundColor="rgb(211, 215, 207)" margin="5,0"
                    :text="item.requestName" class="h2"/>
              </v-template>
              <v-template name="content">
                  <HtmlView :html="item.text"  margin="5,0"
                      @tap="addNote(item)"/>
              </v-template>
            </Accordion>
          </GridLayout>
        </TabViewItem>
        <TabViewItem :title="$t('myQuestions')">
          <GridLayout columns="*,*" rows="auto,*" padding="10">
            <Accordion row="1" col="0" colSpan="3" ref="accordionFAQ"
                allowMultiple="true"
                for="item of requests" childItems="notes"  height="100%">
              <v-template name="title">
                <Label backgroundColor="rgb(211, 215, 207)" margin="5,0"
                    :text="item.requestName" class="h2"/>
              </v-template>
              <v-template name="content">
                  <HtmlView :html="item.text"  margin="5,0"
                      @tap="addNote(item)"/>
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
import Confirm from './modalPages/Confirm'
import general from '~/mixins/general'
export default {
  mixins: [ sideDrawer, general ],
  props: {
      startTab: Number
  },
  data () {
    return {
      currentTab: '',
      faqs: this.$store.getters.faqsAndNotes,
      requests: this.$store.getters.RequestAndNotes,
    }
  },
  created() {
    this.currentTab = this.startTab
    console.log("==== requests: " + JSON.stringify(this.$store.getters.RequestAndNotes))
  },
  methods: {
      tabChange(args) {
        this.currentTab = args.value
      },
      onAddTap() { //get new item and add to end
        this.$showModal(RequestAdd)
        .then(() => {
          this.currentTab = 1
        })
      this.requests = this.$store.getters.RequestAndNotes
      },
      onDeleteTap(item) {
        this.$showModal(Confirm,{ props: {
            message: this.$t('delRequest') + item.requestName + "?"}
        })
        .then (data => {
          if (data) {
            this.$backendService.deleteRequest(item.requestId)
            this.$store.commit('request', 
                { verb: 'delete', requestId: item.requestId})
          }
        })
      },
      addNote(item) {
        this.$showModal(RequestNoteAdd, { props: {requestId: item.requestId}})
        .then(()=> {
          this.requests = this.$store.getters.RequestAndNotes
        })
      },
  }
}
</script>

<style lang="css">
</style>
