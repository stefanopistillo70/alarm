
var assert = require('assert');
var supertest = require("supertest");
var should = require("should");

var server = supertest.agent("http://localhost:3000");

describe("Rest Config",function(){

  it("should return home page",function(done){
    server
    .get("/")
    .expect("Content-type",/json/)
    .expect(200) 
    .end(function(err,res){
      assert.equal(res.status,200);
      done();
    });
  });

});



