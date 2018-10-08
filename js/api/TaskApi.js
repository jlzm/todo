let BaseApi = require('./baseApi');

module.exports = TaskApi;

let taskList =  [
    {
        id: 1,
        title: '起床',
        completed: true,
        cat_id: 1
    }
];

function TaskApi(max_id){
    this._model_name = 'task';
    this.max_id = max_id || 2;
    this.list = taskList || [];
    BaseApi.call(this, this.list, this.max_id);
}

//继承父级原型
TaskApi.prototype = Object.create(BaseApi.prototype); 

TaskApi.prototype.add = add;
TaskApi.prototype.remove = remove;
TaskApi.prototype.modify = modify;
TaskApi.prototype.read = read;
TaskApi.prototype.read_by_cat = read_by_cat;
TaskApi.prototype.remove_cat_row = remove_cat_row;
TaskApi.prototype.set_completed = set_completed;


function add(row){
    if(!row.title)
        return;
    if(!row.cat_id)
        row.cat_id = 1;
    return this.$add(row);
}

function remove(id){
    return this.$remove(id);
}

function modify(id, new_row){
    return this.$modify(id, new_row);
}

function read(){
    return this.list =  this.$read();
}

function read_by_cat(cat_id){
    let task_list = this.read();

    let result = task_list.filter(function (row){
        return row.cat_id == cat_id;
    });
    return result;
}


function remove_cat_row(cat_id){
    this.list = this.list.filter(function (item){
        return item.cat_id != cat_id;
        this.$sync_to();
    });
}

function set_completed (id, completed) {
    let row = this.$find_row_id(id);
    if (!row)
      return false;
    row.completed = completed;
    this.$sync_to();
}