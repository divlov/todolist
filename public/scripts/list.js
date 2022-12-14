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

