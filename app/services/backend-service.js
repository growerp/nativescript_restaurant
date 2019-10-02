import axios from 'axios'
import store from '../store'

let log = false
if (TNS_ENV === 'production') log = false

let testUrl = 'http://10.0.2.2:8080/rest/'
let prodUrl = 'https://mobile.growerp.com/rest/' 

const restPost = axios.create({
    baseURL: TNS_ENV === 'production' ?
      prodUrl : testUrl,
    headers:
      {   'Content-Type': 'application/json;charset=UTF-8',
          "Access-Control-Allow-Origin": "*",
          'Access-Control-Allow-Credentials': true,
          'Access-Control-Allow-Headers': 'X-PINGOTHER, Origin, X-Requested-With, Content-Type, Accept',
          'api_key': '',
          'moquiSessionToken': ''
      },
  withCredentials: true,
  timeout: 5000, // 5 seconds
})
const restPostNoApi = axios.create({
    baseURL: TNS_ENV === 'production' ?
      prodUrl : testUrl,
    headers:
      {   'Content-Type': 'application/json;charset=UTF-8',
          "Access-Control-Allow-Origin": "*",
          'Access-Control-Allow-Credentials': true,
          'Access-Control-Allow-Headers': 'X-PINGOTHER, Origin, X-Requested-With, Content-Type, Accept',
          'moquiSessionToken': ''
      },
  withCredentials: true,
  timeout: 5000, // 5 seconds
})

const restGet = axios.create({
      baseURL: TNS_ENV === 'production' ?
      prodUrl : testUrl,
      headers:
        {   'Content-Type': 'application/json;charset=UTF-8',
            "Access-Control-Allow-Origin": "*",
            'Access-Control-Allow-Credentials': true,
            'Access-Control-Allow-Headers': 'X-PINGOTHER, Origin, X-Requested-With, Content-Type, Accept',
            'api_key': ''
        },
    withCredentials: true,
    timeout: 5000, // 5 seconds
})

