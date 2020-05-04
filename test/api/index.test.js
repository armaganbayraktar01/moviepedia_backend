const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();

const server = require('../../app');

chai.use(chaiHttp);

describe('Index tests', () => {
    it("Home page should have status code 200", (done) => {
        chai.request(server)
            .get('/')
            .end((err, res) => {
                res.should.have.status(200); // response 200 status koduna sahip olmalı should ="olmalı" have="sahip"
                done();
            });
    });
});