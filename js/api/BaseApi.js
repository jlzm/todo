
let store = require('../utile/store');

module.exports = BaseApi;

function BaseApi(list, max_id){
    this.max_id = max_id;
    this.list = list;
    this.$load_list(this.list, this.max_id);
}

BaseApi.prototype.$add = add;
BaseApi.prototype.$remove = remove;
BaseApi.prototype.$modify = modify;
BaseApi.prototype.$read = read;
BaseApi.prototype.$find_row_id = find_row_id;
BaseApi.prototype.$sync_to = sync_to;
BaseApi.prototype.$sync_from = sync_from;
BaseApi.prototype.$load_list = load_list;

//把 localStorage 的值取出 赋值给 this.list
function load_list(default_list, default_max_id) {
    this.list = this.$sync_from().list || default_list;
    this.max_id = this.$sync_from().max_id || default_max_id;
}


function add(row){
    row.id = this.max_id++;
    this.list.unshift(row);
    this.$sync_to();  
}

function remove(id){
    if(id < 0 )
        return;
    this.list.splice(find_list_by_id(this.list, id), 1);
    this.$sync_to();
}

function modify(id, new_row){
    let item = find_list_by_id(this.list, id);
    let old_row =this.list[item];
    this.list[item] = Object.assign({}, old_row, new_row);
    this.$sync_to();
}

function read(){
    return this.list;
}

//找到数组索引
function find_list_by_id(list, id){
    return list.findIndex(function (item){
         return item.id == id;
     });  
 }
 
 //找到数组索引的内容
 function find_list_by_row(list, id){
    return list.find(function (item){
         return item.id == id;
    });
 }

 function find_row_id(id){
    return find_list_by_row(this.list, id);
 }

 function sync_to(){
    store.set(this._model_name+'-list', this.list);
    store.set(this._model_name+'-max_id', this.max_id);
 }  

 function sync_from(){
    return  {
        list: store.get(this._model_name+'-list', this.list),
        max_id: store.set(this._model_name+'-max_id', this.max_id)
    }
 }