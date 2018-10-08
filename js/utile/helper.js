
function get_todo_data(form_selector){
    let data = {};
    let list = form_selector.querySelectorAll('[name]');

    list.forEach(function (input){
        switch(input.nodeName){
            case 'INPUT':
                switch(input.type){
                    case 'text':
                    case 'password':
                    case 'number':
                    case 'hidden':
                        data[input.name] = input.value;
                        break;
                    case 'checkbox':
                    case 'radio':
                        data[input.name] = input.checked;
                        break;
                }
                break;
            case 'TEXTAREA':
                data[input.name] = input.value;
                break;
            case 'SELECT':
                data[input.name] = input.value;
                break;
            default:
                alert('No corresponding value');
        }
    });
    return data;
}


function set_todo_data(form_selector, data){
    for(let key in data){
        let val = data[key];
        let input = form_selector.querySelector(`[name =${key}]`);
        switch(typeof(val)){
            case 'number':
            case 'string':
                input.value = val;
                break;
            case 'boolean':
                input.checked = val;
                break;
        }
    }
}

function clear_form(form_selector){
    form_selector.querySelector('[name = title]').value = '';
    form_selector.querySelector('[name = id]').value = '';
}

module.exports = {
    get_todo_data: get_todo_data,
    set_todo_data: set_todo_data,
    clear_form: clear_form
}