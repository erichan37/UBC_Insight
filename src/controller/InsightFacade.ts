/**
 * This is the main programmatic entry point for the project.
 */
import { IInsightFacade, InsightResponse, QueryRequest } from "./IInsightFacade";

import Log from "../Util";

var JSZip = require("jszip");

//var zip = new JSZip();
var fs = require("fs");


if (!fs.existsSync("./cachedDatasets/")) {
    fs.mkdirSync('./cachedDatasets/');
}

var dataPath = './cachedDatasets/';

var gtFiltered = new Array();
var ltFiltered = new Array();
var eqFiltered = new Array();
var scompFiltered = new Array();
var negFiltered = new Array();
var allTheData = new Array();
var logicArr = new Array();
var missingIDs = new Array();
var isValidKeys: boolean[] = [];
var orderVal: string;
var logicCount = -1;
var mcompLibrary = new Array('courses_avg', 'courses_pass', 'courses_fail', 'courses_audit');
var stringLibrary = new Array('courses_dept', 'courses_id', 'courses_instructor', 'courses_title', 'courses_uuid');
var allLibrary = new Array('courses_avg', 'courses_pass', 'courses_fail', 'courses_audit', 'courses_dept', 'courses_id',
    'courses_instructor', 'courses_title', 'courses_uuid');






export default class InsightFacade implements IInsightFacade {

    constructor() {
        Log.trace('InsightFacadeImpl::init()');
    }

    addDataset(id: string, content: string): Promise<InsightResponse> {
        return new Promise(function (fulfill, reject) {
            var options = { base64: true };
            if (id == '') reject({ code: 400, body: { "error": "No id was provided." } });
            var cached = new JSZip();
            var codeID = 204;

            if (fs.existsSync(dataPath + id)) {
                fs.unlinkSync(dataPath + id);
                codeID = 201;
            }

                cached.loadAsync(content, options)
                    .then(function (files: any) {
                        var processList: Promise<any>[] = [];

                        
                        files.remove("__MACOSX");
                        files.folder(id).forEach(function (relativePath: any, file: any) {
                                var promise = file.async("string").then(function (json: any) {
                                    try {
                                        var parsed = JSON.parse(json);
                                        if (parsed.hasOwnProperty('result')) {
                                            let objValues: any[] = [];
                                            for (let obj of parsed.result) {
                                                let subObjValues: any[] = [];
                                                if (Object.keys(obj) != null && Object.keys(obj) != undefined) {
                                                    if (obj.hasOwnProperty("Subject")) {
                                                        let dept = id + "_dept";
                                                        let deptVal = obj["Subject"];
                                                        subObjValues.push({ [dept]: deptVal })
                                                    }
                                                    if (obj.hasOwnProperty("Course")) {
                                                        let nameId = id + "_id";
                                                        let nameIdVal = obj["Course"];
                                                        subObjValues.push({ [nameId]: nameIdVal });
                                                    }
                                                    if (obj.hasOwnProperty("Avg")) {
                                                        let avg = id + "_avg";
                                                        let avgVal = obj["Avg"];
                                                        subObjValues.push({ [avg]: avgVal });
                                                    }
                                                    if (obj.hasOwnProperty("Professor")) {
                                                        let instr = id + "_instructor";
                                                        let instrVal = obj["Professor"];
                                                        subObjValues.push({ [instr]: instrVal });
                                                    }
                                                    if (obj.hasOwnProperty("Title")) {
                                                        let title = id + "_title";
                                                        let titleVal = obj["Title"];
                                                        subObjValues.push({ [title]: titleVal });
                                                    }
                                                    if (obj.hasOwnProperty("Pass")) {
                                                        let pass = id + "_pass";
                                                        let passVal = obj["Pass"];
                                                        subObjValues.push({ [pass]: passVal });
                                                    }
                                                    if (obj.hasOwnProperty("Fail")) {
                                                        let fail = id + "_fail";
                                                        let failVal = obj["Fail"];
                                                        subObjValues.push({ [fail]: failVal });
                                                    }
                                                    if (obj.hasOwnProperty("Audit")) {
                                                        let audit = id + "_audit";
                                                        let auditVal = obj["Audit"];
                                                        subObjValues.push({ [audit]: auditVal });
                                                    }
                                                    if (obj.hasOwnProperty("id")) {
                                                        let uuid = id + "_uuid";
                                                        let uuidVal = obj["id"];
                                                        subObjValues.push({ [uuid]: uuidVal });
                                                    }


                                                }
                                                objValues.push(subObjValues);
                                            }
                                            return objValues
                                        }
                                    }
                                    catch (err) {
                                        //console.log(err);

                                        return reject({code: 400, body: {'error': 'file include invalid JSON(s)'}});
                                        //throw err;

                                    }

                                })
                            processList.push(promise)
                        });
                        Promise.all(processList).then(function (arrayOfStrings: any) {
                            var combine = [];
                            for (let i of arrayOfStrings) {
                                if(typeof i != "undefined")
                                    combine.push(i);
                            }

                            fs.writeFileSync(dataPath + id, JSON.stringify(combine));
                            fulfill({ code: codeID, body: {} });
                        })
                            .catch(function (err: any) {
                                reject({ code: 400, body: { 'error': err.toString('utf8') } });
                            })
                    })
                    .catch(function (err: any) {
                        reject({ code: 400, body: { 'error': err.toString('utf8') } });
                    })


        });
    }

