const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const Dishes = require("../models/dishes");
const authenticate = require("../authenticate");
const cors = require("./cors");

const dishRouter = express.Router();
dishRouter.use(bodyParser.json());


// Routes and endpoints 
dishRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .get(cors.cors, (req, res, next) => {          // get route 
        Dishes.find({})
            .populate('comments.author')
            .then((dishes) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(dishes);
            }, (err) => next(err))
            .catch((error) => next(error));
    })

    .post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {         // post route 
        Dishes.create(req.body)
            .then((dish) => {
                console.log("dish created", dish);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(dish);
            }, (err) => next(err))
            .catch((error) => next(error));
    })

    .put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {          // put route
        res.statusCode = 403;
        res.end("Put operation not supported on /dishes endpoint");
    })

    .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {       // delete route 
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
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .get(cors.cors, (req, res, next) => {                        //get route
        Dishes.findById(req.params.dishId)
            .populate('comments.author')
            .then((dish) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(dish);
            }, (err) => next(err))
            .catch((error) => next(error));
    })

    .post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {                       // post route 
        res.statusCode = 403;
        res.end("POST operation not supported on /dishes/" + req.params.dishId)
    })

    .put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {                        // put route 
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

    .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {                     // delete route 
        Dishes.findByIdAndRemove(req.params.dishId)
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            }, (err) => next(err))
            .catch((error) => next(error));
    })


// Routes and endpoints for comments
dishRouter.route('/:dishId/comments')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .get(cors.cors, (req, res, next) => {                            // get route 
        Dishes.findById(req.params.dishId)
            .populate('comments.author')
            .then((dish) => {
                if (dish != null) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(dish.comments);
                } else {
                    err = new Error('Dish ' + req.params.dishId + ' not found')
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((error) => next(error));
    })


    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {                          // post route
        Dishes.findById(req.params.dishId)
            .then((dish) => {
                if (dish != null) {
                    req.body.author = req.user._id
                    dish.comments.push(req.body);
                    dish.save()
                        .then((dish) => {
                            Dishes.findById(dish._id)
                                .populate('comments.author')
                                .then((dish) => {
                                    res.statusCode = 200;
                                    res.setHeader('Content-Type', 'application/json');
                                    res.json(dish);
                                })
                        }, (err) => next(err))
                } else {
                    err = new Error('Dish ' + req.params.dishId + ' not found')
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((error) => next(error));
    })

    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {                          // put route
        res.statusCode = 403;
        res.end("Put operation not supported on /dishes/ " + req.params.dishId + " /comments");
    })


    .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {                       // delete route 
        Dishes.findById(req.params.dishId)
            .then((dish) => {
                if (dish != null) {
                    for (let i = (dish.comments.length - 1); i >= 0; i--) {
                        dish.comments.id(dish.comments[i].id).remove();
                    }
                    dish.save()
                        .then((dish) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(dish);
                        }, (err) => next(err))
                } else {
                    err = new Error('Dish ' + req.params.dishId + ' not found')
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((error) => next(error));
    });


// following routes are for perticular comment id inside dishId 
dishRouter.route('/:dishId/comments/:commentId')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .get(cors.cors, (req, res, next) => {                        //get route
        Dishes.findById(req.params.dishId)
            .populate('comments.author')
            .then((dish) => {
                if (dish != null && dish.comments.id(req.params.commentId) != null) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(dish.comments.id(req.params.commentId));
                } else if (dish == null) {
                    err = new Error('Dish ' + req.params.dishId + ' not found')
                    err.status = 404;
                    return next(err);
                } else {
                    err = new Error('Dish ' + req.params.commentId + ' not found')
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((error) => next(error));
    })

    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {                       // post route 
        res.statusCode = 403;
        res.end("POST operation not supported on /dishes/" + req.params.dishId + "/comments/" + req.params.commentId)
    })

    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {                        // put route 
        Dishes.findById(req.params.dishId)
            .then((dish) => {
                if (dish != null && dish.comments.id(req.params.commentId) != null
                    && dish.comments.id(req.params.commentId).author.equals(req.user._id)) {
                    if (req.body.rating) {
                        dish.comments.id(req.params.commentId).rating = req.body.rating;
                    }
                    if (req.body.comment) {
                        console.log(req.body.comment)
                        dish.comments.id(req.params.commentId).comment = req.body.comment;
                    }
                    dish.save()
                        .then((dish) => {
                            Dishes.findById(dish._id)
                                .populate('comments.author')
                                .then((dish) => {
                                    res.statusCode = 200;
                                    res.setHeader('Content-Type', 'application/json');
                                    res.json(dish);
                                })
                        }, (err) => next(err))
                } else if (dish == null) {
                    err = new Error('Dish ' + req.params.dishId + ' not found')
                    err.status = 404;
                    return next(err);
                } else {
                    err = new Error('Dish ' + req.params.commentId + ' not found')
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((error) => next(error));
    })

    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {                     // delete route 
        Dishes.findById(req.params.dishId)
            .then((dish) => {
                if (dish != null && dish.comments.id(req.params.commentId) != null
                    && dish.comments.id(req.params.commentId).author.equals(req.user._id)) {
                    dish.comments.id(req.params.commentId).remove();
                    dish.save()
                        .then((dish) => {
                            Dishes.findById(dish._id)
                                .populate('comments.author')
                                .then((dish) => {
                                    res.statusCode = 200;
                                    res.setHeader('Content-Type', 'application/json');
                                    res.json(dish);
                                })
                        }, (err) => next(err))
                } else if (dish == null) {
                    err = new Error('Dish ' + req.params.dishId + ' not found')
                    err.status = 404;
                    return next(err);
                } else {
                    err = new Error('Dish ' + req.params.commentId + ' not found')
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((error) => next(error));
    })



module.exports = dishRouter;