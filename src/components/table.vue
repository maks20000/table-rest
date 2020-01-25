<template>
<div class="table">
    <div class="table-row header">
        <div class="name">Инспекция по ресторанам</div>
        <div :class="{active:list}" class="edit">
            <div>Редактировать таблицу</div>
            <ul  class="list">
                <li v-for="(field, index) in canEdit()" :key="index">
                        <div class="check">
                            <div class="checkbox">
                                <input :checked="false" :id="'check'+index" type="checkbox" v-model="field.edit" :value="field.edit">
                                <label :for="'check'+index">{{field.name}}</label>
                            </div>
                        </div>
                </li>
                <li class="hide">
                    <div class="center">Скрыть поле</div>
                    <ul class="list-hide">
                        <li v-for="(field2, j) in fields" :key="j">
                            <div class="check">
                                <div class="checkbox">
                                    <input :id="'show'+j" type="checkbox" v-model="field2.show" :value="field2.show">
                                    <label :for="'show'+j">{{field2.name}}</label>
                                </div>
                            </div>
                        </li>
                    </ul>
                </li>
                <li>
                    <div class="center input-add">
                        <input @keyup.enter="addField($event.target.value)" v-if="add" type="text" >
                        <div @click="add=true" v-else class="center">Добавить поле</div>
                    </div>
                </li>
            </ul>
        </div>
        <div class="search">
            <input @input="search($event.target.value)" v-model="searchField" type="search" placeholder="Поиск по полям таблицы">
            <div class="date-check">
                <input type="checkbox" v-model="dateSearch" :value="false">
                <label>Задать диапазон</label>
            </div>
            <div v-if="dateSearch" class="date-range">
                <Label><div>От</div><input @change="search(searchField)" v-model="dateRange.start" type="date"></Label>
                <Label><div>До</div><input @change="search(searchField)" v-model="dateRange.end" type="date"></Label>
            </div>
        </div>
    </div>
    <table cellpadding="0" cellspacing="0">
        <tr>
            <td v-for="(field, index) in fields" :key="index" v-show="field.show">
                <div 
                    @click="sortField(field,index)" 
                    class="field field-stat title" 
                    :class="{noBorder: index==fields.length-1, 
                    asort:(sort==index && field.sort==0),
                    dsort:(sort==index && field.sort==1)}">
                    {{field.name}}
                </div>
            </td>
        </tr>
        <tr :class="setClass(item[keyClass])" v-for="(item, j) in getData" :key="j" >
                <td v-for="(field, index) in fields" :key="index" v-show="field.show">
                    <div :class="{noBorder: index==fields.length-1}" class="field"  >
                            <input
                                :id="'input_'+j+'_'+index"
                                v-if="!item.date && !field.select && !field.date" 
                                @change="changeField(item, j,field.el,$event.target.value)" 
                                @input="'size='+$event.target.value.length+1"
                                :readonly="!field.edit" class ="field-input"
                                :value="item[field.el]"
                                :size="setSize(item[field.el])"
                                > 
                            <input 
                            :id="'input_'+j+'_'+index"
                            :type="editDate(field.edit)" @change="changeField(item, j,field.el,$event.target.value)" 
                            v-else-if="field.date" :readonly="!field.edit" 
                            class ="field-input"
                                :class="{noBorder: index==fields.length-1}"
                                :value="item[field.el]">
                            <select
                            :id="'input_'+j+'_'+index"
                            @change="changeField(item, j,field.el,$event.target.value)" :disabled="!field.edit" class="field-input" 
                            v-else-if="field.select" :value="item[field.el]">
                                <option v-for="option in field.selectValue" :value="option" :key="option">{{option}}</option>
                            </select>
                    </div>
                </td>
        </tr>
    </table>
    <div class="floor">Всего элементов: {{elementCount()}}</div>
</div>
</template>

