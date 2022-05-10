const fs = require('fs');
const pdf = require('pdf-creator-node');
const path = require('path');
const options = require('../helpers/options');
const mongoose = require('mongoose');


mongoose.connect("mongodb://localhost:27017/invoicePdfDB", {
    useNewUrlParser: true
});
const invoiceSchema = {
    customer: String,
    occupation:String,
    address:String,
    fruits: String,
    quantity: Number,
    price: Number,
    description: String,
    phone: String,
    email: String,
    datetime: String,

    amount:Number

};
const Invoice = mongoose.model("Invoice", invoiceSchema);

const homeview = (req, res, next) => {
    res.render('home');
}

const generatePdf = async (req, res, next) => {

    const html = fs.readFileSync(path.join(__dirname, '../views/template.ejs'), 'utf-8');

    const filename = Math.random() + '_doc' + '.pdf';

    const invoice = new Invoice({
        customer: req.body.name,
        occupation:req.body.occupation,
        address:req.body.address,
        fruits: req.body.fruits,
        quantity: req.body.quantity,
        price: req.body.price,
        description: req.body.description,
        phone: req.body.phone,
        email: req.body.email,
        datetime: req.body.datetime,

        amount:req.body.price*req.body.quantity
    });

    invoice.save(function (err) {
        if (!err) {
            console.log(err);
        }
    });

    const obj = {
        
        prodlist: invoice,
        tax: 10/100*invoice.amount,
        gtotal:invoice.amount+10/100*invoice.amount,
        amount:invoice.amount
    }
    console.log(obj);

    const document = {
        html: html,
        data: {
            products: obj
        },
        path: './docs/' + filename
    }


    pdf.create(document, options)
        .then(res => {
            console.log(res);
        }).catch(error => {
            console.log(error);
        });
    const filepath = 'http://localhost:3000/docs/' + filename;

    res.render('download', {
        path: filepath
    });
}


module.exports = {
    homeview,
    generatePdf
}