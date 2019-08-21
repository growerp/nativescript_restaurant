<template lang="html">
  <Page>
    <ActionBar>
      <GridLayout width="100%" columns="auto, *">
        <Label class="title" :text="$t('menu')" col="0" @tap="openDrawer()"/>
        <GridLayout columns="auto,auto" @tap="$navigateTo($routes.SetUp)" col="1"
              horizontalAlignment="center">
          <Image src="~/assets/images/go-back-arrow.png" col="0" height="20"/>
          <Label class="title" :text="$t('about')" col="1"/>
        </GridLayout>
      </GridLayout>
    </ActionBar>
    <ScrollView>
      <StackLayout padding="10">
        <HtmlView :html="text"/>
      </StackLayout>
    </ScrollView>
  </Page>
</template>

<script>
import sideDrawer from '~/mixins/sideDrawer'
export default {
  name: 'About',
  data() {
    return {
      text: this.policy()
    }
  },
  mixins: [sideDrawer],
  methods: {
    policy() {
        return `

        <h2>About Growerp App</h2>
              <p> GrowERP.com built the GrowERP-Restaurant app as a Free app. This SERVICE is provided by
                  GrowERP.com at no cost and is intended for use as is.

        <h2>Terms of use</h2>
            <p>We will provide this app services to you, which are subject to the conditions stated below in this document.</p> 
            <p>Every time you visit this app, use its services or make a purchase, you accept the following conditions.</p>
            <p>Content published on this app (images, texts, graphics, logos) is the property of its content creators and protected 
              by international copyright laws.</>
            <p>The entire communication with us is electronic. Every time you send us an email or visit our app, 
              you are going to be communicating with us. You hereby consent to receive communications from us.<p>
            <p>If you subscribe to in-app products, the service can be cancelled at the end of every subscription period.</p>
            <p. By using this app, you agree that the laws of Thailand, without regard to principles of conflict laws, 
              will govern these terms and conditions, or any dispute of any sort that might come between the app owner and you, 
              or its business partners and associates.</p>
            <p>Any dispute related in any way to your visit to this app or to products you purchase from us shall be arbitrated by state 
            court of Thailand and you consent to exclusive jurisdiction and venue of such courts.</p>
            <p>Visitors may post content as long as it is not obscene, illegal, defamatory, threatening, infringing of intellectual property 
              rights, invasive of privacy or injurious in any other way to third parties. Content has to be free of software viruses, 
              political campaign, and commercial solicitation.</p>
            <p>We grant you a limited license to access and make personal use of this app. You are not allowed to download or modify it. 
              This may be done only with written consent from us.</p>
            <p>If you are an owner of an account on this app, you are solely responsible for maintaining the confidentiality of your 
            private user details (username and password). You are responsible for all activities that occur under your account or password.</p>

        <h2>Privacy Policy</h2>
                          </p> <p>This page is used to inform visitors regarding our policies with the collection, terms of use, and disclosure
                            of Personal Information if anyone decided to use our Service.
                          </p> <p>If you choose to use our Service, then you agree to the collection and use of information in
                            relation to this policy. The Personal Information that we collect is used for providing and improving
                            the Service. We will not use or share your information with anyone except as described
                            in this Privacy Policy.
                          </p> <p>The terms used in this Privacy Policy have the same meanings as in our Terms and Conditions, which is
                            accessible at GrowERP-Restaurant unless otherwise defined in this Privacy Policy.
                          </p> <p><strong>Information Collection and Use</strong></p> <p>For a better experience, while using our Service, we may require you to provide us with certain
                            personally identifiable information, including but not limited to company employee, its customers and order and product information. The information that we request will be retained by us and used as described in this privacy policy.
                          </p> <p>The app does use third party services that may collect information used to identify you.</p> <div><p>Link to privacy policy of third party service providers used by the app</p> 
                          <ul><li><a href='https://www.google.com/policies/privacy/' target='_blank'>Google Play Services</a></li>
                          <ul><li><a href='https://www.apple.com/legal/privacy/en-ww/' target='_blank'>Apple App Store Services</a></li>
                              <li><a href='https://aws.amazon.com/privacy/?nc1=f_pr' target='_blank'>Amazon Webservices</a></li>
                              </ul></div> 
                          <p><strong>Log Data
                          </strong></p> <p> We want to inform you that whenever you use our Service, in a case of
                            an error in the app we collect data and information (through third party products) on your phone
                            called Log Data. This Log Data may include information such as your device Internet Protocol (“IP”) address,
                            device name, operating system version, the configuration of the app when utilizing our Service,
                            the time and date of your use of the Service, and other statistics.
                          </p> <p><strong>Cookies</strong></p> <p>Cookies are files with a small amount of data that are commonly used as anonymous unique identifiers.
                            These are sent to your browser from the apps that you visit and are stored on your device&apos;s internal
                            memory.
                          </p> <p>This Service does not use these “cookies” explicitly. However, the app may use third party code and
                            libraries that use “cookies” to collect information and improve their services. You have the option to
                            either accept or refuse these cookies and know when a cookie is being sent to your device. If you choose
                            to refuse our cookies, you may not be able to use some portions of this Service.
                          </p> <p><strong>Service Providers</strong></p> <p> We may employ third-party companies and individuals due to the following reasons:</p> <ul><li>To facilitate our Service;</li> <li>To provide the Service on our behalf;</li> <li>To perform Service-related services; or</li> <li>To assist us in analyzing how our Service is used.</li></ul> <p> We want to inform users of this Service that these third parties have access to
                            your Personal Information. The reason is to perform the tasks assigned to them on our behalf. However,
                            they are obligated not to disclose or use the information for any other purpose.
                          </p> <p><strong>Security</strong></p> <p> We value your trust in providing us your Personal Information, thus we are striving
                            to use commercially acceptable means of protecting it. But remember that no method of transmission over
                            the internet, or method of electronic storage is 100% secure and reliable, and we cannot guarantee
                            its absolute security.
                          </p> <p><strong>Links to Other Sites</strong></p> <p>This Service may contain links to other sites. If you click on a third-party link, you will be directed
                            to that site. Note that these external sites are not operated by us. Therefore, we strongly
                            advise you to review the Privacy Policy of these apps. We have no control over
                            and assume no responsibility for the content, privacy policies, or practices of any third-party sites
                            or services.
                          </p> <p><strong>Children’s Privacy</strong></p> <p>These Services do not address anyone under the age of 13. We do not knowingly collect
                            personally identifiable information from children under 13. In the case we discover that a child
                            under 13 has provided us with personal information, we immediately delete this from
                            our servers. If you are a parent or guardian and you are aware that your child has provided us with personal
                            information, please contact us so that we will be able to do necessary actions.
                          </p> <p><strong>Changes to This Privacy Policy</strong></p> <p> We may update our Privacy Policy from time to time. Thus, you are advised to review
                            this page periodically for any changes. We will notify you of any changes by posting
                            the new Privacy Policy on this page. These changes are effective immediately after they are posted on
                            this page.
                          </p> 
        <h2>Credits logos</h2>
            <p>All icons are provided by <a href='https://www.flaticon.com/'  title='Flaticon'>www.flaticon.com</a>
            by means of a paid subscription</p>
        <h2>Comments or Questions</h2>
          <p><strong>Contact Us</strong></p> <p>If you have any questions or suggestions about our Privacy or use Policy, do not hesitate to contact
                            us at support@growerp.com.</p>
        `
    }
  }
}
</script>

<style/>
