const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + '/date.js');
const mongoose = require('mongoose');
const _ = require("lodash");

const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect('mongodb+srv://admin:'+process.env.pass+'@cluster0.xbkoj5y.mongodb.net/todoListDB', { useNewUrlParser: true });

const itemsSchema = new mongoose.Schema({
    item: {
        type: String,
        required: [true, "Please check your data entry, item is missing"]
    }
});

const listsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter title of list"]
    },
    list: {
        type: [itemsSchema],
        required: [true, "Please check your data entry, list is missing"]
    }
});

const List = mongoose.model("List", listsSchema);

const Item = mongoose.model("Item", itemsSchema);

let currentList = [];



const item1 = new Item({
    item: "Welcome to your todolist!"
});

const item2 = new Item({
    item: "Hit the + button to add an item"
});

const item3 = new Item({
    item: "<-- Hit this to delete an item"
});

const defaultItems = [item1, item2, item3];
let homeListName;

app.listen(3000, function () {
    console.log("Server running on port 3000");
});

app.get("/", function (req, res) {
    homeListName = date.getDate();

    Item.find(function (err, itemsFound) {
        if (err)
            console.log(err);
        else {
            if (itemsFound.length === 0) {
                Item.insertMany(defaultItems, function (err) {
                    if (err)
                        console.log(err);
                    else
                        console.log("Successfully saved items");
                });
                res.render("list", { listTitle: homeListName, newItems: itemsFound.concat(defaultItems) });
            }
            else
                res.render("list", { listTitle: homeListName, newItems: itemsFound });
        }
    });
});

app.post("/", function (req, res) {
    console.log(req.body);
    const item = req.body.todo_item;
    const listName = req.body.button;
    // if (req.body.button === "Work List") {
    //     workItems.push(item);
    //     res.redirect("/work");
    // }
    // else {

    if (listName === homeListName) {
        const dbItem = new Item({
            item: item
        });
        dbItem.save();
        res.redirect("/");
    }
    else {

        currentList.push(new Item({
            item: item
        }));
        List.findOne({ name: listName }, function (err, itemFound) {
            itemFound.list.push(new Item({
                item: item
            }));
            itemFound.save();
            res.redirect("/" + listName);
        })
    }


    // }

});

// app.get("/work", function (req, res) {
//     res.render("list", { listTitle: "Work List", newItems: workItems });
// });

app.get("/:listTitle", function (req, res) {


    const listName=_.capitalize(req.params.listTitle);

    List.findOne({ name: listName }, function (err, itemFound) {
        if (err)
            console.log(err);
        else {
            if (!itemFound) {
                let listItem = new List({
                    name: listName,
                    list: defaultItems
                });
                listItem.save();
                currentList = defaultItems;
                res.render("list", { listTitle: listName /*date.getDate()*/, newItems: defaultItems });
            }
            else {
                currentList = itemFound.list;
                res.render("list", { listTitle: listName /*date.getDate()*/, newItems: itemFound.list });
            }
        }
    })


    // Item.find(function (err, itemsFound) {
    //     if (err)
    //         console.log(err);
    //     else {
    //         if (itemsFound.length === 0) {
    //             Item.insertMany([item1, item2, item3], function (err) {
    //                 if (err)
    //                     console.log(err);
    //                 else
    //                     console.log("Successfully saved items");
    //             });
    //             itemsFound.push(item1);
    //             itemsFound.push(item2);
    //             itemsFound.push(item3);
    //             res.render("list", { listTitle: req.params.listTitle /*date.getDate()*/, newItems: itemsFound });
    //         }
    //         else
    //             res.render("list", { listTitle: req.params.listTitle/*date.getDate()*/, newItems: itemsFound });
    //     }
    // });
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
    const listName = req.body.list_name;

    if (listName === homeListName) {
        Item.findByIdAndDelete(checkboxedId, function (err) {
            if (err)
                console.log(err);
            else {
                console.log("Deleted succesfully");
                res.redirect("/");
            }
        })
    }

    else {
        // let id = mongoose.Types.ObjectId(checkboxedId);

        // List.findOne({ name: listName }, function (err, itemFound) {
        //     if (err)
        //         console.log(err);
        //     else {
        //         let i;
        //         console.log(itemFound.list);
        //         itemFound.list.forEach(function (element, index) {
        //             if (element._id.toString() === checkboxedId) {
        //                 i = index;
        //                 return;
        //             }
        //         });
        //         console.log(i);
        //         itemFound.list.splice(i, 1);
        //         itemFound.save();
        //         res.redirect("/" + listName);
        //     }
        // })

        List.findOneAndUpdate({name:listName},{$pull:{list:{_id:checkboxedId}}},function(err,updatedList){
            if(err)
                console.log(err);
            else{
                res.redirect("/" + listName);
            }
        });
        
    }
});