const axiosSimple = axios.create({
    baseURL: TNS_ENV === 'production' ?
    prodUrl : testUrl,
})

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
        // Do something with request error
        log?console.log('===Request Error Handler: ', error):''
        return Promise.reject(error);
      });

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
            // check for errorHandle config
            if( error.config.hasOwnProperty('errorHandle') && error.config.errorHandle === false ) {
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
//            trace.error("Error in service communication:" + error.response.data.errors);
//            alert(this.getErrorMessage(error))

            var toast = new Toasty({
                text: 'Server error: ' + error.response.data.errors,
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
    alert(message) {
      return alert({
          title: 'GrowERP message:',
          okButtonText: "OK",
          message: message
      });
    }
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
    saveToken() {
        restPost.defaults.headers['moquiSessionToken'] = store.getters.moquiToken
        restPostNoApi.defaults.headers['moquiSessionToken'] = store.getters.moquiToken }
    saveKey(apiKey) {
      restGet.defaults.headers['api_key'] = apiKey
      restPost.defaults.headers['api_key'] = apiKey}
    removeKey() {
        restGet.defaults.headers['api_key'] = null
        restPost.defaults.headers['api_key'] = null}

    // ================getToken,login/out/register password forgot =============
    async getToken() {
        return await axiosSimple.get('moquiSessionToken')}
    async login(user) {
        return await restPostNoApi.post('s1/growerp/LoginUser',
            { username: user.name, password: user.password })}
    async checkApiKey() {
        return await restGet.get('s1/growerp/CheckApiKey',
                        { errorHandle: false})}
    async ping() {
        return await axiosSimple.get('s1/growerp/Ping',
                        { errorHandle: false})}
    async getUserGroups() {
        return await restGet.get('s1/growerp/GetUserGroups')}
    async logout() {
        return await restGet.get('logout')}
    async register(user, company) {
        return await restPostNoApi.post('s1/growerp/RegisterUserAndCompany',
            {   username: user.name, emailAddress: user.emailAddress,
                newPassword: user.password, firstName: user.firstName,
                lastName: user.lastName, locale: user.locale,
                companyPartyId: company.id, // for existing companies
                companyName: company.name, currencyUomId: company.currency,
                companyEmail: company.emailAddress? company.emailAddress : user.emailAddress,
                partyClassificationId : 'AppRestaurant'},
            {   errorHandle: false })}
    async resetUserPassword(username) {
        return await restPost.post('s1/growerp/ResetPassword',
            {   username: username },
            {   errorHandle: false })}
    async updatePassword(item) {
        return await restPost.post('s1/growerp/UpdatePassword',
            {   username: item.username, oldPassword: item.oldPassword,
                newPassword: item.newPassword},
            {   errorHandle: false })}
    // ================get/update user, user liste================
    async getUser(id=null) {
        return await restPost.post('s1/growerp/GetUser',
            { partyId: id })}
    async createUser(user) { // roletypeid; Customer Employee
         return await restPost.post('s1/growerp/CreateUser',
            {   firstName: user.firstName, lastName: user.lastName,
                emailAddress: user.emailAddress, locale: user.locale,
                roleTypeId: user.roleTypeId, externalId: user.externalId,
                groupDescription: user.groupDescription})}
    async updateUser(user) {
        return await restPost.post('s1/growerp/UpdateUser',
            {   partyId: user.partyId, userId: user.loginId,
                username: user.username, firstName: user.firstName,
                lastName: user.lastName, emailAddress: user.emailAddress,
                groupDescription: user.groupDescription})}
    async deleteUser(partyId) {
        return await restPost.post('s1/growerp/DeleteUser',
            {   partyId: partyId})}
    async getUserList(roleTypeId,partyId=null,full=true) {
        return await restPost.post('s1/growerp/GetUserList',
          {roleTypeId: roleTypeId, partyId: partyId, full: full})}
    async getCustomersInStore() {
          await restPost.post('s1/growerp/GetUserList',
                {roleTypeId: 'Customer', partyId: null, full: false})
          .then( result => {store.commit("customerProvider", result.data.users)})}
    async getUsersInStore() {
            await restPost.post('s1/growerp/GetUserList',{full: false})
            .then( result => { store.commit('users', result.data.users)})}
    // ===================company ==============================================
    async getCompany() {
        return await restGet.get('s1/growerp/GetCompany')}
    async updateCompany(company) {
        return await restPost.post('s1/growerp/UpdateCompany',
            {   organizationName: company.organizationName, emailAddress: company.emailAddress})}
    // ======================= images ==========================================
    async uploadImage(size, base64, type, id) {
        restPost.post('s1/growerp/UploadImage',
            {   type: type, id: id,
                size: size, contentFile: base64 })}
    async downloadImage(size, type, id) {
        return await restPost.post('s1/growerp/DownloadImage',
            {   size: size, type: type, id: id })}
    // ================(preparation Area)) ===============
    async getPreparationAreas() {
        return await restget.get('s1/growerp/GetPreparationAreas')}
    async createPreparationArea(item) {
        return await restPost.post('s1/growerp/CreatePreparationArea',
            {   description: item.description})}
    async updatePreparationArea(item) {
        return await restPost.post('s1/growerp/UpdatePreparationArea',
            {   preparationAreaId: item.preparationAreaId,
                description: item.description})}
    async deletePreparationArea(id) {
        return await restPost.post('s1/growerp/DeletePreparationArea',
            {   preparationAreaId: id})}
    // ================ table Area (AccommodationArea) ===============
    async getAccommodationAreas() {
        return await restPost.post('s1/growerp/GetAccommodationAreaList')}
    async createAccommodationArea(accommodationArea) {
        return await restPost.post('s1/growerp/CreateAccommodationArea',
            {   description: accommodationArea.description,
                nbrOfSpots: accommodationArea.nbrOfSpots,
                nbrOfSeats: accommodationArea.nbrOfSeats})}
    async updateAccommodationArea(accommodationArea) {
        return await restPost.post('s1/growerp/UpdateAccommodationArea',
            {   accommodationAreaId: accommodationArea.accommodationAreaId,
                description: accommodationArea.description})}
    async deleteAccommodationArea(id) {
        return await restPost.post('s1/growerp/DeleteAccommodationArea',
            {   accommodationAreaId: id})}
    // ================ table (AccommodationSpot) ===============
    async getAccommodationSpots() {
        return await restPost.post('s1/growerp/GetAccommodationSpots')}
    async createAccommodationSpot(areaId,spotNumber) {
        return await restPost.post('s1/growerp/CreateAccommodationSpot',
            {   accommodationAreaId: areaId, spotNumber: spotNumber})}
    async deleteAccommodationSpot(spotId) {
        return await restPost.post('s1/growerp/DeleteAccommodationSpot',
            {   accommodationSpotId: spotId})}
    //==================
    parseLocale(locale) {
        var lang = ""
        var localeUnderscoreIndex = locale.indexOf('_')
        if (localeUnderscoreIndex > 0) {
            lang = locale.substring(0, localeUnderscoreIndex)
        } else {
            lang = locale;
        }
        return lang;
    }

    // ======================== order ======================
    async getOrder(orderId) {
        return await restPost.post('s1/growerp/GetOrder',
            { orderId: orderId})}
    async getOrdersAndItems(statusId, prepId = null) {
        return await restPost.post('s1/growerp/GetOrdersAndItems',
            { statusId: statusId, preparationAreaId: prepId})}
    async getOrdersItemsPartySpot(open=true, startDate=null) {
        return await restPost.post('s1/growerp/GetOrdersItemsPartySpot',
            { open: open, startDate: startDate})}
    async createSalesOrder(header,items) {
       return await restPost.post('s1/growerp/CreateSalesOrder',
            {orderHeader: JSON.stringify(header), orderItems: JSON.stringify(items)})}
    async changeOrderPartStatus(orderId, partId, statusId) {
        return await restPost.post('s1/growerp/ChangeOrderPartStatus',
             {orderId: orderId, orderPartSeqId: partId, statusId: statusId})}
    // ================ Category and Product (Store)===============
    async getProduct(id) {
          return await restPost.post('s1/growerp/GetProduct', { productId: id })}
    async getProductList(productCategoryId=null) {
          return await restPost.post('s1/growerp/GetProductList',
            { productCategoryId: productCategoryId})}
    async createProduct(item) {
          return await restPost.post('s1/growerp/CreateProduct',
            {   productCategoryId: item.productCategoryId, productName: item.name, price: item.price})}
    async updateProduct(item) {
          return await restPost.post('s1/growerp/UpdateProduct',
            {   productId: item.productId, productCategoryId: item.productCategoryId,
                productName: item.name, price: item.price})}
    async deleteProduct(id) {
          return await restPost.post('s1/growerp/DeleteProduct', { productId: id })}
          async getCategoriesAndProducts() {
    await restGet.get('s1/growerp/GetCategoriesAndProducts').then( result => {
          store.commit("categoriesAndProducts", result.data.categoriesAndProducts)})}
    async getCategoryList(prepId=null) {
          return await restPost.post('s1/growerp/GetProductCategoryList',
              { preparationAreaId: prepId})}
    async getCategory(id) {
          return await restPost.post('s1/growerp/GetProductCategory',
              {  productCategoryId: id})}
    async createCategory(item) {
          return await restPost.post('s1/growerp/CreateProductCategory',
              {   categoryName: item.categoryName,
                  preparationAreaId: item.preparationAreaId})}
    async updateCategory(item) {
            return await restPost.post('s1/growerp/UpdateProductCategory',
                {   productCategoryId: item.productCategoryId,
                    categoryName: item.categoryName,
                    preparationAreaId: item.preparationAreaId})}
    async deleteCategory(id) {
        return await restPost.post('s1/growerp/DeleteProductCategory',
            {   productCategoryId: id})}
    //===============================tasks ====================================
    async getTaskList(my) {
        return await restPost.post('s1/growerp/GetTaskList',{my: my})}
    async getTask(id) {
          return await restPost.post('s1/growerp/GetTask', { workEffortId: id })}
    async createTask(item) {
          return await restPost.post('s1/growerp/CreateTask',
            {   workEffortName: item.workEffortName, priority: item.priority,
                description: item.description, partyId: item.userPartyId})}
    async updateTask(item) {
          return await restPost.post('s1/growerp/UpdateTask',
            {   workEffortId: item.workEffortId, description: item.description,
                workEffortName: item.workEffortName, partyId: item.userPartyId,
                statusId: item.statusId, priority: item.priority})}
    async deleteTask(id) {
          return await restPost.post('s1/growerp/DeleteTask', { workEffortId: id })}
    //===============================requests ====================================
    async getRequests(my) {
            restGet.get('s1/growerp/GetRequests')
            .then((result) => {
                store.commit('requests', result.data)
            })}
    async getRequestList(my) {
        return await restPost.post('s1/growerp/GetRequestList', {my: my})}
    async getRequest(id) {
          return await restPost.post('s1/growerp/GetRequest', { requestId: id })}
    async createRequest(item) {
          return await restPost.post('s1/growerp/CreateRequest',
            {   requestName: item.requestName,
                description: item.description, partyId: item.partyId})}
    async updateRequest(item) {
          return await restPost.post('s1/growerp/UpdateRequest',
            {   requestId: item.requestId, description: item.description,
                requestName: item.requestName, partyId: item.partyId})}
    async deleteRequest(id) {
          return await restPost.post('s1/growerp/DeleteRequest', { requestId: id })}
    async createRequestNote(item) {
          return await restPost.post('s1/growerp/CreateRequestNote',
            {   requestId: item.requestId,
                text: item.text})}
    // ============================reports =====================================
    async reportSales(period) {
          return await restPost.post('s1/growerp/ReportSales', { period: period })}
    // ======================initial data load when app starts==================
    initData() {
        axios.all([
          restGet.get('s1/growerp/GetPreparationAreas'),
          restGet.get('s1/growerp/GetAccommodationAreas'),
          restGet.get('s1/growerp/GetAccommodationSpots'),
          restGet.get('s1/growerp/GetProductCategories'),
          restGet.get('s1/growerp/GetProducts'),
          restPost.post('s1/growerp/GetOrdersItemsPartySpot',{open: true}), //open orders
        ])
        .then(axios.spread(function ( GetPreparationAreas,GetAccommodationAreas,GetAccommodationSpots,
          GetProductCategories, GetProducts, GetOrdersItemsPartySpot) {
                store.commit("preparationAreas", GetPreparationAreas.data.preparationAreas)
                store.commit("accommodationAreas", GetAccommodationAreas.data.accommodationAreas)
                store.commit("accommodationSpots", GetAccommodationSpots.data.accommodationSpots)
                store.commit("productCategories", GetProductCategories.data.productCategories)
                store.commit("products", GetProducts.data.products)
                store.commit("openOrders", GetOrdersItemsPartySpot.data.ordersAndItems)
            }))
  }
  async createSubscription(id,desc) {
        return await restPost.post('s1/growerp/CreateSubscription', {
          externalSubscriptionId: id,
          description: desc
        })
  }
  async getActiveSubscriptions() {
        return await restGet.get('s1/growerp/GetActiveSubscriptions')
  }
  async getCurrencyList() {
      return await restGet.get('s1/growerp/CurrencyList')
  }
  getAllPartyInfo() {
      restGet.get('s1/growerp/GetAllPartyInfo')
      .then((result) => {
          store.commit('allPartyInfo', result.data)
      })
  }
  getMyTasks() {
      restGet.get('s1/growerp/GetMyTasks')
      .then((result) => {
        store.commit('tasks', result.data)
      })
  }

  async getCurrentEmployeeUserGroupId() {
    return await restGet.get('s1/growerp/GetCurrentEmployeeUserGroupId')
  }
}
