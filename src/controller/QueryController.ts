import Log from "../Util";
import { error } from "util";
var fs = require("fs");
var currentData: any;
var isValidKeys: boolean[] = [];
var misID = new Array();
var notCount = 0;
var dataPath = './cachedDatasets/';
var andArr = new Array();
var andKeyCount = 0;
var keyNum = 0;
var keyArr = new Array();
var toProcess = new Array();
var mcompLibrary = new Array('courses_avg', 'courses_pass', 'courses_fail', 'courses_audit', 'courses_year', 'rooms_lat', 'rooms_lon', 'rooms_seats');
var stringLibrary = new Array('courses_dept', 'courses_id', 'courses_instructor', 'courses_title', 'courses_uuid', 'rooms_fullname',
    'rooms_shortname', 'rooms_number', 'rooms_name', 'rooms_address', 'rooms_type', 'rooms_furniture', 'rooms_href');
var filterLib = ['AND', 'OR', 'NOT', 'IS', 'GT', 'EQ', 'LT'];

export default class QueryController {

    public resetVars() {
        isValidKeys = [];
        toProcess = [];
        misID = [];
        andArr = [];
        currentData = null;
        notCount = 0;
        andKeyCount = 0;
        keyNum = 0;
        keyArr = [];
        return;
    }

    public getMisID() {
        return misID;
    }

    public getValidKeys() {
        return isValidKeys;
    }

    public returnVal() {
        return toProcess.pop();
    }

    public returnKeys() {
        return keyArr;
    }

    public getKeys(where: any, filter: string) {
        if (!filterLib.includes(filter)) {
            isValidKeys.push(false);
            return;
        }
        if (filter == 'AND' || filter == 'OR' || filter == 'NOT') {
            if (filter == 'AND' || filter == 'OR') {
                if (where[filter].length < 1 || Array.isArray(where[filter] == false)) {
                    isValidKeys.push(false);
                    return;
                }
                else {
                    let subLen = Object.keys(where[filter]).length;
                    for (let subFilter of where[filter]) {
                        for (let subSubfilter of Object.keys(subFilter)) {
                            this.getKeys(subFilter, subSubfilter);
                        }
                    }
                }

            }
            else if (filter == 'NOT') {
                let notKeys = Object.keys(where[filter]);
                if (notKeys.length != 1) {
                    isValidKeys.push(false);
                    return;
                }
                else {
                    let subFilter = notKeys[0];
                    this.getKeys(where[filter], subFilter);
                }
            }
        }
        else {
            if (Object.keys(where[filter]).length != 1) {
                isValidKeys.push(false);
                return;
            }
            let keys = Object.keys(where[filter]);
            let key = keys[0];
            let n = key.indexOf("_");
            if (n < 1) {
                isValidKeys.push(false);
                return;
            }
            let fileName = key.substr(0, n);
            keyArr.push(fileName);
        }
    }

