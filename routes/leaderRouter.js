const express = require("express");
const bodyParser = require("body-parser");

const leaderRouter = express.Router();

leaderRouter.use(bodyParser.json());


// Routes and endpoints 
leaderRouter.route('/')
    .all((req, res, next) => {          // all route will apply to all type of routes 
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        next();
    })
    .get((req, res, next) => {          // get route 
        res.end("Will send all leaders to you");
    })
    .post((req, res, next) => {         // post route 
        res.end("Will add the leaders: " + req.body.name + " with details: " + req.body.description);
    })
    .put((req, res, next) => {          // put route
        res.statusCode = 403;
        res.end("Put operation not supported on /leaders endpoint");
    })
    .delete((req, res, next) => {       // delete route 
        res.end("Deleting all the leaders");
    });


// following routes are for perticular leaderId  
leaderRouter.route('/:leaderId')
    .all((req, res, next) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain')
        next();
    })
    .get((req, res, next) => {                        //get route
        res.end("Will send details of the leaders: " + req.params.leaderId + " to you")
    })
    .post((req, res, next) => {                       // post route 
        res.statusCode = 403;
        res.end("POST operation not supported on /leaders/" + req.params.leaderId)
    })
    .put((req, res, next) => {                        // put route 
        res.write("Updating the leaders: " + req.params.leaderId + "\n")
        res.end("will update the leaders: " + req.body.name + " with details: " + req.body.description)
    })
    .delete((req, res, next) => {                     // delete route 
        res.end("Deleting the leaders: " + req.params.leaderId);
    })



module.exports = leaderRouter;