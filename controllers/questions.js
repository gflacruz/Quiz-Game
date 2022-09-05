// const Todo = require('../models/Todo')
const Question = require('../models/Question')
const BankiQuestion = require('../models/BankiQuestion')

module.exports = {
    getBankiQuestions: async (req,res)=>{
        console.log(req.user)
        try{
            const questions = await BankiQuestion.aggregate([{$sample: {size: 20}}]) // to do: make it return a random 20 (w/aggregate?)
            const completedBanki = await BankiQuestion.countDocuments({userId:req.user.id, completed: false})
            res.render('questions.ejs', {questions: questions, left: completedBanki, user: req.user})
        } catch(err){
            console.log(err)
        }
    },
    getBankiQuestionsToEdit: async (req,res)=>{
        console.log(req.user)
        try{
            const questions = await BankiQuestion.find({}) // to do: make it return a random 20 (w/aggregate?)
            res.render('editBankiQuestions.ejs', {questions: questions, user: req.user})
        } catch(err){
            console.log(err)
        }
    },
    createQuestion: async (req, res)=>{
        try{
            await Question.create({question: req.body.question, answer:req.body.answer, completed: false, userId: req.user.id})
            console.log('Question has been added!')
            res.redirect('/questions')
        } catch(err){
            console.log(err)
        }
    },
    editBankiQuestion: async (req, res)=>{
        try{
            await BankiQuestion.findOneAndUpdate({_id:req.body.id},{
                Answer: req.body.answer
            })
            console.log('Edited')
            res.json('Edited!')
        }catch(err){
            console.log(err)
        }
    },
    deleteBankiQuestion: async (req, res)=>{
        try{
            await BankiQuestion.findOneAndDelete({_id:req.body.id})
            console.log('Edited')
            res.json('Edited!')
        }catch(err){
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
        console.log(req.body.id)
        try{
            await Question.findOneAndDelete({_id:req.body.id})
            console.log('Deleted Question')
            res.json('Deleted It')
        }catch(err){
            console.log(err)
        }
    }
}    