    public whereParser(where: any, filter: string, theObj: any) {
        function allTrue(element: boolean, index: any, array: any) {
            return element == true;
        }

        if (filter == 'AND' || filter == 'OR') {

            let subLen = Object.keys(where[filter]).length;
            for (let subFilter of where[filter]) {
                for (let subSubfilter of Object.keys(subFilter)) {
                    this.whereParser(subFilter, subSubfilter, theObj);
                }
            }
            if (filter == 'AND') {
                let waitList = new Array();
                for (let i = 0; i < subLen; i++) {
                    waitList.push(toProcess.pop());
                }
                if (waitList.every(allTrue) == true) {
                    toProcess.push(true);
                }
                else {
                    toProcess.push(false);
                }
            }
            else if (filter == 'OR') {
                let waitList = new Array();
                for (let i = 0; i < subLen; i++) {
                    waitList.push(toProcess.pop());
                }
                if (waitList.includes(true)) {
                    toProcess.push(true);
                }
                else {
                    toProcess.push(false);
                }
            }
        }


        else if (filter == 'LT' || filter == 'GT' || filter == 'EQ') {
            let mcompKeys = Object.keys(where[filter]);
            let key = mcompKeys[0];
            if (mcompLibrary.includes(key)) {
                if (typeof where[filter][key] != 'number') {
                    isValidKeys.push(false);
                    return;
                }
                else {

                    if (theObj.hasOwnProperty(key)) {
                        if (filter == 'LT') {
                            if (theObj[key] < where[filter][key]) {
                                toProcess.push(true);
                            }
                            else toProcess.push(false);
                        }
                        else if (filter == 'GT') {
                            if (theObj[key] > where[filter][key]) {
                                toProcess.push(true);
                            }
                            else toProcess.push(false);
                        }
                        else if (filter == 'EQ') {
                            if (theObj[key] == where[filter][key]) {
                                toProcess.push(true);
                            }
                            else toProcess.push(false);
                        }
                    }
                    else toProcess.push(false);
                }

            }

            else {
                isValidKeys.push(false);
                return;
            }

        }


        else if (filter == 'IS') {
            let isKey = Object.keys(where[filter]);
            let key = isKey[0];
            if (stringLibrary.includes(key)) {
                if (typeof where[filter][key] != 'string') {
                    isValidKeys.push(false);
                    return;
                }
                else {
                    let strIS = where[filter][key];
                    let star = strIS.indexOf("*");
                    let keyLen;
                    if (strIS != "") {
                        keyLen = strIS.length - 1;
                    }
                    else keyLen = 0;

                    if (keyLen == 0 && star == 0) {
                        isValidKeys.push(false);
                        return;
                    }
                    if (star != 0 && star != keyLen) {
                        if (theObj.hasOwnProperty(key)) {
                            if (theObj[key] == where[filter][key]) {
                                toProcess.push(true);
                            }
                            else {
                                toProcess.push(false);
                            }
                        }
                        else {
                            toProcess.push(false);
                        }
                    }
                    else if (star == 0) {
                        if (strIS.substr(keyLen, 1) == "*") {
                            let subIsStr = strIS.substr(1, keyLen - 1);
                            if (theObj.hasOwnProperty(key)) {
                                if (theObj[key].includes(subIsStr)) {
                                    toProcess.push(true);
                                }
                                else {
                                    toProcess.push(false);
                                }
                            }
                            else {
                                toProcess.push(false);
                            }
                        }
                        else {
                            let subIsStr = strIS.substr(1, keyLen);

                            if (theObj.hasOwnProperty(key)) {
                                if (theObj[key].endsWith(subIsStr)) {
                                    toProcess.push(true);
                                }
                                else {
                                    toProcess.push(false);
                                }
                            }
                            else {
                                toProcess.push(false);
                            }

                        }
                    }
                    else if (star == keyLen) {
                        let subIsStr = strIS.substr(0, keyLen);
                        if (theObj.hasOwnProperty(key)) {
                            if (theObj[key].startsWith(subIsStr)) {
                                toProcess.push(true);
                            }
                            else {
                                toProcess.push(false);
                            }
                        }
                        else {
                            toProcess.push(false);
                        }
                    }
                }
            }
            else {
                isValidKeys.push(false);
                return;
            }

        }

        else if (filter == 'NOT') {
            notCount++;
            let notKeys = Object.keys(where[filter]);
            if (notKeys.length != 1) {
                isValidKeys.push(false);
                return;
            }

            let subFilter = notKeys[0]
            this.whereParser(where[filter], subFilter, theObj);

            if (notCount % 2 != 0) {
                let len = toProcess.length - 1;
                if (toProcess[len] == true) {
                    toProcess[len] = false;
                }
                else {
                    toProcess[len] = true;
                }
                notCount = 0;
            }
        }

    }


