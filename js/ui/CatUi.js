let CatApi = require('../api/catApi');
let helper = require('../utile/helper');

module.exports = CatUi;

function CatUi(config){
    this._model_name = 'cat';
    let default_config = {
        form_selector: '#cat-form',
        add_btn_selector: '#add-cat',
        list_selector: '#cat-list',
        click_fn : null,
        delete_fn: null,
        add_fn: null
    }

    let cfg = this.config = Object.assign({}, default_config, config);
    this.form = document.querySelector(cfg.form_selector);
    this.add_btn = document.querySelector(cfg.add_btn_selector);
    this.list = document.querySelector(cfg.list_selector);
    this._api = new CatApi();
    this.updating_item = null;
}

// 外部原型
CatUi.prototype.clear_form = helper.clear_form;
CatUi.prototype.get_todo_data = helper.get_todo_data;
CatUi.prototype.set_todo_data = helper.set_todo_data;

CatUi.prototype.init = init;
CatUi.prototype.detect_add_btn = detect_add_btn;
CatUi.prototype.detect_click_form = detect_click_form;
CatUi.prototype.render = render;
CatUi.prototype.detect_list = detect_list;
CatUi.prototype.remove_row = remove_row;
CatUi.prototype.show_form = show_form;
CatUi.prototype.hide_form = hide_form;
CatUi.prototype.detect_submit_list = detect_submit_list;
CatUi.prototype.show_updating_item = show_updating_item;
CatUi.prototype.set_item_active = set_item_active;
CatUi.prototype.reset_form_location = reset_form_location;


function init(){
    this.detect_submit_list();
    this.detect_click_form();
    this.detect_add_btn();
    this.detect_list();
    this.render();
}

/*当分类表单被点击时做什么*/
function detect_click_form () {
   let cat_this = this;
   this.form.addEventListener('click', function (e) {
        if(e.target.classList.contains('cancel')){
            cat_this.hide_form();
            cat_this.show_updating_item();
            cat_this.reset_form_location();
        }
   });
  }

function detect_list(){
    let cat_this = this;
    this.list.addEventListener('click', function(e){
        let delete_click = e.target.classList.contains('cat-delete')
          , modify_click = e.target.classList.contains('cat-modify')
          ;
        let cat_item = e.target.closest('.cat-item');
        let data_id;
        if(cat_item)
            data_id = parseInt(cat_item.dataset.id);

        if(delete_click){
            if(!confirm('确认删除？'))
                return;
            cat_this.remove_row(data_id);
            if(cat_this.config.delete_fn)
                cat_this.config.delete_fn(data_id);
        }
        else if(modify_click){
            if(cat_this.updating_item)
                cat_this.updating_item.hidden = false;
            let cat_row  = cat_this._api.$find_row_id(data_id);
            cat_this.set_todo_data(cat_this.form, cat_row);
            cat_this.show_form();
            cat_item.hidden = true;
            cat_item.insertAdjacentElement('afterend', cat_this.form); // 表单占坑
            cat_this.updating_item = cat_item;
        }
        else{
            if(!data_id)
                return; 
                cat_this.set_item_active(data_id);
            if(cat_this.config.click_fn){
                cat_this.config.click_fn(data_id);
            }
        }
    });
}

//添加类目
function detect_add_btn(){
    let cat_this = this;
    this.add_btn.addEventListener('click', function (){
        cat_this.show_form();
    });
}

function show_form(){
    this.form.hidden = false;
}

function hide_form(){
    this.form.hidden = true;
}

//在 list 元素下外部插入表单,并清空表单数据
function reset_form_location () {
    this.list.insertAdjacentElement('afterend', this.form);
    this.clear_form(this.form); // 清空表单
  }


function detect_submit_list(){
    let cat_this = this;
    this.form.addEventListener('submit', function(e){
        e.preventDefault();
        if(cat_this.form.querySelector('[name = title]').value == '')
            return;
        let cat_row = cat_this.get_todo_data(cat_this.form); // 拿到表单中的数据
        if(cat_row.id)
            cat_this._api.modify(cat_row.id, cat_row);
        else
            cat_this._api.add(cat_row);
        cat_this.clear_form(cat_this.form);
        cat_this.render();
        cat_this.hide_form();
        if(cat_this.config.add_fn){
            cat_this.config.add_fn();
        }
        
    });
}


function remove_row(id){
    this._api.remove(id);
    this.render();
}

function render(){
    let cat_this = this;
    this.reset_form_location();
    this.list.innerHTML = '';
    this._api.read().forEach(function (item){
        cat_this.list.innerHTML += `
        <div class="cat-item cl_fl" data-id="${item.id}">
            <div class="cat-title">${item.title}</div>
            <div class="tool-set">
                ${
                    item.id == 1? '' : 
                    `
                    <button class="cat-modify">修改</button>
                    <button class="cat-delete">删除</button>
                    `
                }
            </div>
        </div>
        `
        ;
    });
    cat_this._api.$sync_to();
}

/**
 * 显示正在更新的那一条分组
 * 比如说用户提交了更新表单或取消更新的时候就应该隐藏表单，
 * 同时显示正在更新的那一条分组，这个方法就是用来恢复显示分组的
 * */
function show_updating_item(){
    if(this.updating_item)
        this.updating_item.hidden = false;
}

function set_item_active(id){
    let cat_list = this.list.querySelectorAll('.cat-item');
    cat_list.forEach(function (item){
        if(item.dataset.id == id)
            item.classList.add('cat-active');
        else
            item.classList.remove('cat-active')
    });

}

