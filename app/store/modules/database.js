const state = {
        database: null,
        data: []
    }
const mutations = { //synchronous
        init(state, data) {
            state.database = data.database;
        },
        load(state, data) {
            state.data = [];
            for(var i = 0; i < data.data.length; i++) {
                state.data.push({
                    firstname: data.data[i][0],
                    lastname: data.data[i][1]
                });
            }
        },
        save(state, data) {
            state.data.push({
                firstname: data.data.firstname,
                lastname: data.data.lastname
            });
        }
    }
const actions = { // can be asynchronous
        init(context) {
            (new Sqlite("my.db")).then(db => {
                db.execSQL("CREATE TABLE IF NOT EXISTS people (id INTEGER PRIMARY KEY AUTOINCREMENT, firstname TEXT, lastname TEXT)").then(id => {
                    context.commit("init", { database: db });
                }, error => {
                    console.log("CREATE TABLE ERROR", error);
                });
            }, error => {
                console.log("OPEN DB ERROR", error);
            });
        },
        insert(context, data) {
            context.state.database.execSQL("INSERT INTO people (firstname, lastname) VALUES (?, ?)", [data.firstname, data.lastname]).then(id => {
                context.commit("save", { data: data });
            }, error => {
                console.log("INSERT ERROR", error);
            });
        },
        query(context) {
            context.state.database.all("SELECT firstname, lastname FROM people", []).then(result => {
                context.commit("load", { data: result });
            }, error => {
                console.log("SELECT ERROR", error);
            });
        }
}

   
// export this module.
export default {
  state,
  mutations,
  actions
}