    public optionParser(mcompFiltered: any, optionBody: any, idAssure: string, hasTrans: boolean): any {




        if (!("COLUMNS" in optionBody) || !("FORM" in optionBody)) {
            return null;
        }
        // dealing with columns
        let colVal: any = [];
        if (hasTrans) {
            colVal = optionBody["COLUMNS"];
        }
        else {
            for (let val of optionBody["COLUMNS"]) {
                let n = val.indexOf("_");
                let fileName = val.substr(0, n);
                if (n < 1) {
                    return null;
                }
                if (idAssure == "") {
                    return null;
                }
                else if (idAssure == "geteverything") {
                    idAssure = fileName;
                    if (!fs.existsSync(dataPath + fileName)) {
                        return null;
                    }
                    else {
                        mcompFiltered = fs.readFileSync(dataPath + fileName, "utf8");
                        mcompFiltered = JSON.parse(mcompFiltered);
                    }
                }
                else if (idAssure != fileName) {
                    return null;
                }
                colVal.push(val);
            }
        }

        if (optionBody["FORM"] != "TABLE") {
            return null;
        }
        //check if order is valid
        var orderVal: string; var newStyle = false; var dir = ""; var dirKeys;
        if (optionBody.hasOwnProperty("ORDER")) {
            if (typeof optionBody["ORDER"] != 'string' && typeof optionBody["ORDER"] != 'object') {
                return null;
            }
            else if (typeof optionBody["ORDER"] == 'string') {
                // var s = optionBody["ORDER"];
                newStyle = false;
                if (!colVal.includes(optionBody["ORDER"])) {
                    return null;
                }
                else {
                    orderVal = optionBody["ORDER"];
                }
            }
            else if (typeof optionBody["ORDER"] == 'object') {
                newStyle = true;
                let oobj = optionBody["ORDER"];
                let oobjKeys = Object.keys(oobj);
                if (oobjKeys.length < 2) return null;
                if (!oobjKeys.includes('dir') || !oobjKeys.includes('keys')) return null;
                if (oobj['dir'] != 'DOWN' && oobj['dir'] != 'UP') return null;
                else {
                    dir = oobj['dir'];
                }
                if (!Array.isArray(oobj['keys'])) return null;
                dirKeys = oobj['keys']; let kLen = dirKeys.length;
                for (let i = 0; i < kLen; i++) {
                    if (!colVal.includes(dirKeys[i])) {
                        return null;
                    }
                }
            }
            else return null;
        }
        else orderVal = "";


        if (mcompFiltered.length == 0)
            return { render: "TABLE", result: [] };


        var colData = new Array();

        for (let obj of mcompFiltered) {
            var eachData = new Array();
            for (let val of colVal) {
                if (obj.hasOwnProperty(val)) {
                    eachData.push({ [val]: obj[val] })
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
        //console.log(processed);
        function joinJSON(o: any, ob: any): any {
            for (var z in ob) {
                o[z] = ob[z];
            }
            return o;
        }
        // END OF PROCESS TABLE


        // START OF ORDERING //
        //sort with number
        if (!newStyle) {
            // oldStyle 
            if (orderVal != "") {

                let testVal = processed[0][orderVal];

                if (typeof testVal == 'number') {
                    processed.sort(function (a: any, b: any) {
                        return a[orderVal] - b[orderVal];
                    })
                    // console.log(processed);
                }
                //sort alphabetically
                else if (typeof testVal == 'string') {
                    processed.sort(function (a: any, b: any) {
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
            }
        }
        else {
            processed = this.sortMulti(processed, dir, dirKeys);
        }
        // END OF ORDERING

        var result = {
            render: optionBody["FORM"],
            result: processed
        };
        return result;
    }

    // get group key and apply string
    // param: trans = query.TRANSFORMATIONS
    // return an array: if not valid return [false]; else return [[group keys*], [apply string*]]
    public transTerms(trans: any) {
        let ret = [];
        let applyK = new Array();  //e.g. 'maxSeats'
        let subAK = new Array();  // e.g."rooms_seats" in -> { "MAX": "rooms_seats"}
        let appTerm = new Array();
        let tKeys = Object.keys(trans);
        let gLen = trans['GROUP'].length;
        let tokenLib = ['MAX', 'MIN', 'AVG', 'COUNT', 'SUM'];
        if (!tKeys.includes('GROUP') || !tKeys.includes('APPLY') || Object.keys(trans).length != 2 || gLen < 1) {
            ret = [false];
            return ret;
        }

        for (let i = 1; i < gLen; i++) {
            if (trans['GROUP'][0] == trans['GROUP'][i]) {
                ret = [false];
                return ret;
            }
            if (!stringLibrary.includes(trans['GROUP'][i]) && !mcompLibrary.includes(trans['GROUP'][i])) {
                ret = [false];
                return ret;
            }
        }

        ret.push(trans['GROUP']);
        if (trans['APPLY'].length > 0) {
            // var withEscape = JSON.stringify(trans['APPLY']);
            // var noEscape = withEscape.replace(/\n/g, "\\n")
            //     .replace(/\'/g, "\\'")
            //     .replace(/\"/g, '\\"')
            //     .replace(/\&/g, "\\&")
            //     .replace(/\r/g, "\\r")
            //     .replace(/\t/g, "\\t")
            //     .replace(/\\b/g, "\\b")
            //     .replace(/\f/g, "\\f");
            // var newApply = JSON.parse(noEscape);

            for (let obj of trans['APPLY']) {
                let subKs = Object.keys(obj);
                let subK = subKs[0]
                let subsubKs = Object.keys(obj[subK]);
                let subsubK = subsubKs[0];
                if (!tokenLib.includes(subsubK)) {
                    ret = [false];
                    return ret;
                }
                else {
                    let str = obj[subK][subsubK];
                    if (!stringLibrary.includes(str) && !mcompLibrary.includes(str)) {
                        ret = [false];
                        return ret;
                    }
                    appTerm.push(obj[subK]);
                    let underS = str.indexOf('_');
                    if (underS == -1 || underS == str.length - 1) {
                        ret = [false];
                        return ret;
                    }
                    let trimStr = str.substr(0, underS);
                    subAK.push(trimStr);

                }
                // all string should be unique
                if (!applyK.includes(subK)) {
                    applyK.push(subK.replace(/\\n/g, "\\n")
                    .replace(/\\'/g, "\\'")
                    .replace(/\\"/g, '\\"')
                    .replace(/\\&/g, "\\&")
                    .replace(/\\r/g, "\\r")
                    .replace(/\\t/g, "\\t")
                    .replace(/\\b/g, "\\b")
                    .replace(/\\f/g, "\\f"));
                }
                else {
                    ret = [false];
                    return ret;
                }
            }
        }
        ret.push(applyK);
        ret.push(subAK);
        ret.push(appTerm);
        return ret;
    }


    // group the data and return an array with grouped data
    public groupParser(group: any, data: any) {
        let gLen = group.length;
        interface groups {
            [OP: string]: any
        }
        var groups: groups = {};
        function groupBy(array: any, f: any) {
            array.forEach(function (o: any) {
                var group = f(o);
                groups[group] = groups[group] || [];
                groups[group].push(o);
            });
            return Object.keys(groups).map(function (group) {
                return groups[group];
            })
        }

        var result = groupBy(data, function (item: any) {
            let arr = new Array();
            for (let i = 0; i < gLen; i++) {
                if (typeof item[group[i]] != 'undefined') {
                    arr.push(item[group[i]])
                }
            }

            return arr;
        });
        return result;
    }



    public applyParser(keys: any, arr: any, apt: any) {
        let aptLen = apt.length - 1;
        let ret: any = false;
        let ar = new Array();
        let app = apt.pop();
        let k = Object.keys(app);
        let token = k[0]; let result;
        let name = keys.pop();
        let tempAr = new Array();
        tempAr = tempAr.concat(arr);
        let key = app[token];
        if (arr.length < 1) return false;
        ret = this.tokenParser(token, key, tempAr, name);
        ar.push(ret);
        if (ret == false) {
            return false;
        }
        while (aptLen-- > 0) {
            name = keys.pop();
            app = apt.pop();
            k = Object.keys(app);
            token = k[0];
            key = app[token];
            tempAr = tempAr.concat(arr);
            ret = this.tokenParser(token, key, tempAr, name);
            if (ret == false) {
                return false;
            }
            ar.push(ret);
        }
        let arLen = ar.length;
        let unique = arr[0];
        for (let i = 0; i < arLen; i++) {
            unique = Object.assign(ar[i], unique);
        }

        return unique;

    }

    private tokenParser(tk: any, key: any, arr: any, name: string) {
        let len = arr.length;
        let temp = null;
        let obj, val;
        interface keyval {
            [OP: string]: any
        }
        if (tk == 'MAX' || tk == 'MIN') {
            if (!mcompLibrary.includes(key)) {
                return false;
            }
            for (let i = 0; i < len; i++) {
                obj = arr[i];
                val = obj[key];

                if (temp == null) {
                    temp = val;
                }
                else {
                    if (tk == 'MAX') {
                        if (val > temp) {
                            temp = val
                        }
                        continue;
                    }
                    else {
                        if (val < temp) {
                            temp = val
                        }
                        continue;
                    }
                }
            }
            let max: keyval = { [name]: temp };
            return max;
        }
        else if (tk == 'SUM') {
            if (!mcompLibrary.includes(key)) {
                return false;
            }
            for (let i = 0; i < len; i++) {
                obj = arr[i];
                temp = temp + obj[key];
            }
            let sum: keyval = { [name]: temp };

            return sum;
        }
        else if (tk == 'COUNT') {
            if (!mcompLibrary.includes(key) && !stringLibrary.includes(key)) {
                return false;
            }
            temp = null; let num = new Array();
            for (let i = 0; i < len; i++) {
                obj = arr[i];
                val = obj[key];
                num.push(val);
            }
            let newList = num.filter(function (elem, pos) {
                return num.indexOf(elem) == pos;
            });

            temp = newList.length;
            let count: keyval = { [name]: temp };
            return count;
        }
        else if (tk == 'AVG') {
            if (!mcompLibrary.includes(key)) {
                return false;
            }
            temp = 0;
            for (let i = 0; i < len; i++) {
                obj = arr[i];
                val = obj[key];
                val = val * 10;
                val = Number(val.toFixed(0))
                temp = temp + val;
            }
            temp = temp / len;
            temp = temp / 10;
            temp = Number(temp.toFixed(2));
            let avg: keyval = { [name]: temp };
            return avg;
        }
    }

    private sortMulti(arr: any, dir: any, dirKeys: any) {
        let that = this;
        if (dir == 'UP') {
            let firstK = dirKeys.shift();

            arr.sort(function (a: any, b: any) {
                let valA, valB;
                if (typeof a[firstK] == 'number') {
                    valA = a[firstK];
                    valB = b[firstK];
                }
                else {
                    valA = a[firstK].toUpperCase();
                    valB = b[firstK].toUpperCase();
                }
                if (valA < valB) return -1;
                else if (valA > valB) return 1;
                else {
                    let dumAr = new Array();
                    dumAr = dumAr.concat(dirKeys);
                    if (dirKeys.length == 0) return 0;
                    return that.subSort(a, b, dir, dumAr)
                }

            })
        }
        else {
            let firstK = dirKeys.shift();
            arr.sort(function (a: any, b: any) {
                let valA, valB;
                if (typeof a[firstK] == 'number') {
                    valA = a[firstK];
                    valB = b[firstK];
                }
                else {
                    valA = a[firstK].toUpperCase();
                    valB = b[firstK].toUpperCase();
                }
                if (valA > valB) return -1;
                else if (valA < valB) return 1;
                else {
                    let dumAr = new Array();
                    dumAr = dumAr.concat(dirKeys);
                    if (dirKeys.length == 0) return 0;
                    return that.subSort(a, b, dir, dumAr)
                }

            })
        }
        return arr;

    }

    private subSort(a: any, b: any, dir: any, dirKeys: any): number {
        if (dirKeys.length == 0) return 0;
        let firstK = dirKeys.shift();
        if (dir == "UP") {
            if (typeof a[firstK] == 'number') {
                let valA = a[firstK];
                let valB = b[firstK];
                if (valA < valB) return -1;
                else if (valA > valB) return 1;
                else {
                    return this.subSort(a, b, dir, dirKeys);
                }
            }
            //sort alphabetically
            else if (typeof a[firstK] == 'string') {
                var nameA = a[firstK].toUpperCase(); // ignore upper and lowercase
                var nameB = b[firstK].toUpperCase(); // ignore upper and lowercase
                if (nameA < nameB) {
                    return -1;
                }
                if (nameA > nameB) {
                    return 1;
                }
                else {
                    return this.subSort(a, b, dir, dirKeys);
                }
            }
        }
        else {
            if (typeof a[firstK] == 'number') {
                let valA = a[firstK];
                let valB = b[firstK];
                if (valA > valB) return -1;
                else if (valA < valB) return 1;
                else {
                    return this.subSort(a, b, dir, dirKeys);
                }
            }
            //sort alphabetically
            else if (typeof a[firstK] == 'string') {
                var nameA = a[firstK].toUpperCase(); // ignore upper and lowercase
                var nameB = b[firstK].toUpperCase(); // ignore upper and lowercase
                if (nameA > nameB) {
                    return -1;
                }
                if (nameA < nameB) {
                    return 1;
                }
                else {
                    return this.subSort(a, b, dir, dirKeys);
                }
            }
        }
    }







}

