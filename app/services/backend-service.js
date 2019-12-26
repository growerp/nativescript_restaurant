import axios from 'axios'
import store from '../store'
const platformModule = require("tns-core-modules/platform")
const appSettings = require("tns-core-modules/application-settings")
const qs = require('qs');
import { ToastDuration, ToastPosition, Toasty } from 'nativescript-toasty';

let log = false
if (TNS_ENV === 'production') log = false

if (TNS_ENV === 'production') 
  axios.defaults.baseURL = 'https://mobile.growerp.com/rest/'
else if (platformModule.isAndroid) 
  axios.defaults.baseURL = 'http://10.0.2.2:8080/rest/'
  //axios.defaults.baseURL = 'http://192.168.1.17:8080/rest/'
else if (platformModule.isIOS) 
  axios.defaults.baseURL = 'http://localhost:8080/rest/'

axios.defaults.headers.common['Content-Type'] = 
      'application/json;charset=UTF-8'
axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*'
axios.defaults.headers.common['Access-Control-Allow-Credentials'] = true
axios.defaults.headers.common['Access-Control-Allow-Headers'] = 
      'X-PINGOTHER, Origin, X-Requested-With, Content-Type, Accept'
axios.defaults.headers.common['Content-Type'] = 'application/x-www-form-urlencoded';

const simple = axios.create({ baseUrl:axios.defaults.baseURL})

axios.interceptors.request.use(function (config) {
  // Do something before request is sent
  // console.log('=wwwww==Request Handler config: ', config)
  log?(console.log('===REQUEST url: ' + config.url +
    ' method: ' + config.method +
    ' data: ' + (config.data? JSON.stringify(config.data) : '') +
    ' interceptor errorHandle: ' +  (config.errorHandle == false ? 'disabled' : 'active') +
    ' headers: ' + JSON.stringify(config.headers))):''
  return config;
}, function (error) {
// Do something with request error beter not suppress....
console.log('===Request Error Handler: ', error)
return Promise.reject(error);
});

/*this.$axios = axios.create({
  transformRequest: [
    data => (isString(data) ? data : qs.stringify(data)),
  ],
});
*/
axios.interceptors.response.use(

    function (response) {
      log?console.log('===RESPONSE statusId: ' + response.status +
        ' url: ' + response.config.url +
        ' method: ' + response.config.method +
        ' headers:' + JSON.stringify(response.headers) +
        ' data: ' + JSON.stringify(response.data)):''
      return response;
    },

    function(error) { // better not suppress REST console errors
      // retry after moquiSession token invalid
      if (error.config && error.response && error.response.status === 401) {
        console.log("=====401 moqui token error")
        getToken().then((token) => { 
          saveToken(token.data)
          return axios.request(error.config);
          //return this.$axios.request(config);
        });
      }
      // check for errorHandle config
      if( error.config.hasOwnProperty('errorHandle') && 
          error.config.errorHandle === false ) {
        return Promise.reject(error)
      }
      if (error.response) {
        console.log('===Error Response handler error response: ' , JSON.stringify(error.response))
      } else if (error.request) {
      // The request was made but no response was received
        console.log('===Response handler error request: ' , JSON.stringify(error.request))
      } else {
      // Something happened in setting up the request that triggered an Error
        console.log('===Response handler Error other: ', error.message)
      }
      console.log('=======server comm error===========' + error.response.data.errors)
//      trace.error("Error in service communication:" + error.response.data.errors);

      var toast = new Toasty({
        text: error.response.data.errors,
        duration: ToastDuration.LONG,
        position: ToastPosition.TOP,
        ios: {
          // anchorView: args.object.ios
          // anchorView: topmost().currentPage.actionBar.ios,
          cornerRadius: 25
        }
      });
      toast.show();
      //this.$navigateTo(this.routes.Login)
    }
  )

export default class BackendService {