<script>
import {mapGetters} from 'vuex'
export default {
    data () {
        return {
            add:false,
            searchField:"",
            sort:-1,
            list:false,
            dateSearch: false,
            keyClass:"inspection_description",
            dateRange:{
                start:"",
                end:""
            },
            fields:[
                {
                    name:"Название ресторана",
                    el:"business_name",
                    canEdit:true,
                    edit:true,
                    sort:-1,
                    show: true,
                },
                {
                    name:"Адрес ресторана",
                    el:"business_address",
                    canEdit:true,
                    edit:true,
                    sort:-1,
                    show: true,
                },
                {
                    name:"Город",
                    el:"business_city",
                    canEdit:true,
                    edit:true,
                    sort:-1,
                    show: true,
                },
                {
                    name:"Штат",
                    el:"business_state",
                    canEdit:false,
                    edit:false,
                    sort:-1,
                    show: false,
                },
                {
                    name:"Телефон",
                    el:"business_phone_number",
                    canEdit:true,
                    edit:true,
                    sort:-1,
                    show: true,
                },
                {
                    name:"Описание местоположения",
                    el:"business_location",
                    canEdit:false,
                    edit:false,
                    sort:-1,
                    show: false,
                },
                {
                    name:"Почтовый индекс",
                    el:"business_postal_code",
                    canEdit:true,
                    edit:true,
                    sort:-1,
                    show: true,
                },
                {
                    name:"Дата инспекции",
                    el:"inspection_date",
                    canEdit:true,
                    edit:false,
                    date:true,
                    sort:-1,
                    show: true,
                },
                {
                    name:"Статус инспекции",
                    el:"inspection_description",
                    canEdit:true,
                    edit:true,
                    sort:-1,
                    show: true,
                    select: true,
                    selectValue: [
                        "NO ACTION",
                        "REINSPECTION REQUIRED",
                        "SHORTER DATE ADVANCE",
                        "ISSUED PERMIT",
                    ],
                    selected:""
                },
                {
                    name:"Тип проведения инспекции",
                    el:"inspection_type",
                    canEdit:true,
                    edit:true,
                    sort:-1,
                    show: true,
                    select: true,
                    selectValue: [
                        "Regular",
                        "Opening",
                        "Reinspection",
                        "Other",
                        "Change of Ownership",
                        "Complaint",
                        "Enforcement"
                    ],
                    selected:""
                },
            ]
        }
    },
    methods: {
        sortField(field,index) {
            field.sort++;
            if (field.sort>1) field.sort=0
            this.sort=index
            this.$store.dispatch("sortDataKey",{key:field.el,type:field.sort})
        },

        canEdit() {
            return this.fields.filter((item)=>{
                return (item.canEdit)
            })
        },

        changeField (item, index, key, value) {
            this.$store.dispatch("changeDataField",{id:item._id.$oid, index:index,key:key,value:value});
        },

        editDate (edit) {
            if (edit) return "date"
            else return "text"
        },

        search (searchStr) {
            this.$store.dispatch("search",{keys:this.fields, searchStr:searchStr, range:this.dateRange})
        },

        setSize(value) {
            if (value!=null) return value.length+1
            return 0
        },

        setClass(value) {
            switch(value) {
                case "ISSUED PERMIT" :
                    return "green";
                case "REINSPECTION REQUIRED" :
                    return "red";
                case "SHORTER DATE ADVANCE" :
                    return "blue";
                default: 
                    return "";
            }
        },
        addField (name) {
            let key = "field"+this.fields.length;
            let newField = {
                    name:name,
                    el:key,
                    canEdit:true,
                    edit:false,
                    sort:-1,
                    show: true,
                }
            this.fields.push(newField);
            this.add=false;
            let data = {name:name, key:key}
            this.$store.commit("addField",key)
        },
        elementCount () {
            if (this.getData!=null) return this.getData.length
            return 0
        },
    },

    computed: {
        ...mapGetters(["getData", "getFromKey"]),
    },
    mounted() {
      this.$store.dispatch("loadData");
    }
}
</script>

