const express = require("express");
const app = express();

app.use(express.json());

const sequelize = require("./database/db");


app.use("/admin", require("./route/admin"));
app.use("/customer", require("./route/customer"));

app.listen(4000, ()=>{
    console.log("server is listening on port "+ 4000);
})