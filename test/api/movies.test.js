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
    describe('GET All Movie Tests', () => {
        it("It should get all the movies", (done) => {
            chai.request(server)
                .get('/api/movies')
                .set('x-access-token', token)
                .end((err, res) => {
                    res.should.have.status(200); // response 200 status koduna sahip olmalı should ="olmalı" have="sahip"
                    res.body.should.be.a('array'); // body den dönen yanıt bir array olmalı
                    done();
                });
        });
    });

    // post('/') için test
    describe('POST Movie Test', () => {
		it('It should POST a movie', (done) => {

			const fakeData = {

                title : 'Test Film',
                titleTr : "Test Film1",
                imbd_id : "Test Film1",
                imbd_rating : "0",
                synopsis : "Lorem inspum dolores amare",
                cover : "Test Film3",
                relase_year : 1900,
                duration : 001,
                director : "5e99916282bd951b6cc4936c",
                genres : "5ea0318a7c213e39c43deae3",
                cast :  "5e99916282bd951b6cc4936c"
			};

			chai.request(server)
				.post('/api/movies')
				.send(fakeData)
				.set('x-access-token', token)
				.end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('title');
                        res.body.should.have.property('titleTr');
                        res.body.should.have.property('imbd_id');
                        res.body.should.have.property('imbd_rating');
                        res.body.should.have.property('synopsis');
                        res.body.should.have.property('cover');
                        res.body.should.have.property('relase_year');
                        res.body.should.have.property('duration');
                        res.body.should.have.property('director');
                        res.body.should.have.property('genres');
                        res.body.should.have.property('cast');
                        movieId = res.body._id;
                        done();
				});
		});
    });

    // get('/:movie_id') için test
    describe('GET ID a Movie Test', () => {
        it("It should GET a movie by the given id", (done) => {
            chai.request(server)
                .get('/api/movies/' + movieId)
                .set('x-access-token', token)
				.end((err, res) => {
                    res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.should.have.property('title');
					res.body.should.have.property('titleTr');
					res.body.should.have.property('imbd_id');
					res.body.should.have.property('imbd_rating');
					res.body.should.have.property('synopsis');
                    res.body.should.have.property('cover');
                    res.body.should.have.property('relase_year');
					res.body.should.have.property('duration');
					res.body.should.have.property('director');
                    res.body.should.have.property('genres');
                    res.body.should.have.property('cast');
					res.body.should.have.property('_id').eql(movieId);
                    done();
                });
        });
    });

    //put('/:movie_id) için test
    describe('PUT ID a Movie Test', () => {
		it('it should UPDATE a movie given by id', (done) => {

			const fakeData = {

                title : 'Test Film update',
                titleTr : "Test Film1",
                imbd_id : "Test Film1",
                imbd_rating : "0",
                synopsis : "Lorem inspum dolores amare",
                cover : "Test Film3",
                relase_year : 1900,
                duration : 001,
                director : "5e99916282bd951b6cc4936c",
                genres : ["5ea0318a7c213e39c43deae3"],
                cast :  ["5e99916282bd951b6cc4936c"]
            };
            
            chai.request(server)
                .put('/api/movies/' + movieId)
                .send(fakeData)
                .set('x-access-token', token)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('title').eql(fakeData.title);
                    res.body.should.have.property('titleTr').eql(fakeData.titleTr);
                    res.body.should.have.property('imbd_id').eql(fakeData.imbd_id);
                    res.body.should.have.property('imbd_rating').eql(fakeData.imbd_rating);
                    res.body.should.have.property('synopsis').eql(fakeData.synopsis);
                    res.body.should.have.property('cover').eql(fakeData.cover);
                    res.body.should.have.property('relase_year').eql(fakeData.relase_year);
                    res.body.should.have.property('duration').eql(fakeData.duration);
                    res.body.should.have.property('director').eql(fakeData.director);
                    res.body.should.have.property('genres').eql(fakeData.genres);
                    res.body.should.have.property('cast').eql(fakeData.cast);
                    done();
                });

		});
    });
    
    //delete('/:movie_id) için test
    describe('DELETE ID a Movie Test', () => {
		it('it should DELETE a movie given by id', (done) => {
			chai.request(server)
				.delete('/api/movies/' + movieId)
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