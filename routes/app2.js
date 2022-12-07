//jshint esversion:6

const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const _ = require("lodash");
var topicName;

const CommentSchema = {
  name : String,
  rollNo : String,
  content : String
}

const Comment = mongoose.model("Comment",CommentSchema);

const QuestionSchema = {
  name : String,
  link : String,
  hint : String,
  topic : String,
  diff : Number,
  solution : String,
  state : Number,
  discussions : [CommentSchema]
}

const Question = mongoose.model("Question",QuestionSchema);

const {ensureAuthenticated} = require("../config/auth");

router.get('/',(req,res) => {
    res.render('welcome');
});

router.get("/questionsPage", ensureAuthenticated, function(req, res){

  Question.find(function(err,QuestionDetails){
    if(err){
      console.log(err);
    }
    QuestionDetails.sort((s1,s2)=>s1.diff-s2.diff);
    res.render("home",{
      user : req.user,
      Questions : QuestionDetails,
    })
  });
});

router.get("/compose", function(req, res){
  res.render("compose");
});

router.post("/compose", function(req, res){

  var diff = req.body.qDiff;
  var name = req.body.qName;
  var hint = req.body.hint;
  var link = req.body.hLink;
  var topic = req.body.qTopic;
  var qSol = req.body.qSol;
  var qState = req.body.qState;
  topicName = topic;

  const newQuestion = new Question({
    name : name,
    link : link,
    hint : hint,
    topic : topic,
    diff : diff,
    solution : qSol,
    state : qState
  });

  newQuestion.save(function(err){
    if(!err){
      res.redirect("/questionsPage");
    }
  });

});

router.get("/post/:topicQ",function(req,res){
  
  var flag  = 0;
  var num = 0;

  Question.find(function(err,ques){
    if(err){
      console.log(err);
    }
    else{
      for(var i = 0;i<ques.length;i++){
        if( _.lowerCase(req.params.topicQ) == _.lowerCase(ques[i].name)){
          flag = 1; 
          num = i;
          break;
        }
      }
    
      if(flag==1){
        res.render("post",{que : ques[num]});
      }
      else{
        res.redirect("/questionsPage");
      }
    }
  });
});

router.get("/commentPre",function(req,res){
  
});

router.post("/commentPre",function(req,res){
  var currQues = req.body.quesName;
  Question.findOne({name : currQues},function(err,foundList){
    res.render("comment",{
      Comments : foundList.discussions
    });
  });
});

router.post("/commentCreate",function(req,res){
  var currQues = req.body.quesName;
  var yName = req.body.yName;
  var yRoll = req.body.yRoll;
  var yComment = req.body.yComment;
  const newComment = new Comment({
    name : yName,
    rollNo : yRoll,
    content : yComment
  }); 
  Question.findOneAndUpdate({name : currQues},{$push : {discussions : newComment}},function(err,foundList){
    res.redirect("/post/"+currQues);  
  });
});


router.post("/homePrevious",function(req,res){
  
  Question.find(function(err,QuestionDetails){
    if(err){
      console.log(err);
    }
    QuestionDetails.sort((s1,s2)=>s1.state-s2.state);
    res.render("homePrev",{
      TopicName : "Last Weeks Questions : ",
      Questions : QuestionDetails
    });
  });
});

router.get("/homePrevious",function(req,res) {
  Question.find(function(err,QuestionDetails){
      if(err){
        console.log(err);
      }
      QuestionDetails.sort((s1,s2)=>s1.state-s2.state);
      res.render("homePrev",{
        TopicName : "Last Weeks Questions : ",
        Questions : QuestionDetails
      });
    });
});

module.exports = router;