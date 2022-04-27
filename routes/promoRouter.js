const express = require("express");
const bodyParser = require("body-parser");

const promoRouter = express.Router();

promoRouter.use(bodyParser.json());


// Routes and endpoints 
promoRouter.route('/')
    .all((req, res, next) => {          // all route will apply to all type of routes 
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        next();
    })
    .get((req, res, next) => {          // get route 
        res.end("Will send all promo to you");
    })
    .post((req, res, next) => {         // post route 
        res.end("Will add the promo: " + req.body.name + " with details: " + req.body.description);
    })
    .put((req, res, next) => {          // put route
        res.statusCode = 403;
        res.end("Put operation not supported on /promotions endpoint");
    })
    .delete((req, res, next) => {       // delete route 
        res.end("Deleting all the promotions");
    });


// following routes are for perticular promoId 
promoRouter.route('/:promoId')
    .all((req, res, next) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain')
        next();
    })
    .get((req, res, next) => {                        //get route
        res.end("Will send details of the promo: " + req.params.promoId + " to you")
    })
    .post((req, res, next) => {                       // post route 
        res.statusCode = 403;
        res.end("POST operation not supported on /promotions/" + req.params.promoId)
    })
    .put((req, res, next) => {                        // put route 
        res.write("Updating the promo: " + req.params.promoId + "\n")
        res.end("will update the promo: " + req.body.name + " with details: " + req.body.description)
    })
    .delete((req, res, next) => {                     // delete route 
        res.end("Deleting the promo: " + req.params.promoId);
    })



module.exports = promoRouter;