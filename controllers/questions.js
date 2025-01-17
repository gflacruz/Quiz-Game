// const Todo = require('../models/Todo')
const Question = require('../models/Question')
const QuestionSet = require('../models/QuestionSet')
const BankiQuestion = require('../models/BankiQuestion')

module.exports = {
    getQuestions: async (req,res)=>{
        console.log(req.user)
        try{
            const questionSets = await QuestionSet.find({userId: req.user.id})
            const questions = await Question.aggregate([{$sample: {size: 20}}]) // to do: make it return a random 20 (w/aggregate?)
            const completedBanki = await Question.countDocuments({userId:req.user.id, completed: false})
            res.render('questions.ejs', {questionSets:questionSets, questions: questions, left: completedBanki, user: req.user, questionsJson: JSON.stringify(questions)})
        } catch(err){
            console.log(err)
        }
    },
    createQuestion: async (req, res)=>{
        try{
            await Question.create({Question: req.body.questionItem, Answer:req.body.answerItem, QuestionSetId:req.body.QuestionSetId, Completed: false, userId: req.user.id})
            console.log('Question has been added!')
            res.redirect('/questions')
        } catch(err){
            console.log(err)
        }
    },
    createSet: async (req, res)=>{
        try{
            await QuestionSet.create({setName: req.body.setName, userId: req.user.id})
            console.log('Question set has been added!')
            res.redirect('/questions')
        } catch(err){
            console.log(err)
        }
    },
    // optimization: a single 'toggle complete function'
    markComplete: async (req, res)=>{
        try{
            await BankiQuestion.findOneAndUpdate({_id:req.body.id},{
                completed: true
            })
            console.log('Marked Complete')
            res.json('Marked Complete')
        }catch(err){
            console.log(err)
        }
    },
    markIncomplete: async (req, res)=>{
        try{
            await BankiQuestion.findOneAndUpdate({_id:req.body.id},{
                completed: false
            })
            console.log('Marked Incomplete')
            res.json('Marked Incomplete')
        }catch(err){
            console.log(err)
        }
    },
    deleteQuestion: async (req, res)=>{
        console.log(req.body.questionIdFromJSFile)
        try{
            await Question.findOneAndDelete({_id:req.body.questionIdFromJSFile})
            console.log('Deleted Question')
            res.json('Deleted It')
        }catch(err){
            console.log(err)
        }
    },
    getQuestionSet: async (req, res) => {
        try {
            let { questionSetId } = req.params
            let questionSet = await QuestionSet.findOne({ _id: questionSetId })
            console.log(questionSet.setName)
            let questions = await Question.find({ QuestionSetId: questionSetId })
            res.render('editQuestions.ejs', {questions: questions, questionSet: questionSet})    
        } catch (err) {
            console.log(err)
        }
    },
    editQuestion: async (req, res)=>{
        console.log(`editing ${req.body.id} with ${req.body.question} and ${req.body.answer}`)
        try{
            await Question.findOneAndUpdate({_id:req.body.id},{
                Question: req.body.question,
                Answer: req.body.answer
            })
            console.log('Edited')
            res.json('Edited!')
        }catch(err){
            console.log(err)
        }
    }

}    