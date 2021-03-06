const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const Promotion = require("../models/promotions")
const authenticate = require("../authenticate");
const cors = require('./cors');

const promoRouter = express.Router();
promoRouter.use(bodyParser.json());


// Routes and endpoints 
promoRouter.route('/')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .get(cors.cors, (req, res, next) => {          // get route 
        Promotion.find({})
            .then((promotions) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(promotions);
            }, (err) => next(err))
            .catch((error) => next(error));
    })

    .post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {         // post route 
        Promotion.create(req.body)
            .then((promotion) => {
                console.log("promotion created", promotion);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(promotion);
            }, (err) => next(err))
            .catch((error) => next(error));
    })

    .put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {          // put route
        res.statusCode = 403;
        res.end("Put operation not supported on /promotions endpoint");
    })

    .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {       // delete route 
        Promotion.remove({})
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            }, (err) => next(err))
            .catch((error) => next(error));
    });


// following routes are for perticular promoId 
promoRouter.route('/:promoId')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .get(cors.cors, (req, res, next) => {                        //get route
        Promotion.findById(req.params.promoId)
            .then((promotion) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(promotion);
            }, (err) => next(err))
            .catch((error) => next(error));
    })

    .post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {                       // post route 
        res.statusCode = 403;
        res.end("POST operation not supported on /promotions/" + req.params.promoId)
    })

    .put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {                        // put route 
        Promotion.findByIdAndUpdate(req.params.promoId, {
            $set: req.body
        }, { new: true })
            .then((promotion) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(promotion);
            }, (err) => next(err))
            .catch((error) => next(error));
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {                     // delete route 
        Promotion.findByIdAndRemove(req.params.promoId)
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            }, (err) => next(err))
            .catch((error) => next(error));
    })



module.exports = promoRouter;