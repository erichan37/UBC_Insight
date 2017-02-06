import { expect } from 'chai';
import Log from "../src/Util";
import { InsightResponse, QueryRequest } from "../src/controller/IInsightFacade";
import InsightFacade from "../src/controller/InsightFacade";



describe("QuerySpec", function () {

    let insF: InsightFacade = null;

    beforeEach(function () {
        insF = new InsightFacade();
    })

    it("Testing for Basic Parsing to output correct format", () => {
        let queryR: QueryRequest = {
            "WHERE": {
                "GT": {
                    "courses_avg": 97
                }
            },
            "OPTIONS": {
                "COLUMNS": [
                    "courses_dept",
                    "courses_avg"
                ],
                "ORDER": "courses_avg",
                "FORM": "TABLE"
            }
        }
        let queryROutput: InsightResponse = {
            code: 200,
            body: {
                render: 'TABLE',
                result:
                [{ courses_dept: 'epse', courses_avg: 97.09 },
                { courses_dept: 'math', courses_avg: 97.09 },
                { courses_dept: 'math', courses_avg: 97.09 },
                { courses_dept: 'epse', courses_avg: 97.09 },
                { courses_dept: 'math', courses_avg: 97.25 },
                { courses_dept: 'math', courses_avg: 97.25 },
                { courses_dept: 'epse', courses_avg: 97.29 },
                { courses_dept: 'epse', courses_avg: 97.29 },
                { courses_dept: 'nurs', courses_avg: 97.33 },
                { courses_dept: 'nurs', courses_avg: 97.33 },
                { courses_dept: 'epse', courses_avg: 97.41 },
                { courses_dept: 'epse', courses_avg: 97.41 },
                { courses_dept: 'cnps', courses_avg: 97.47 },
                { courses_dept: 'cnps', courses_avg: 97.47 },
                { courses_dept: 'math', courses_avg: 97.48 },
                { courses_dept: 'math', courses_avg: 97.48 },
                { courses_dept: 'educ', courses_avg: 97.5 },
                { courses_dept: 'nurs', courses_avg: 97.53 },
                { courses_dept: 'nurs', courses_avg: 97.53 },
                { courses_dept: 'epse', courses_avg: 97.67 },
                { courses_dept: 'epse', courses_avg: 97.69 },
                { courses_dept: 'epse', courses_avg: 97.78 },
                { courses_dept: 'crwr', courses_avg: 98 },
                { courses_dept: 'crwr', courses_avg: 98 },
                { courses_dept: 'epse', courses_avg: 98.08 },
                { courses_dept: 'nurs', courses_avg: 98.21 },
                { courses_dept: 'nurs', courses_avg: 98.21 },
                { courses_dept: 'epse', courses_avg: 98.36 },
                { courses_dept: 'epse', courses_avg: 98.45 },
                { courses_dept: 'epse', courses_avg: 98.45 },
                { courses_dept: 'nurs', courses_avg: 98.5 },
                { courses_dept: 'nurs', courses_avg: 98.5 },
                { courses_dept: 'epse', courses_avg: 98.58 },
                { courses_dept: 'nurs', courses_avg: 98.58 },
                { courses_dept: 'nurs', courses_avg: 98.58 },
                { courses_dept: 'epse', courses_avg: 98.58 },
                { courses_dept: 'epse', courses_avg: 98.7 },
                { courses_dept: 'nurs', courses_avg: 98.71 },
                { courses_dept: 'nurs', courses_avg: 98.71 },
                { courses_dept: 'eece', courses_avg: 98.75 },
                { courses_dept: 'eece', courses_avg: 98.75 },
                { courses_dept: 'epse', courses_avg: 98.76 },
                { courses_dept: 'epse', courses_avg: 98.76 },
                { courses_dept: 'epse', courses_avg: 98.8 },
                { courses_dept: 'spph', courses_avg: 98.98 },
                { courses_dept: 'spph', courses_avg: 98.98 },
                { courses_dept: 'cnps', courses_avg: 99.19 },
                { courses_dept: 'math', courses_avg: 99.78 },
                { courses_dept: 'math', courses_avg: 99.78 }]
            }
        }

       
        return insF.performQuery(queryR).then(function (value: any) {
            Log.test("Value: " + value);
            expect(value).to.equal(queryROutput);

        }).catch(function (err: any) {
            console.log(err);
            expect.fail();
        })
    })




})