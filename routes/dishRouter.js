const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const Dishes = require("../models/dishes");

const dishRouter = express.Router();
dishRouter.use(bodyParser.json());


// Routes and endpoints 
dishRouter.route('/')
    .get((req, res, next) => {          // get route 
        Dishes.find({})
            .then((dishes) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(dishes);
            }, (err) => next(err))
            .catch((error) => next(error));
    })

    .post((req, res, next) => {         // post route 
        Dishes.create(req.body)
            .then((dish) => {
                console.log("dish created", dish);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(dish);
            }, (err) => next(err))
            .catch((error) => next(error));
    })

    .put((req, res, next) => {          // put route
        res.statusCode = 403;
        res.end("Put operation not supported on /dishes endpoint");
    })

    .delete((req, res, next) => {       // delete route 
        Dishes.remove({})
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            }, (err) => next(err))
            .catch((error) => next(error));
    });


// following routes are for perticular dishId 
dishRouter.route('/:dishId')
    .get((req, res, next) => {                        //get route
        Dishes.findById(req.params.dishId)
            .then((dish) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(dish);
            }, (err) => next(err))
            .catch((error) => next(error));
    })

    .post((req, res, next) => {                       // post route 
        res.statusCode = 403;
        res.end("POST operation not supported on /dishes/" + req.params.dishId)
    })

    .put((req, res, next) => {                        // put route 
        Dishes.findByIdAndUpdate(req.params.dishId, {
            $set: req.body
        }, { new: true })
            .then((dish) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(dish);
            }, (err) => next(err))
            .catch((error) => next(error));
    })

    .delete((req, res, next) => {                     // delete route 
        Dishes.findByIdAndRemove(req.params.dishId)
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            }, (err) => next(err))
            .catch((error) => next(error));
    })



module.exports = dishRouter;