  getErrorMessage(error) {
    let msg = ''
    if (error.response.status == '401') {
      msg = error.response.data
      msg = msg.substring( msg.lastIndexOf("<p>") + 3, msg.lastIndexOf("</p>") );
    }
    if (error.response.status == '400' || error.response.status == '403') {
      msg = error.response.data.errors
    }
    return error.message + ": " + error.response.statusText + '; ' + msg
  }
  saveToken(moquiToken) {
    axios.defaults.headers.post['moquiSessionToken'] = moquiToken }
  saveKey(apiKey) {
    appSettings.setString('apiKey', apiKey)
    axios.defaults.headers['api_key'] = apiKey}
  removeKey() {
    appSettings.remove('apiKey')
    delete axios.defaults.headers.common["apiKey"]}
  // ================getToken,login/out/register password forgot =============
  async getToken() {
    return await simple.get('moquiSessionToken')}
  async login(user) {
    return await simple.post('s1/growerp/LoginUser',
      { username: user.name, password: user.password,
        moquiSessionToken: axios.defaults.headers.post['moquiSessionToken'] })}
  async checkApiKey() {
    return await axios.get('s1/growerp/CheckApiKey',
      { errorHandle: false})}
  async ping() {
    return await simple.get('s1/growerp/Ping') }
  async logout() {
    return await axios.get('logout')}
  async getCurrencyList() {
    return await axios.get('s1/growerp/CurrencyList')}
  async register(user, company) {
    return await simple.post('s1/growerp/RegisterUserAndCompany',
      { username: user.name, emailAddress: user.emailAddress,
        newPassword: user.password, firstName: user.firstName,
        lastName: user.lastName, locale: user.locale,
        companyPartyId: company.id, // for existing companies
        companyName: company.name, currencyUomId: company.currency,
        companyEmail: company.emailAddress? company.emailAddress : user.emailAddress,
        partyClassificationId : 'AppRestaurant',
        moquiSessionToken: axios.defaults.headers.post['moquiSessionToken'] })}
  async resetUserPassword(username) {
    return await simple.post('s1/growerp/ResetPassword',
      { username: username, 
        moquiSessionToken: axios.defaults.headers.post['moquiSessionToken'] })}
  async updatePassword(item) {
    return await simple.post('s1/growerp/UpdatePassword',
      { username: item.username, oldPassword: item.oldPassword,
        newPassword: item.newPassword,
        moquiSessionToken: axios.defaults.headers.post['moquiSessionToken'] })}
  // ================get/update user, user liste================
  getAllPartyInfo() {
    axios.get('s1/growerp/GetAllPartyInfo')
    .then((result) => {
      store.commit('allPartyInfo', result.data)})}
  async getCurrentEmployeeUserGroupId() { // need groupId for access early
    return await axios.get('s1/growerp/GetCurrentEmployeeUserGroupId')}
  async createUser(user) { // roletypeid; Customer Employee
    return await axios.post('s1/growerp/CreateUser',
      {   firstName: user.firstName, lastName: user.lastName,
        emailAddress: user.emailAddress, locale: user.locale,
        roleTypeId: user.roleTypeId, externalId: user.externalId,
        groupDescription: user.groupDescription})}
  async updateUser(user) {
    return await axios.post('s1/growerp/UpdateUser',
      {   partyId: user.partyId, userId: user.loginId,
        username: user.username, firstName: user.firstName,
        lastName: user.lastName, emailAddress: user.emailAddress,
        groupDescription: user.groupDescription})}
  async deleteUser(partyId) {
    return await axios.post('s1/growerp/DeleteUser',
      {   partyId: partyId})}
  // ===================company ==============================================
  async updateCompany(company) {
    return await axios.post('s1/growerp/UpdateCompany',
      {   organizationName: company.organizationName, emailAddress: company.emailAddress})}
  // ==========================print =========================================
  async print(item) {
    return await axios.post('s1/growerp/Print', {item: item})
  } 
  // ======================= images ==========================================
  async uploadImage(size, base64, type, id) {
    axios.post('s1/growerp/UploadImage',
      {   type: type, id: id,
        size: size, contentFile: base64 })}
  async downloadImage(size, type, id) {
    return await axios.post('s1/growerp/DownloadImage',
      {   size: size, type: type, id: id })}
  // ================(preparation Area)) ===============
  async createPreparationArea(item) {
    return await axios.post('s1/growerp/CreatePreparationArea',
      { description: item.description,
        printerHostUrl: item.printerHostUrl,
        printerName: item.printerName
      })}
  async updatePreparationArea(item) {
    return await axios.post('s1/growerp/UpdatePreparationArea',
      { preparationAreaId: item.preparationAreaId,
        description: item.description,
        printerHostUrl: item.printerHostUrl,
        printerName: item.printerName
      })}
  async deletePreparationArea(id) {
    return await axios.post('s1/growerp/DeletePreparationArea',
      {   preparationAreaId: id})}
  // ================ table Area (AccommodationArea) ===============
  async createAccommodationArea(accommodationArea) {
    return await axios.post('s1/growerp/CreateAccommodationArea',
      {   description: accommodationArea.description,
        nbrOfSpots: accommodationArea.nbrOfSpots,
        nbrOfSeats: accommodationArea.nbrOfSeats})}
  async updateAccommodationArea(accommodationArea) {
    return await axios.post('s1/growerp/UpdateAccommodationArea',
      {   accommodationAreaId: accommodationArea.accommodationAreaId,
        description: accommodationArea.description})}
  async deleteAccommodationArea(id) {
    return await axios.post('s1/growerp/DeleteAccommodationArea',
      {   accommodationAreaId: id})}
  // ================ table (AccommodationSpot) ===============
  async createAccommodationSpot(areaId,spotNumber) {
    return await axios.post('s1/growerp/CreateAccommodationSpot',
      {   accommodationAreaId: areaId, spotNumber: spotNumber})}
  async deleteAccommodationSpot(spotId) {
    return await axios.post('s1/growerp/DeleteAccommodationSpot',
      {   accommodationSpotId: spotId})}
  // ======================== order ======================
  async getOrder(orderId) {
    return await axios.post('s1/growerp/GetOrder',
      { orderId: orderId})}
  async getOrdersAndItemsByPrepAreas() {
    return await axios.get('s1/growerp/GetOrdersAndItemsByPrepAreas')}
  async getOrders(open=true, startDate=null) {
    return await axios.post('s1/growerp/GetOrders',
      { open: open, startDate: startDate})}
  async createSalesOrder(header,items) {
     return await axios.post('s1/growerp/CreateSalesOrder',
      {orderHeader: JSON.stringify(header), orderItems: JSON.stringify(items)})}
  async changeOrderPartStatus(orderId, partId, statusId) {
    return await axios.post('s1/growerp/ChangeOrderPartStatus',
       {orderId: orderId, orderPartSeqId: partId, statusId: statusId})}
  // ================ Category and Product (Store)===============
  async createProduct(item) {
      return await axios.post('s1/growerp/CreateProduct',
      {   productCategoryId: item.productCategoryId, productName: item.name, price: item.price})}
  async updateProduct(item) {
      return await axios.post('s1/growerp/UpdateProduct',
      {   productId: item.productId, productCategoryId: item.productCategoryId,
        productName: item.name, price: item.price})}
  async deleteProduct(id) {
      return await axios.post('s1/growerp/DeleteProduct', { productId: id })}
  async createCategory(item) {
      return await axios.post('s1/growerp/CreateProductCategory',
        { categoryName: item.categoryName,
          preparationAreaId: item.preparationAreaId})}
  async updateCategory(item) {
      return await axios.post('s1/growerp/UpdateProductCategory',
        { productCategoryId: item.productCategoryId,
          categoryName: item.categoryName,
          preparationAreaId: item.preparationAreaId})}
  async deleteCategory(id) {
    return await axios.post('s1/growerp/DeleteProductCategory',
      {   productCategoryId: id})}
  //===============================tasks ====================================
  getMyTasks() {
    axios.get('s1/growerp/GetMyTasks')
    .then((result) => {
      store.commit('tasks', result.data)})}
  async createTask(item) {
      return await axios.post('s1/growerp/CreateTask',
      { workEffortName: item.workEffortName, priority: item.priority,
        description: item.description, partyId: item.userPartyId})}
  async updateTask(item) {
      return await axios.post('s1/growerp/UpdateTask',
      { workEffortId: item.workEffortId, description: item.description,
        workEffortName: item.workEffortName, partyId: item.userPartyId,
        statusId: item.statusId, priority: item.priority})}
  async deleteTask(id) {
      return await axios.post('s1/growerp/DeleteTask', { workEffortId: id })}
  //===============================requests ====================================
  getRequests() {
    axios.get('s1/growerp/GetRequests')
    .then((result) => {
      store.commit('requests', result.data)})}
  async createRequest(item) {
      return await axios.post('s1/growerp/CreateRequest',
      {   requestName: item.requestName,
        description: item.description, partyId: item.partyId})}
  async updateRequest(item) {
      return await axios.post('s1/growerp/UpdateRequest',
      {   requestId: item.requestId, description: item.description,
        requestName: item.requestName, partyId: item.partyId})}
  async deleteRequest(id) {
      return await axios.post('s1/growerp/DeleteRequest', { requestId: id })}
  async createRequestNote(item) {
      return await axios.post('s1/growerp/CreateRequestNote',
      {   requestId: item.requestId,
        text: item.text})}
  // ============================reports =====================================
  async reportSales(period) {
      return await axios.post('s1/growerp/ReportSales', { period: period })}
  // ======================initial data load when app starts==================
  initialData() {
    return axios.all([
      axios.get('s1/growerp/GetCurrentEmployeeUserGroupId'),
      axios.get('s1/growerp/GetActiveSubscriptions'),
      axios.get('s1/growerp/GetAccommodationAreas'),
      axios.get('s1/growerp/GetAccommodationSpots'),
    ])
  }
  initData() {
    return axios.all([
      axios.get('s1/growerp/GetCurrentEmployeeUserGroupId'),
      axios.get('s1/growerp/GetActiveSubscriptions'),
      axios.get('s1/growerp/GetPreparationAreas'),
      axios.get('s1/growerp/GetAccommodationAreas'),
      axios.get('s1/growerp/GetAccommodationSpots'),
      axios.get('s1/growerp/GetProductCategories'),
      axios.get('s1/growerp/GetProducts'),
      axios.get('s1/growerp/GetOrdersAndItemsByPrepAreas'),
      axios.post('s1/growerp/GetOrders',{open: true}), //open orders
      axios.get('s1/growerp/GetAllPartyInfo'),
      axios.get('s1/growerp/GetMyTasks'),
      axios.get('s1/growerp/GetRequests'),
    ])
  }
  async loadDefaultData(env, t) {
    return await axios.post('s1/growerp/LoadDefaultData', {
      environment: env, transData: t })}
  async createSubscription(id,desc) {
    return await axios.post('s1/growerp/CreateSubscription', {
      externalSubscriptionId: id,
      description: desc })}
  async getActiveSubscriptions() {
    return await axios.get('s1/growerp/GetActiveSubscriptions')}
  async exportOrders(date) {
    return await axios.post('s1/growerp/ExportOrders', {
        startDate: date })}
  async exportCustomers() {
    return await axios.get('s1/growerp/ExportCustomers')}
  async exportCatgsProducts() {
    return await axios.get('s1/growerp/ExportCatgsProducts')}
}