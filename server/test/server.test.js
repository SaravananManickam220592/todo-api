var expect = require('expect');
var request = require('superTest');
const {ObjectID} = require('mongodb');

const { app } = require('./../server');
const { Todo } = require('./../models/todo');

const todos = [{
    _id : new ObjectID(),
    text: 'First Test Todo'
}, {
    _id : new ObjectID(),
    text: 'Second Test Todo'
}];

beforeEach((done) => {
    Todo.remove({}).then(() => {
        Todo.insertMany(todos);
    }).then(() => done());
});

describe('POST /todos', () => {
    it('should create a new Todo', (done) => {
        var text = 'Test to TODO text';

        request(app)
            .post('/todos')
            .send({ text })
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe(text);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                Todo.find({ text }).then((todos) => {
                    expect(todos.length).toBe(1);
                    expect(todos[0].text).toBe(text);
                    done();
                }).catch((e) => done(e));
            });
    });

    it('should not create a new Todo', (done) => {

        request(app)
            .post('/todos')
            .send({})
            .expect(400)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                Todo.find().then((todos) => {
                    expect(todos.length).toBe(2);
                    done();
                }).catch((e) => done(e));
            });
    });

    describe('GET /todos', () => {
        it('should get all todos', (done) => {
            request(app)
                .get('/todos')
                .expect(200)
                .expect((res) => {
                    expect(res.body.todos.length).toBe(2);
                })
                .end(done);
        })
    });

    describe('GET /todos/:ID',() =>{
        it('should get specified todo' , (done) =>{
            var testId = todos[0]._id.toHexString();
            request(app)
            .get(`/todos/${testId}`)
            .expect(200)
            .expect((res) =>{
                expect(res.body.todo.text).toBe(todos[0].text);
            })
            .end(done);
        });

        it('should return 404 for a Doc ID not found', (done)=>{
            var testId = new ObjectID().toHexString();
            request(app)
            .get(`/todos/${testId}`)
            .expect(404)
            .end(done);
        });

        it('should return 404 for invalid Doc ID', (done)=>{
            request(app)
            .get(`/todos/123123`)
            .expect(404)
            .end(done);
        })
    });

    describe('DELETE /todos/:ID',() =>{
        it('should Remove specified todo' , (done) =>{
            var hexId= todos[0]._id.toHexString();
            request(app)
            .delete(`/todos/${hexId}`)
            .expect(200)
            .expect((res) =>{
                expect(res.body.todo._id).toBe(hexId);
            })
            .end((err,res) =>{
                if(err){
                    return done(err);
                }
                Todo.findById(hexId).then((todo)=>{
                    expect(todo).toBeFalsy();
                    done();
                }).catch((e)=>done(e));
            });
        });

        it('should return 404 for a Doc ID not found', (done)=>{
            var testId = new ObjectID().toHexString();
            request(app)
            .delete(`/todos/${testId}`)
            .expect(404)
            .end(done);
        });

        it('should return 404 for invalid Doc ID', (done)=>{
            request(app)
            .delete(`/todos/123123`)
            .expect(404)
            .end(done);
        });
    });
});