<style lang="sass" scope>
#app 
    display: flex
    justify-content: center
    .table
        padding: 15px
        table
            border-collapse: collapse
            border: 1px solid #000000
            width: 100%
            tr 
                border-bottom: 1px solid #000
                box-sizing: border-box
                td 
                    position: relative
                   
                    
    .table-row, .table-data 
        display: flex
        padding: 20px 0px 20px 0
        border: 1px solid #000
        border-bottom: 0px
    .field 
        position: relative
        display: flex
        justify-content: center
        align-items: center
        height: 50px
        width: 100%
        &:before 
            content: ""
            position: absolute
            width: 1px
            height: 20px
            top: calc( 50% - 10px ) 
            right: 0px
            background: #000
        &-input, &-stat
            height: 50px
            font-size: 14px
            box-sizing: border-box
            padding: 5px 18px 5px 18px
            text-align: center
            border: 0px
        select 
            background: inherit
            color: #000
            font-size: 15px
            text-align-last: center
            text-align: center
            width: 100%
            -webkit-appearance: none
            -moz-appearance: none
            appearance: none
        input
            font-family: Roboto
            background: inherit
            width: inherit
            font-size: 16px
            overflow: hidden
        input[type="date"] 
            display: block
            width: 100%
            font-family: Roboto
    .title 
        font-size: 16px
        cursor: pointer
        width: 100%
        &:before 
            content: ""
            position: absolute
            width: 2px
            height: 20px
            top: calc( 50% - 10px ) 
            right: 0px
            background: #000
    .dsort
        &:after
            content: "\25BC"
            position: absolute
            right: 15px
    .asort
        &:after
            content: "\25B2"
            position: absolute
            right: 15px
            
    .noBorder
        &:before
            width: 0
    .table-data
        padding-bottom: 0px
        padding-top: 0px
    .header 
        display: flex
        justify-content: flex-end
        align-items: center
        padding-left: 55px
        .name
            font-weight: bold
            font-size: 20px
            line-height: 28px
            
            flex-grow: 1
        .edit 
            width: 335px
            height: 46px
            font-size: 18px
            display: flex
            align-items: center
            justify-content: center
            border: 1px solid rgba(0, 0, 0, 0.5)
            box-sizing: border-box
            margin-right: 33px
            margin-left: 31px
            position: relative
            cursor: pointer
            .list, .list-hide 
                display: none
                position: absolute
                width: 100%
                top: 100%
                list-style: none
                margin: 0
                padding: 0
                border: 2px solid rgba(0, 0, 0, 0.5)
                z-index: 1

                .center 
                    text-align: center
                    display: flex 
                    justify-content: center
                    width: 100%
                li 
                    min-width: 100%
                    height: 45px
                    display: flex
                    align-items: center
                    border-bottom: 1px solid #000000
                    background: #fff
                    &:last-child
                        border-bottom: 0px
                input[type=checkbox] 
                    display: none
                
                label:before 
                    content: ""
                    display: inline-block
                    position: absolute
                    left: -41px
                    bottom: -5px
                    width: 30px
                    height: 30px
                    margin-right: 10px
                    background: url("../assets/svg/close.svg") no-repeat center
                    background-size: contain
                
                .checkbox label 
                    margin-left: 49px
                    font-size: 20px
                    cursor: pointer
                    display: block
                    position: relative

                input[type=checkbox]:checked + label:before 
                    content: ""
                    background: url("../assets/svg/check.svg") no-repeat center
                    background-size: contain
                    width: 45px
                    height: 45px
                    left: -47px
                    bottom: -10px
                .input-add 
                    display: flex
                    justify-content: center
                    align-items: center
                    height: 100%
                    input
                        width: 70%
                        height: 60%
                        padding-left: 10px

            &:hover
                background: #D9D9D9
                .list 
                    display: block
                    
        
        .hide 
            position: relative
            .list-hide
                left: 100%
                top: 0
                label:before 
                    content: ""
                    margin-right: 10px
                    border: 1px solid #000
                    left: -39px
                    background: #fff
                input[type=checkbox]:checked + label:before 
                    content: "\1F441"
                    text-align: center
                    width: 30px
                    height: 30px
                    left: -39px
                    bottom: -5px
                    background: #fff

            &:hover
                .list-hide
                    display: block        
        .search 
            position: relative
            width: 429px
            margin-right: 43px
            input[type='search'], input[type='date']
                border: 1px solid #999999
                box-sizing: border-box
                width: 100%
                height: 46px
                padding-left: 32px
                font-size: 18px
            .date-check
                position: absolute
                bottom: -22px
                font-size: 18px
            .date-range
                position: absolute
                width: 100%
                display: flex
                justify-content: space-between
                align-items: center
                margin-top: 5px
                z-index: 1
                background: #fff
                margin-top: 20px
                top: 100%
                input
                    width: 200px
                    margin: 0
    .floor
        text-align: right
        width: 100%
        border: 1px solid #000
        border-top: 0px
        box-sizing: border-box
        padding: 10px 30px
    .green
        background: rgba(46, 167, 73, 0.1)
    .red
        background: rgba(218, 51, 72, 0.1)
    .blue
        background: rgba(23,125,252, 0.1)
                    

</style>