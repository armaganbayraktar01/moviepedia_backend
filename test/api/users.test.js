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
    
    // get('/') için test
    describe('GET All User Tests', () => {
        it("It should get all the users", (done) => {
            chai.request(server)
                .get('/api/users')
                .set('x-access-token', token)
                .end((err, res) => {
                    res.should.have.status(200); // response 200 status koduna sahip olmalı should ="olmalı" have="sahip"
                    res.body.should.be.a('array'); // body den dönen yanıt bir array olmalı
                    done();
                });
        });
    });

    // post('/') için test
    describe('POST User Test', () => {
        it('It should post a user', (done) => {
            
            const fakeData = {

                user_role: "1",
                user_name: "Test User02",
                user_fullname : 'Test User02',
                user_password: "123456",
                user_email: "test_user02@moviepedia.com",
                user_question : "1",
                user_answer: "Test User02",
                user_bio: "Test User02",
                user_picture : "Test User02",
                user_birth : "2000-01-01T00:00:01.901Z"
            };

            chai.request(server)
                .post('/api/users')
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

    // get('/:user_id') için test
    describe('GET ID a User Test', () => {
        it("It should GET a user by the given id", (done) => {
            chai.request(server)
                .get('/api/users/' + userId)
                .set('x-access-token', token)
				.end((err, res) => {
                    res.should.have.status(200);
					res.body.should.be.a('object');
                    res.body.should.have.property('user_role');
                    res.body.should.have.property('user_name');
                    res.body.should.have.property('user_password');
                    res.body.should.have.property('user_email');
                    res.body.should.have.property('user_question');
                    res.body.should.have.property('user_answer');
                    res.body.should.have.property('user_bio');
                    res.body.should.have.property('user_picture');
                    res.body.should.have.property('user_birth');
					res.body.should.have.property('_id').eql(userId);
                    done();
                });
        });
    });

    //put('/:user_id) için test
    describe('PUT ID a User Test', () => {
		it('it should UPDATE a user given by id', (done) => {
           
            const fakeData = {

                user_role: "1",
                user_name: "Test User03",
                user_fullname : 'Test User03',
                user_password: "123456",
                user_email: "test_user03@moviepedia.com",
                user_question : "1",
                user_answer: "Test User03",
                user_bio: "Test User03",
                user_picture : "Test User03",
                user_birth : "2000-01-01T00:00:01.901Z"
            };
            
            chai.request(server)
                .put('/api/users/' + userId)
                .send(fakeData)
                .set('x-access-token', token)
                .end((err, res) => {
                    console.log(res.body)
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('user_fullname').eql(fakeData.user_fullname);
                    res.body.should.have.property('user_role').eql(fakeData.user_role);
                    res.body.should.have.property('user_name').eql(fakeData.user_name);
                    res.body.should.have.property('user_password');
                    res.body.should.have.property('user_email').eql(fakeData.user_email);
                    res.body.should.have.property('user_question').eql(fakeData.user_question);
                    res.body.should.have.property('user_answer').eql(fakeData.user_answer);
                    res.body.should.have.property('user_bio').eql(fakeData.user_bio);
                    res.body.should.have.property('user_picture').eql(fakeData.user_picture);
                    res.body.should.have.property('user_birth').eql(fakeData.user_birth);
                    done();
                });
		});
    });
    
    //delete('/:user_id) için test
    describe('DELETE ID a User Test', () => {
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