    removeDataset(id: string): Promise<InsightResponse> {
        return new Promise(function(fulfill, reject) {
            if (fs.existsSync(dataPath + id)) {
                // remove dataset associated with the id
                fs.unlinkSync(dataPath + id)

                fulfill({ code: 204, body: {} });
            }
            else (reject({ code: 404, body: { 'error': 'The id does not exist' } }));
        });
    }



    performQuery(query: QueryRequest): Promise<InsightResponse> {
        return new Promise(function(fulfill, reject) {

            let finalProduct; // THIS IS THE FINAL JSON AFTER PARSING EVERYTHING

            //check if query is valid
            if (query == null || !('WHERE' in query) || !('OPTIONS' in query) || typeof query == 'undefined' || Object.keys(query).length != 2) {
                reject({ code: 400, body: { 'error': 'The query is invalid' } });
            }

            try { JSON.parse(JSON.stringify(query)) }
            catch (err) { reject({ code: 400, body: { 'error': 'The query is not a valid JSON' } }); }


            //***************************** STARTING HERE WE ASSUME WE HAVE ALL THE DATA ******************************** //


            function isValid(element: boolean, index: any, array: any) {
                return element == true;
            }

            try {

                isValidKeys = [];
                gtFiltered = [];
                ltFiltered = [];
                eqFiltered = [];
                scompFiltered = [];
                negFiltered = [];
                allTheData = [];
                logicCount = -1;
                logicArr = []

                if (Object.keys(query.WHERE).length == 1) {
                    for (let filter of Object.keys(query.WHERE)) {
                        whereParser(query.WHERE, filter);
                        if (missingIDs.length > 0) {
                            reject({ code: 424, body: { 'missing': missingIDs } });
                        }
                    }

                    if (isValidKeys.every(isValid) == false) {
                        reject({ code: 400, body: { 'error': 'invalid keys for logic comparactor' } })
                    }

                }
                else (reject({ code: 400, body: { 'error': 'Invalid WHERE' } }));
            }
            catch (err) {
                reject({ code: 400, body: { 'error': err.toString() } });
                throw err;
            }



            if (Object.keys(query.OPTIONS).length == 3) {
                finalProduct = optionParser(allTheData, query.OPTIONS);
                if (finalProduct == null) {
                    reject({ code: 400, body: { "Error": "Invalid OPTIONS" } });
                }
                fulfill({ code: 200, body: finalProduct.valueOf() });

                // IF SOMETHING WAS MISSING SUCH AS THE KEYS NEEDED INSIDE THE OPTIONS.
            } else {
                reject({ code: 400, body: { "Error": "Invalid OPTIONS" } });
            }




            //cached.file('courses'). ... ; get the data here somehow




        });

        function whereParser(where: any, filter: string) {


            if (filter == 'AND' || filter == 'OR') {
                logicArr.push(filter);
                logicCount++;

                if (where[filter].length == 0) {
                    isValidKeys.push(false);
                    return;
                }

                for (let subFilter of where[filter]) {

                    for (let subSubfilter of Object.keys(subFilter)) {

                        whereParser(subFilter, subSubfilter);
                        while (logicCount > 0) {
                            let thisLogic = logicArr[logicCount];
                            if (thisLogic == 'OR') {
                                for (let obj of gtFiltered) {
                                    if (!allTheData.includes(obj)) {
                                        allTheData.push(obj);
                                    }
                                }
                                for (let obj of eqFiltered) {
                                    if (!allTheData.includes(obj)) {
                                        allTheData.push(obj);
                                    }
                                }
                                for (let obj of ltFiltered) {
                                    if (!allTheData.includes(obj)) {
                                        allTheData.push(obj);
                                    }
                                }
                                for (let obj of scompFiltered) {
                                    if (!allTheData.includes(obj)) {
                                        allTheData.push(obj);
                                    }
                                }
                                for (let obj of negFiltered) {
                                    if (!allTheData.includes(obj)) {
                                        allTheData.push(obj);
                                    }
                                }
                            }
                            else if (thisLogic == 'AND') {
                                for (let obj of gtFiltered) {
                                    if (scompFiltered.includes(obj) && negFiltered.includes(obj) && ltFiltered.includes(obj) && eqFiltered.includes(obj)) {
                                        allTheData.push(obj);
                                    }
                                }

                            }
                            logicCount--;
                            gtFiltered = [];
                            ltFiltered = [];
                            eqFiltered = [];
                            scompFiltered = [];
                            negFiltered = [];

                        }
                    }
                }
            }

            else if (filter == 'LT' || filter == 'GT' || filter == 'EQ') {
                let mcompKeys = Object.keys(where[filter]);
                if (Object.keys(where[filter]).length != 1) {
                    isValidKeys.push(false);
                    return;
                }
                let currentData;
                for (let key of mcompKeys) {

                    //check to see if missing data
                    let indexNum = key.indexOf('_');
                    let theId = key.substring(0, indexNum)
                    if (!fs.existsSync(dataPath + theId)) {
                        missingIDs.push(theId);
                        return;
                    }
                    else {
                        let thisData = fs.readFileSync(dataPath + theId, "utf8");
                        try {
                            currentData = JSON.parse(thisData);
                        }
                        catch (err) {
                            throw err;
                        }

                    }

                    if (mcompLibrary.includes(key)) {
                        if (typeof where[filter][key] != 'number') {
                            isValidKeys.push(false);
                            return;
                        }
                        else {
                            for (let obj of currentData) {
                                for (let subObj of obj) {
                                    for (let val of Object.keys(subObj)) {
                                        if (val == key) {
                                            if (filter == 'LT') {
                                                if (subObj[val] < where[filter][key]) {
                                                    ltFiltered.push(obj)
                                                }
                                            }
                                            if (filter == 'GT') {
                                                if (subObj[val] > where[filter][key]) {
                                                    gtFiltered.push(obj)
                                                }
                                            }
                                            if (filter == 'EQ') {
                                                if (subObj[val] == where[filter][key]) {
                                                    eqFiltered.push(obj)
                                                }
                                            }
                                        }
                                    }
                                }

                            }
                        }

                    }
                    else {
                        isValidKeys.push(false);
                        return;
                    }
                }


            }


            else if (filter == 'IS') {
                let isKey = Object.keys(where[filter]);
                let currentData;
                if (Object.keys(where[filter]).length != 1) {
                    isValidKeys.push(false);
                    return;
                }

                for (let key of isKey) {
                    //check to see if missing data
                    let indexNum = key.indexOf('_');
                    let theId = key.substring(0, indexNum)
                    if (!fs.existsSync(dataPath + theId)) {
                        missingIDs.push(theId);
                        return;
                    }
                    else {

                        let thisData = fs.readFileSync(dataPath + theId, "utf8");
                        try {
                            currentData = JSON.parse(thisData);
                        }
                        catch (err) {
                            throw err;
                        }

                    }

                    if (stringLibrary.includes(key)) {
                        if (typeof where[filter][key] != 'string') {
                            isValidKeys.push(false);
                            return;
                        }
                        else {
                            for (let obj of currentData) {
                                for (let subObj of obj)
                                    for (let val of Object.keys(subObj)) {
                                        if (key == val) {

                                            if (subObj[val].includes(where[filter][key])) {
                                                scompFiltered.push(obj);
                                            }
                                            // else {
                                            //     isValidKeys.push(false);
                                            //     return;
                                            // }

                                        }
                                    }
                            }
                        }
                    } else {
                        isValidKeys.push(false);
                        return;
                    }
                }
            }

            //     else if (filter == 'NOT') {
            //         let notKeys = Object.keys(where[filter]);
            //         if (notKeys.length != 1) {
            //             isValidKeys.push(false);
            //             return;
            //         }

            //         for (let n of notKeys) {
            //             for (let subFilter of where[filter]) {
            //                 whereParser(where[filter], n);

            //                 for (let obj of currentData) {
            //                     let subnegFiltered = new Array();
            // /* THIS IS WRONG*/                    if (!gtFiltered.includes(obj) && !scompFiltered.includes(obj)) {
            //                         subnegFiltered.push(obj);
            //                     }
            //                     negFiltered.concat(subnegFiltered);
            //                 }
            //             }
            //         }
            //     }

            if (logicCount == 0) {
                if (logicArr[logicCount] == 'OR') {
                    for (let obj of gtFiltered) {
                        if (!allTheData.includes(obj)) {
                            allTheData.push(obj);
                        }
                    }
                    for (let obj of eqFiltered) {
                        if (!allTheData.includes(obj)) {
                            allTheData.push(obj);
                        }
                    }
                    for (let obj of ltFiltered) {
                        if (!allTheData.includes(obj)) {
                            allTheData.push(obj);
                        }
                    }
                    for (let obj of scompFiltered) {
                        if (!allTheData.includes(obj)) {
                            allTheData.push(obj);
                        }
                    }
                    for (let obj of negFiltered) {
                        if (!allTheData.includes(obj)) {
                            allTheData.push(obj);
                        }
                    }
                }
                else if (logicArr[logicCount] == 'AND') {
                    for (let obj of gtFiltered) {
                        if (scompFiltered.includes(obj) && negFiltered.includes(obj) && ltFiltered.includes(obj) && eqFiltered.includes(obj)) {
                            allTheData.push(obj);
                        }
                    }
                }
            }

            else if (logicCount == -1) {
                allTheData = gtFiltered.concat(scompFiltered).concat(negFiltered).concat(ltFiltered).concat(eqFiltered);
            }



        }


        // MCOMPFILTERED FOR NOW BECAUSE WE WANT TO MAKE SURE THE FUNCTIONALITY WORKS.
        // MCOMPFILTER = TOTALFILTERED AFTER

        function optionParser(allTheData: any[], optionBody: any): any {
            if (!("COLUMNS" in optionBody) || !("ORDER" in optionBody) || !("FORM" in optionBody)) {
                return null;
            }


            // dealing with columns
            let colVal: any = [];
            for (let val of optionBody["COLUMNS"]) {
                colVal.push(val);
            }




            //check if order is valid
            if (typeof optionBody["ORDER"] != 'string' && !allLibrary.includes(optionBody["ORDER"])) {

                return null;
            }
            else {
                var s = optionBody["ORDER"];
                if (!colVal.includes(optionBody["ORDER"])) {
                    return null;
                }
                else {
                    orderVal = optionBody["ORDER"];
                }
            }


            var colData = new Array();

            for (let key of allTheData) {
                var eachData = new Array();
                for (let subKey of key) {

                    for (let subSubkey of Object.keys(subKey)) {

                        for (let val of colVal) {
                            if (val == subSubkey) {
                                eachData.push({ [val]: subKey[subSubkey] })
                            }
                        }

                    }

                }
                if (eachData.length > 0) {
                    let parsed = JSON.parse(JSON.stringify(eachData));
                    colData.push(parsed);
                }
            }

            var c = colData;
            var processed = new Array();


            // PROCESSED THE RESULT TABLE:
            for (let outerArray of colData) {
                var buffer = {};
                for (let i = 0; i < outerArray.length; i++) {
                    buffer = joinJSON(buffer, outerArray[i]);
                }
                processed.push(buffer);

            }
            console.log(processed);

            function joinJSON(o: any, ob: any): any {
                for (var z in ob) {
                    o[z] = ob[z];
                }
                return o;
            }
            // END OF PROCESS TABLE


            // START OF ORDERING //
            //sort with number
            if (mcompLibrary.includes(orderVal)) {
                processed.sort(function(a: any, b: any) {

                    return a[orderVal] - b[orderVal];
                })
                // console.log(processed);
            }
            //sort alphabetically
            else if (stringLibrary.includes(orderVal)) {
                processed.sort(function(a: any, b: any) {
                    var nameA = a[orderVal].toUpperCase(); // ignore upper and lowercase
                    var nameB = b[orderVal].toUpperCase(); // ignore upper and lowercase
                    if (nameA < nameB) {
                        return -1;
                    }
                    if (nameA > nameB) {
                        return 1;
                    }

                    return 0;
                })
                // console.log(processed);
            }
            else return null;
            // END OF ORDERING

            var result = {
                render: optionBody["FORM"],
                result: processed
            };
            return result;
        }






    }


    // helper function to parse WHERE in query

}
