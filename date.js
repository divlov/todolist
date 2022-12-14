exports.getDate=function(){
    const d = new Date();

    const options = {
        weekday: "long",
        month: "long",
        day: "numeric"
    }

    return d.toLocaleDateString("en-US", options);
}

exports.getDay=function(){

    const d=new Date();

    const options={
        weekday:'long'
    }

    return d.toLocaleDateString("en-US",options);
}