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
    describe('GET All Person Tests', () => {
        it("It should get all the persons", (done) => {
            chai.request(server)
                .get('/api/persons')
                .set('x-access-token', token)
                .end((err, res) => {
                    res.should.have.status(200); // response 200 status koduna sahip olmalı should ="olmalı" have="sahip"
                    res.body.should.be.a('array'); // body den dönen yanıt bir array olmalı
                    done();
                });
        });
    });

    // post('/') için test
    describe('POST Person Test', () => {
		it('It should POST a person', (done) => {

			const fakeData = {

                fullname : 'Test User',
                imbd_id : "Test User2",
                bio : "Lorem inspum dolores amare",
                cover : "Test User3",
                birth : "1900-01-01T00:00:01.901Z"
			};

			chai.request(server)
				.post('/api/persons')
				.send(fakeData)
				.set('x-access-token', token)
				.end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('fullname');
                        res.body.should.have.property('imbd_id');
                        res.body.should.have.property('bio');
                        res.body.should.have.property('cover');
                        res.body.should.have.property('birth');
                        personId = res.body._id;
                        done();
				});
		});
    });

    // get('/:movie_id') için test
    describe('GET ID a Person Test', () => {
        it("It should GET a person by the given id", (done) => {
            chai.request(server)
                .get('/api/persons/' + personId)
                .set('x-access-token', token)
				.end((err, res) => {
                    res.should.have.status(200);
					res.body.should.be.a('object');
                    res.body.should.have.property('fullname');
                    res.body.should.have.property('imbd_id');
                    res.body.should.have.property('bio');
                    res.body.should.have.property('cover');
                    res.body.should.have.property('birth');
					res.body.should.have.property('_id').eql(personId);
                    done();
                });
        });
    });

    //put('/:movie_id) için test
    describe('PUT ID a Person Test', () => {
		it('it should UPDATE a person given by id', (done) => {

			const fakeData = {

                fullname : 'Test User update',
                imbd_id : "Test User233",
                bio : "Lorem inspum dolores amare",
                cover : "Test User33",
                birth : "1905-01-01T00:00:01.901Z"
			};
            
            chai.request(server)
                .put('/api/persons/' + personId)
                .send(fakeData)
                .set('x-access-token', token)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('fullname').eql(fakeData.fullname);
                    res.body.should.have.property('imbd_id').eql(fakeData.imbd_id);
                    res.body.should.have.property('bio').eql(fakeData.bio);
                    res.body.should.have.property('cover').eql(fakeData.cover);
                    res.body.should.have.property('birth').eql(fakeData.birth);
                    done();
                });

		});
    });
    
    //delete('/:movie_id) için test
    describe('DELETE ID a Person Test', () => {
		it('it should DELETE a person given by id', (done) => {
			chai.request(server)
				.delete('/api/persons/' + personId)
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