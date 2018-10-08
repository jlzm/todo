let TaskUi = require('./ui/taskUi');
let CatUi = require('./ui/catUi');

let taskUi = new TaskUi({
    init_fn: render_cat_option,
    input_focus: function (){
        taskUi.select.hidden = false;
    },
    input_blur: function (){
        // taskUi.select.hidden = true;
    },
    add_succeed_fn:function (id) {
        catUi.set_item_active(id);
    }
});

let catUi = new CatUi({
    click_fn: function(id){
        render_cat_option_value(id);
        taskUi.render(id);
    },
    delete_fn: function (cat_id, Previous_id){
        taskUi._api.remove_cat_row(cat_id);
        taskUi.render(Previous_id);
        render_cat_option();
    },
    add_fn: function (cat_id) {
        taskUi.render(cat_id);
        render_cat_option();        
    } 
}  
);

function render_cat_option(){
    taskUi.select.innerHTML = '';
    if(!catUi._api.read())
        return;
    catUi._api.read().forEach(function (item){
        taskUi.select.innerHTML +=
        `
        <option class="cat-option" value="${item.id}">${item.title}</option>
        `
        ; 
    });
    
    taskUi.select.addEventListener('change', function (e){
        let cat_id = parseInt(e.target.value);
        catUi.set_item_active(cat_id);
        taskUi.render(cat_id);       
    });
}

function render_cat_option_value(cat_id) {
    let option_assemble = taskUi.select.querySelectorAll('option');
    option_assemble.forEach(function (item) {
        if(item.value == cat_id){
            item.selected = true;
        }
    });
}

taskUi.init();
catUi.init();
