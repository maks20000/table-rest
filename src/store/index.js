import vue from "vue"
import axios from 'axios'
import VueAxios from 'vue-axios'
import vuex from "vuex"

vue.use(vuex, VueAxios, axios)

export default new vuex.Store ({
    state: {
        data:null,
        filterData:null,
    },

    actions: {
        loadData (context) {
            axios.get("data/json.json")
            .then((response)=>{
                context.commit("setData",response.data)
                context.commit("setFilterData",response.data)})
        },
        sortDataKey(context, {key, type}) {
            var data 
            if (type==0)
            {
                data=context.getters.asort(key);
            }
            else 
            {
                data=context.getters.dsort(key);
            }
            context.commit("setFilterData",data);
        },
        search (context, {keys, searchStr, range}) {
            let result = new Array();
            let start = new Date(range.start).getTime();
            let end = new Date(range.end).getTime();
            if (isNaN(start)) start=0;
            if (isNaN(end)) end = Date.now();
            if (context.getters.getMainData!=null) {
                context.getters.getMainData.forEach((item)=>{
                    for(let i=0; i<keys.length; i++) {
                        let date = new Date(item.inspection_date).getTime()
                        if ((keys[i].edit || searchStr=="") && date>=start && date<=end) {
                            if (item[keys[i].el].toLowerCase().indexOf(searchStr.toLowerCase())!=-1) {
                                result.push(item)
                                break
                            }
                        }
                    };
                })
            }
            context.commit("setFilterData",result)
        },

        changeDataField (context, {id,index,key,value}) {
            let d = context.state.filterData;
            d[index][key]=value;
            context.commit("setFilterData",d);

            for (let i=0; i<context.state.data.length; i++) {
                if (context.state.data[i]._id.$oid.indexOf(id)==0) { 
                    context.state.data[i][key]=value;
                    break;
                }
            }
            
        }

    },
    mutations: {
        setData(state, data) {
            state.data=data;
        },
        setFilterData(state, data) {
            state.filterData=data;
        },
        addField (state, key) {
           
            for (let i=0; i<state.data.length; i++) {
                state.data[i][key]="";
            }

            for (let i=0; i<state.filterData.length; i++) {
                state.filterData[i][key]="";
            }
            
        }
    },

    getters: {
        getData (state) {
            return state.filterData;
        },

        getMainData (state) {
            return state.data;
        },

        getFromKey: (state) => (key)=> {
            var result = new Array();
            if (state.data!=null) {
                state.data.forEach((item)=>{
                    result.push(item[key])
                })
            }
            return result;
        },

        asort: (state) => (key)=> {
            return state.filterData.sort((a,b)=>
                a[key].localeCompare(b[key])
            );
        },

        dsort: (state) => (key)=> {
            return state.filterData.sort((a,b)=>
                b[key].localeCompare(a[key])
            );
        },
    }

})