import axios from 'axios'
import store from '../store'

let log = false
if (TNS_ENV === 'production') log = false

const restPost = axios.create({
      baseURL: TNS_ENV === 'production' ?
        'https://mobile.growerp.com/rest/'
//          'http://10.0.2.2:8080/rest/'
        : 'http://10.0.2.2:8080/rest/',
//        : 'http://192.168.1.18:8080/rest/',
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

const restGet = axios.create({
      baseURL: TNS_ENV === 'production' ?
        'https://mobile.growerp.com/rest/'
//      'http://10.0.2.2:8080/rest/'
        : 'http://10.0.2.2:8080/rest/',
//        : 'http://192.168.1.18:8080/rest/',
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

            var nstoasts = require("nativescript-toasts");
            var options = {
              text: 'Server error: ' + error.response.data.errors,
              duration : nstoasts.DURATION.LONG,
              position : nstoasts.POSITION.TOP //optional
            }
            nstoasts.show(options)
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
      restPost.defaults.headers['moquiSessionToken'] = store.getters.moquiToken }
    saveKey() {
      restGet.defaults.headers['api_key'] = store.getters.apiKey
      restPost.defaults.headers['api_key'] = store.getters.apiKey}

    // ================getToken,login/out/register password forgot =============
    async getToken() {
        return await restGet.get('moquiSessionToken')}
    async login(user) {
        return await restPost.post('s1/growerp/LoginUser',
            { username: user.name, password: user.password })}
    async checkApiKey() {
        return await restGet.get('s1/growerp/CheckApiKey',
                        { errorHandle: false})}
    async ping() {
        return await restGet.get('s1/growerp/Ping',
                        { errorHandle: false})}
    async getUserGroups() {
        return await restGet.get('s1/growerp/GetUserGroups')}
    async logout() {
        return await restGet.get('logout')}
    async register(user, company) {
        return await restPost.post('s1/growerp/RegisterUserAndCompany',
            {   username: user.name, emailAddress: user.email,
                newPassword: user.password, firstName: user.firstName,
                lastName: user.lastName, locale: user.locale,
                companyPartyId: company.id, // for existing companies
                companyName: company.name, currencyUomId: company.currency,
                companyEmail: company.email? company.email : user.email,
                partyClassificationId : 'AppRestaurant'},
            {   headers: {moquiSessionToken: store.getters.moquiToken},
                errorHandle: false })}
    async resetUserPassword(username) {
        return await restPost.post('s1/growerp/ResetPassword',
            {   username: username },
            {   errorHandle: false,
                headers: {moquiSessionToken: store.getters.moquiToken}})}
    async updatePassword(item) {
        return await restPost.post('s1/growerp/UpdatePassword',
            {   username: item.username, oldPassword: item.oldPassword,
                newPassword: item.newPassword},
            {   errorHandle: false })}
    // ===============table data for valuesProvider===============
    async getAreasAndSpots() {
        await restGet.get('s1/growerp/GetAreasAndSpots').then( result => {
          store.commit("areasAndSpots", result.data.areasAndSpots)})}
    async getPrepAreasAndCategories() {
        await restPost.post('s1/growerp/GetPrepAreasAndCategories').then( result => {
            store.commit("prepAreasAndCategories", result.data.prepAreasAndCategories)})}
    // ================get/update user, user liste================
    async getUser(id=null) {
        return await restPost.post('s1/growerp/GetUser',
            { partyId: id })}
    async createUser(user) { // roletypeid; Customer Employee
         return await restPost.post('s1/growerp/CreateUser',
            {   firstName: user.firstName, lastName: user.lastName,
                emailAddress: user.email, locale: user.locale,
                roleTypeId: user.roleTypeId, externalId: user.externalId,
                groupDescription: user.groupDescription})}
    async updateUser(user) {
        return await restPost.post('s1/growerp/UpdateUser',
            {   partyId: user.partyId, userId: user.loginId,
                username: user.username, firstName: user.firstName,
                lastName: user.lastName, emailAddress: user.email,
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
            {   organizationName: company.name, emailAddress: company.email})}
    // ======================= images ==========================================
    async uploadImage(size, base64, type, id) {
        restPost.post('s1/growerp/UploadImage',
            {   type: type, id: id,
                size: size, contentFile: base64 })}
    async downloadImage(size, type, id) {
        return await restPost.post('s1/growerp/DownloadImage',
            {   size: size, type: type, id: id })}
    // ================(preparation Area)) ===============
    async getPreparationArea(id) {
        return await restPost.post('s1/growerp/GetPrepAreasAndCategories',
            { preparationAreaId: id })}
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
    async getPreparationAreaList(image=true) {
        return await restPost.post('s1/growerp/GetPreparationAreaList',
            {   image: image    })}
    async movePreparationAreaCategory(prepId,newPrepId,catId) {
      return await restPost.post('s1/growerp/MovePreparationAreaCategory',
            {   preparationAreaId: prepId, newPreparationAreaId: newPrepId,
              productCategoryId: catId })}
    // ================ table (AccommodationSpot) ===============
    async GetAccommodationSpot(id) {
        return await restPost.post('s1/growerp/GetAccommodationSpot',
            { accommodationSpotId: id })}
    async createAccommodationSpot(areaId,spotNumber) {
        return await restPost.post('s1/growerp/CreateAccommodationSpot',
            {   accommodationAreaId: areaId, spotNumber: spotNumber})}
    async updateAccommodationSpot(accommodationSpot) {
        return await restPost.post('s1/growerp/UpdateAccommodationSpot',
            {   accommodationSpotId: accommodationSpot.accommodationSpotId,
                description: accommodationSpot.description})}
    async deleteAccommodationSpot(areaId, spotId) {
        return await restPost.post('s1/growerp/DeleteAccommodationSpot',
            {   accommodationAreaId: areaId, accommodationSpotId: spotId})}
    async getAccommodationSpotList(id) {
        return await restPost.post('s1/growerp/GetAccommodationSpotList',
            { accommodationAreaId: id })}
    // ================ table Area (AccommodationArea) ===============
    async getAccommodationArea(id) {
        return await restPost.post('s1/growerp/GetAccommodationArea',
            { accommodationAreaId: id })}
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
    async getAccommodationAreaList(image=true) {
        return await restPost.post('s1/growerp/GetAccommodationAreaList',
            {   image: image })}
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
    async createProduct(name, price, categoryId) {
          return await restPost.post('s1/growerp/CreateProduct',
            {   productCategoryId: categoryId, productName: name, price: price})}
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
                    categoryName: item.categoryName})}
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
            {   workEffortName: item.workEffortName,
                description: item.description, partyId: item.partyId})}
    async updateTask(item) {
          return await restPost.post('s1/growerp/UpdateTask',
            {   workEffortId: item.workEffortId, description: item.description,
                workEffortName: item.workEffortName, partyId: item.partyId,
                statusId: item.statusId, priority: item.priority})}
    async deleteTask(id) {
          return await restPost.post('s1/growerp/DeleteTask', { workEffortId: id })}
    //===============================requests ====================================
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
          restGet.get('s1/growerp/GetUserGroups'),
          restGet.get('s1/growerp/GetAreasAndSpots'),
          restGet.get('s1/growerp/GetCategoriesAndProducts'),
          restPost.post('s1/growerp/GetPrepAreasAndCategories'),
          restPost.post('s1/growerp/GetUserList',{roleTypeId: 'Employee', full: false}),
          restPost.post('s1/growerp/GetUserList',{roleTypeId: 'Customer', full: false}),
          restPost.post('s1/growerp/GetOrdersItemsPartySpot',{open: true}), //open orders
          restGet.get('s1/growerp/GetActiveSubscriptions'),
        ])
        .then(axios.spread(function (GetUserGroups, GetAreasAndSpots, GetCategoriesAndProducts,
              GetPrepAreasAndCategories, GetUsersInStore, GetCustomersInStore,
              GetOrdersItemsPartySpot, GetActiveSubscriptions) {
            store.commit("userGroups", GetUserGroups.data.userGroups)
            store.commit("areasAndSpots", GetAreasAndSpots.data.areasAndSpots)
            store.commit("categoriesAndProducts", GetCategoriesAndProducts.data.categoriesAndProducts)
            store.commit("prepAreasAndCategories", GetPrepAreasAndCategories.data.prepAreasAndCategories)
            store.commit("users", GetUsersInStore.data.users)
            store.commit("customerProvider", GetCustomersInStore.data.users)
            store.commit("openOrders", GetOrdersItemsPartySpot.data.ordersAndItems)
            store.commit("activeSubscriptions", GetActiveSubscriptions.data.subscriptions)
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
}
