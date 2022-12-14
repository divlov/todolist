const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + '/date.js');
const mongoose = require('mongoose');

const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect('mongodb://localhost:27017/todoListDB', { useNewUrlParser: true });

const itemsSchema = new mongoose.Schema({
    item: {
        type: String,
        required: [true, "Please check your data entry, item is missing"]
    }
});

const homeListName = "Todo List";
const Item = mongoose.model(homeListName, itemsSchema);

const item1 = new Item({
    item: "Welcome to your todolist!"
});

const item2 = new Item({
    item: "Hit the + button to add an item"
});

const item3 = new Item({
    item: "<-- Hit this to delete an item"
});

app.listen(3000, function () {
    console.log("Server running on port 3000");
});

app.get("/", function (req, res) {

    Item.find(function (err, itemsFound) {
        if (err)
            console.log(err);
        else {
            if (itemsFound.length === 0) {
                Item.insertMany([item1, item2, item3], function (err) {
                    if (err)
                        console.log(err);
                    else
                        console.log("Successfully saved items");
                });
                res.render("list", { listTitle: homeListName /*date.getDate()*/, newItems: itemsFound });
            }
            else
                res.render("list", { listTitle: homeListName/*date.getDate()*/, newItems: itemsFound });
        }
    });
}); 

app.post("/", function (req, res) {
    console.log(req.body);
    const item = req.body.todo_item;
    // if (req.body.button === "Work List") {
    //     workItems.push(item);
    //     res.redirect("/work");
    // }
    // else {
        let Item = mongoose.model(req.body.button, itemsSchema);
        const dbItem = new Item({
            item: item
        });

        dbItem.save();

        res.redirect("/"+req.body.button);
    // }


});

// app.get("/work", function (req, res) {
//     res.render("list", { listTitle: "Work List", newItems: workItems });
// });

app.get("/:listTitle", function (req, res) {

    let Item = mongoose.model(req.params.listTitle, itemsSchema);


    Item.find(function (err, itemsFound) {
        if (err)
            console.log(err);
        else {
            if (itemsFound.length === 0) {
                Item.insertMany([item1, item2, item3], function (err) {
                    if (err)
                        console.log(err);
                    else
                        console.log("Successfully saved items");
                });
                itemsFound.push(item1);
                itemsFound.push(item2);
                itemsFound.push(item3);
                res.render("list", { listTitle: req.params.listTitle /*date.getDate()*/, newItems: itemsFound });
            }
            else
                res.render("list", { listTitle: req.params.listTitle/*date.getDate()*/, newItems: itemsFound });
        }
    });
});

// app.post("/work", function (req, res) {
//     const item = req.body.todo_item;
//     workItems.push(item);
//     res.redirect("/work");
// });

app.get('/about', function (req, res) {
    res.render('about');
});

app.post("/delete", function (req, res) {
    const checkboxedId = req.body.checkbox;

    Item.findByIdAndDelete(checkboxedId, function (err) {
        if (err)
            console.log(err);
        else {
            console.log("Deleted succesfully");
            res.redirect("/");
        }
    })
});
