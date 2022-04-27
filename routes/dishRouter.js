const express = require("express");
const bodyParser = require("body-parser");

const dishRouter = express.Router();

dishRouter.use(bodyParser.json());


// Routes and endpoints 
dishRouter.route('/')
    .all((req, res, next) => {          // all route will apply to all type of routes 
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        next();
    })
    .get((req, res, next) => {          // get route 
        res.end("Will send all dishes to you");
    })
    .post((req, res, next) => {         // post route 
        res.end("Will add the dish: " + req.body.name + " with details: " + req.body.description);
    })
    .put((req, res, next) => {          // put route
        res.statusCode = 403;
        res.end("Put operation not supported on /dishes endpoint");
    })
    .delete((req, res, next) => {       // delete route 
        res.end("Deleting all the dishes");
    });


// following routes are for perticular dishId 
dishRouter.route('/:dishId')
    .all((req, res, next) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain')
        next();
    })
    .get((req, res, next) => {                        //get route
        res.end("Will send details of the dish: " + req.params.dishId + " to you")
    })
    .post((req, res, next) => {                       // post route 
        res.statusCode = 403;
        res.end("POST operation not supported on /dishes/" + req.params.dishId)
    })
    .put((req, res, next) => {                        // put route 
        res.write("Updating the dish: " + req.params.dishId + "\n")
        res.end("will update the dish: " + req.body.name + " with details: " + req.body.description)
    })
    .delete((req, res, next) => {                     // delete route 
        res.end("Deleting the dish: " + req.params.dishId);
    })



module.exports = dishRouter;