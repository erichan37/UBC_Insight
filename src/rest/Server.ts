/**
 * This is the REST entry point for the project.
 * Restify is configured here.
 */

import restify = require('restify');
import { IInsightFacade, InsightResponse, QueryRequest } from "../controller/IInsightFacade";
import InsightFacade from "../controller/InsightFacade";
import Log from "../Util";

/**
 * This configures the REST endpoints for the server.
 */
export default class Server {

    private port: number;
    private rest: restify.Server;

    constructor(port: number) {
        Log.info("Server::<init>( " + port + " )");
        this.port = port;
    }

    /**
     * Stops the server. Again returns a promise so we know when the connections have
     * actually been fully closed and the port has been released.
     *
     * @returns {Promise<boolean>}
     */
    public stop(): Promise<boolean> {
        Log.info('Server::close()');
        let that = this;
        return new Promise(function (fulfill) {
            that.rest.close(function () {
                fulfill(true);
            });
        });
    }

    /**
     * Starts the server. Returns a promise with a boolean value. Promises are used
     * here because starting the server takes some time and we want to know when it
     * is done (and if it worked).
     *
     * @returns {Promise<boolean>}
     */
    public start(): Promise<boolean> {
        let that = this;
        return new Promise(function (fulfill, reject) {
            try {
                Log.info('Server::start() - start');

                that.rest = restify.createServer({
                    name: 'insightUBC'
                });

                that.rest.use(restify.bodyParser({ mapParams: true, mapFiles: true }));

                // provides the echo service
                // curl -is  http://localhost:4321/echo/myMessage
                /**
                 *          GET
                 */
                //that.rest.get('/', Server.main);
                that.rest.get('/echo/:msg', Server.echo);
                that.rest.get(/.*/, restify.serveStatic({
                    'directory': './src/rest/views',
                    'default': 'index.html',
                    'maxAge': 5
                }));
                // that.rest.get(/.*/, restify.serveStatic({
                //     'directory': './src/rest/views'
                // }));
             
                // that.rest.get('/square/:num', Server.square);
                /**
                 *          PUT
                 */
                that.rest.put('/dataset/:id', Server.add);
                /**
                 *          DEL
                 */
                that.rest.del('/dataset/:id', Server.del);
                /**
                 *          POST
                 */
                that.rest.post('/query', Server.query);

                // Other endpoints will go here
                that.rest.listen(that.port, function () {
                    Log.info('Server::start() - restify listening: ' + that.rest.url);
                    fulfill(true);
                });

                that.rest.on('error', function (err: string) {
                    // catches errors in restify start; unusual syntax due to internal node not using normal exceptions here
                    Log.info('Server::start() - restify ERROR: ' + err);
                    reject(err);
                });
            } catch (err) {
                Log.error('Server::start() - ERROR: ' + err);
                reject(err);
            }
        });
    }

    // The next two methods handle the echo service.
    // req.params.num
    // These are almost certainly not the best place to put these, but are here for your reference.
    // By updating the Server.echo function pointer above, these methods can be easily moved.

    public static echo(req: restify.Request, res: restify.Response, next: restify.Next) {
        Log.trace('Server::echo(..) - params: ' + JSON.stringify(req.params));
        try {
            let result = Server.performEcho(req.params.msg);
            Log.info('Server::echo(..) - responding ' + result.code);
            res.json(result.code, result.body);
        } catch (err) {
            Log.error('Server::echo(..) - responding 400');
            res.json(400, { error: err.message });
        }
        return next();
    }

    public static performEcho(msg: string): InsightResponse {
        if (typeof msg !== 'undefined' && msg !== null) {
            return { code: 200, body: { message: msg + '...' + msg } };
        } else {
            return { code: 400, body: { error: 'Message not provided' } };
        }
    }



    // public static square(req: restify.Request, res: restify.Response, next: restify.Next) {
    //     let number = req.params.num;
    //     let squared_number = number * number;
    //     let response_jason = { 'squared_number': squared_number };

    //     res.json(200, response_jason);
    //     return next();
    // }

    public static add(req: restify.Request, res: restify.Response, next: restify.Next) {
        let id = req.params.id;
        Log.trace('Server::Add - params: ' + id);
        try {
            let hello = req.params.body.toString('base64');
            let insF = new InsightFacade();
            insF.addDataset(id, hello).then(function (result) {
                res.json(result.code, result.body);
            }).catch(function (error) {
                res.json(error.code, error.body);
            })
        }
        catch (err) {
            res.send(400, { error: err.message });
        }
        return next();
    }

    public static del(req: restify.Request, res: restify.Response, next: restify.Next) {
        Log.trace('Server::Del - params: ' + JSON.stringify(req.params));
        let id = req.params.id;
        let insF = new InsightFacade();

        insF.removeDataset(id).then(function (result: InsightResponse) {
            res.json(result.code, result.body);

        })
            .catch(function (error: InsightResponse) {
                res.json(error.code, error.body);

            })
        return next();
    }

    public static query(req: restify.Request, res: restify.Response, next: restify.Next) {
        Log.trace('Server::Del - query: ');
        let inputQ: QueryRequest = req.params;
        let insF = new InsightFacade();
        try {
            insF.performQuery(inputQ).then(function (result) {
                res.json(result.code, result.body);
            })
                .catch(function (error) {
                    res.send(Number(error.code), JSON.stringify(error.body));
                })

        }
        catch (err) {
            res.send(400, { error: err.message });
        }
        return next();
    }


}
