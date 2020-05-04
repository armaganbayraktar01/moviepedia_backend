const chai = require('chai');
const should = chai.should();

const server = require('../../app');

let token;

describe('Created Token', () => {
    // Token Oluşturduk
    before((done) => {
        chai.request(server)
            .post('/auth') // token almak için auth a istek attık
            .send({ user_name: "test_user", user_password: "123456"}) // dataları yolladık
            .end( (err, res) => {
                token = res.body.token; // token aldık
                //console.log(token)
                done();
            });
    });
    
    // get('/filmrobot') için test
    describe('GET filmrobot Test', () => {
        it("It should get all the movies", (done) => {
            chai.request(server)
                .get('/api/movies/filmrobot/genre=&imbd=&relase=&sort=&limit=') // params have default value
                .set('x-access-token', token)
                .end((err, res) => {
                    res.should.have.status(200); // response 200 status koduna sahip olmalı should ="olmalı" have="sahip"
                    res.body.should.be.a('array'); // body den dönen yanıt bir array olmalı
                    done();
                });
        });
    });

    // get('/filmrobot') için test
    describe('GET filmrobot Test = genre', () => {
        it("It should get all the movies", (done) => {
            chai.request(server)
                .get('/api/movies/filmrobot/genre=crime&imbd=&relase=1900-2000&sort=&limit=')
                .set('x-access-token', token)
                .end((err, res) => {
                    res.should.have.status(200); // response 200 status koduna sahip olmalı should ="olmalı" have="sahip"
                    res.body.should.be.a('array'); // body den dönen yanıt bir array olmalı
                    done();
                });
        });
    });

});