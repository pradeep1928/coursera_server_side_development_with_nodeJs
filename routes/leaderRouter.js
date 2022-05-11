const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const Leaders = require("../models/leaders")
const authenticate = require("../authenticate");

const leaderRouter = express.Router();
leaderRouter.use(bodyParser.json());


// Routes and endpoints 
leaderRouter.route('/')
    .get((req, res, next) => {          // get route 
        Leaders.find({})
            .then((leaders) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(leaders);
            }, (err) => next(err))
            .catch((error) => next(error));
    })

    .post(authenticate.verifyUser, (req, res, next) => {         // post route 
        Leaders.create(req.body)
            .then((leader) => {
                console.log("leader created", leader);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(leader);
            }, (err) => next(err))
            .catch((error) => next(error));
    })

    .put(authenticate.verifyUser, (req, res, next) => {          // put route
        res.statusCode = 403;
        res.end("Put operation not supported on /promotions endpoint");
    })

    .delete(authenticate.verifyUser, (req, res, next) => {       // delete route 
        Leaders.remove({})
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            }, (err) => next(err))
            .catch((error) => next(error));
    });


// following routes are for perticular promoId 
leaderRouter.route('/:leaderId')
    .get((req, res, next) => {                        //get route
        Leaders.findById(req.params.leaderId)
            .then((leader) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(leader);
            }, (err) => next(err))
            .catch((error) => next(error));
    })

    .post(authenticate.verifyUser, (req, res, next) => {                       // post route 
        res.statusCode = 403;
        res.end("POST operation not supported on /leaders/" + req.params.leaderId)
    })

    .put(authenticate.verifyUser, (req, res, next) => {                        // put route 
        Leaders.findByIdAndUpdate(req.params.leaderId, {
            $set: req.body
        }, { new: true })
            .then((leader) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(leader);
            }, (err) => next(err))
            .catch((error) => next(error));
    })
    .delete(authenticate.verifyUser, (req, res, next) => {                     // delete route 
        Leaders.findByIdAndRemove(req.params.leaderId)
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            }, (err) => next(err))
            .catch((error) => next(error));
    })


module.exports = leaderRouter;