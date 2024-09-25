$(".checkbox-todo").change(function(){
    if($(this).prop('checked')){
        $(this).parent().next().toggleClass("checked-p");
        if(confirm("Do you want to delete this task?")){
            $(this).parent().submit();
        }
        else{
            $(this).parent().next().toggleClass("checked-p");
            $(this).prop("checked",false);
        }
    }
})

$(document).ready(function () {
    // Get the form element
    const $form = $('#add-item-form');
    const $todoInput = $('#todo_input');
    // Add a submit event listener to the form
    $form.on('submit', function (event) {
        // Get the input value
        const todoValue = $todoInput.val().trim();
        // Validate the input (check if it's empty or invalid)
        if (todoValue === "" || todoValue == null) {
            // Prevent the form from submitting
            event.preventDefault();
            // Show an error message or handle the validation failure
            alert("Please enter a valid item before submitting.");
            return;
        }
        // If validation passes, the form will continue submitting
    });
});