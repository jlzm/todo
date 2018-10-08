let TaskApi = require('../api/taskApi');
let helper = require('../utile/helper');

module.exports = TaskUi;

function TaskUi(config){
    this._model_name = 'task';
    let default_config = {
        form_selector: '#task-form',
        list_selector: '#task-list',
        completed_list_selector: '.completed',
        incomplete_list_selector: '.incomplete',
        input_selector: '#task-input',
        select_selector:'#task-select',
        init_fn: null,
        input_focus: null,
        input_blur: null,
        add_succeed_fn: null
    }
    let cfg = this.config = Object.assign({}, default_config, config);
    this.form = document.querySelector(cfg.form_selector);
    this.input = document.querySelector(cfg.input_selector);
    this.list = document.querySelector(cfg.list_selector);
    this.completed_list = this.list.querySelector(cfg.completed_list_selector);
    this.incomplete_list = this.list.querySelector(cfg.incomplete_list_selector);
    this.select = document.querySelector(cfg.select_selector);
    this._api = new TaskApi();
}


//私有
TaskUi.prototype.remove_row = remove_row;

//外部
TaskUi.prototype.clear_form = helper.clear_form;
TaskUi.prototype.get_todo_data = helper.get_todo_data;
TaskUi.prototype.set_todo_data = helper.set_todo_data;

TaskUi.prototype.init = init;
TaskUi.prototype.render = render;

//事件
TaskUi.prototype.detect_submit = detect_submit;
TaskUi.prototype.detect_list = detect_list;
TaskUi.prototype.detect_input_focus = detect_input_focus;
TaskUi.prototype.detect_input_blur = detect_input_blur;


function init(){
    this.render(1);
    this.detect_submit();
    this.detect_list();
    if(this.config.init_fn)
        this.config.init_fn();
    this.detect_input_focus();
    this.detect_input_blur();
}

function detect_input_focus(){
    let task_this = this;
    this.input.addEventListener('focus', function (){
        if(task_this.config.input_focus)
            task_this.config.input_focus();
    });
}

function detect_input_blur(){
    let task_this = this;
    this.input.addEventListener('blur', function (){
        if(task_this.config.input_blur)
            task_this.config.input_blur();
    });
}


function detect_submit(){
    let task_this = this;
    this.form.addEventListener('submit', function (e){
        e.preventDefault();
        if(task_this.form.querySelector('[name = title]').value == '')
            return;
        let task_form = task_this.get_todo_data(task_this.form);
        if(task_form.id)
            task_this._api.modify(task_form.id, task_form);
        else
            task_this._api.add(task_form);
        if(task_this.config.input_blur)
            task_this.config.input_blur();
        if(task_this.config.add_succeed_fn)
            task_this.config.add_succeed_fn(task_form.cat_id);
        task_this.render(task_form.cat_id);
        task_this.clear_form(task_this.form);
        task_this.form.querySelector('[type = submit]').innerHTML = '添加';
    });
}

function detect_list(){
    let task_this = this;
    this.list.addEventListener('click', function(e){
        let delete_click = e.target.classList.contains('task-delete')
        , modify_click = e.target.classList.contains('task-modify')
        , checker_click = e.target.classList.contains('checker')
        ;
        let task_item = e.target.closest('.task-item');
        
        let task_id
          ;
        if(task_item){
            task_id = parseInt(task_item.dataset.id);
        }

        if(delete_click){
            task_this.remove_row(task_id);  
            task_this.render(e.target.closest('.tool-set').dataset.id);
        }
        else if(modify_click){
            let task_row  = task_this._api.$find_row_id(task_id);
            task_this.set_todo_data(task_this.form, task_row);
            task_this.form.querySelector('[type = submit]').innerHTML = '确认';
        }
        else if(checker_click){
            task_this._api.set_completed(task_id, e.target.checked);
            task_this.render(e.target.closest('.check').dataset.id);
        }
    });
}

function remove_row(id){
    this._api.remove(id);
    this.render();
}

function render(cat_id){
    let task_this = this;
    let task_list = cat_id ? this._api.read_by_cat(cat_id): this._api.read();
    let holder = `<div class="empty">空</div>`;
    this.incomplete_list.innerHTML =this.completed_list.innerHTML = '';
    task_list.forEach(function (item){
        if(item.completed){
            task_this.completed_list.innerHTML += 
            _insert_row(item);
        }
        else{
            task_this.incomplete_list.innerHTML += 
            _insert_row(item);
        }
        });
    if (!this.incomplete_list.innerHTML)
        this.incomplete_list.innerHTML = holder;
    if (!this.completed_list.innerHTML)
        this.completed_list.innerHTML = holder;
}

function _insert_row(row){
    return `
    <div class="task-item cl_fl" data-id="${row.id}">
        <div class="check"  data-id="${row.cat_id}">
            <input class="checker" type="checkbox" ${row.completed ? 'checked' : ''}>
        </div>
        <div class="col detail">
            <div class="title">${row.title}</div>
        </div>
        <div class="tool-set" data-id="${row.cat_id}">
            <button class="task-modify">修改</button>
            <button class="task-delete">删除</button>
        </div>
    </div>
`;
}


