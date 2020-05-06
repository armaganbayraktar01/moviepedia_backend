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

// Login ve Register Test
describe('Login Test', () => {
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

    // post('/register') için test
    describe('Register Test', () => {
        it('It should Register a user', (done) => {
            
            const fakeData = {

                user_role: "1",
                user_name: "Test User01",
                user_fullname : 'Test User01',
                user_password: "123456",
                user_email: "test_user01@moviepedia.com",
                user_question : "1",
                user_answer: "Test User01",
                user_bio: "Test User01",
                user_picture : "Test User01",
                user_birth : "2000-01-01T00:00:01.901Z"
            };

            chai.request(server)
                .post('/register')
                .send(fakeData)
                .set('x-access-token', token)
                .end((err, res) => {
                    console.log(res.body)

                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('user_role');
                        res.body.should.have.property('user_name');
                        res.body.should.have.property('user_fullname');
                        res.body.should.have.property('user_password');
                        res.body.should.have.property('user_email');
                        res.body.should.have.property('user_question');
                        res.body.should.have.property('user_answer');
                        res.body.should.have.property('user_bio');
                        res.body.should.have.property('user_picture');
                        res.body.should.have.property('user_birth');
                        userId = res.body._id;
                        done();
                });

        });
    });

    //delete('/:user_id) için test
    describe('Delete Register Test User', () => {
        it('it should DELETE a user given by id', (done) => {
            chai.request(server)
                .delete('/api/users/' + userId)
                .set('x-access-token', token)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('status').eql(1);
                    done();
                });
        });
    });

});