var jwt = require("jsonwebtoken");
var _ = require("lodash");
const rateLimit = require("express-rate-limit");

module.exports = function(instance,app){

  const createAccountLimiter = rateLimit({
    windowMs: 60 * 1000, 
    max: 5, 
    message:
      "Too many call from this IP, please try again after one minute"
  });

    var secret = instance.getSharedData("appConfig").jwtSecret;

    const checkIsLoggedIn = (req,res,next) =>{
        const authHeader = req.cookies;
        if(authHeader.token){
           
            jwt.verify(authHeader.token,secret,(err,user)=>{
                if(err){
                    console.log(err)
                    return res.sendStatus(403);
                }
                req.user = user;
                next()
            });
        }
        else{
           next()
        }
    }
    
    app.get("/",checkIsLoggedIn,createAccountLimiter,function (req, res,next) {
        if(req && req.user && req.user._id){
            res.render("home");
        }        
        else{
           res.redirect("/login");
        }
    });

    app.get("/register",checkIsLoggedIn,function (req, res,next) {
        if(req && req.user && req.user._id){
            res.render("home");
        }        
        else{
           res.render("register");
        }
    });
    app.get("/login",checkIsLoggedIn,function (req, res,next) {
       
        if(req && req.user && req.user._id){
            res.redirect("/home");
        }
        else{
            res.render("login");;
        } 
    });
 
    app.post('/login',createAccountLimiter ,(req, res,next)=> {

        console.log('-postloign--',req.body)
        instance.getService("MongoDBService",(err,mongoService)=>{
            if(err){
                console.log('-----error while getting mongoService-',err);
                res.send({reason:"Service Not found"});
            }
            
            mongoService.findOne("AdminAccount",{username:req.body.username, password:req.body.password},{},(err,user)=>{
                if(err){
                    console.log('----error while getting userinfo',err);
                    res.send(err,null);
                    return;
                }
                if(user){
                    user = _.omit(user,'password')
                    const token = jwt.sign(user, secret,{
                        expiresIn: 24 * 60 * 60*24*1000
                    });
                    res.cookie('token', token, {maxAge: 24 * 60 * 24*1000, httpOnly: true, secure: false});
                    res.json({token:token});
                }
                else {
                    res.status(401).send({reason:"User Not found"});
                }
            });
        });
    }); 

    app.get('/home',checkIsLoggedIn,createAccountLimiter ,(req,res,next)=>{
        if(req && req.user && req.user._id){
            var obj = {isloggedin:true}
          res.render('home',obj)
        }
        else{
            res.redirect("/login");
        }
    });

    app.post('/register',createAccountLimiter,(req,res,next)=>{
       
        instance.getService("UsersService",(err,service)=>{
           if(err){
               res.status(401).send("error while getting service");
               return
           }
           var obj = {};
           obj.name = req.body.name;
           obj.username = req.body.username;
           obj.password = req.body.password
           service.registerAdmin(obj,(err,result)=>{
                if(err){
                   console.log('--errro while saving register info--',err);
                   res.status(401).send({reason:"Error While saving info"});
                   return;
                }
                console.log('--admin registered successfully--',result);
                res.json({reason:"User Registered successfully"});
           });
        });
    });

    app.post('/newsurvey',checkIsLoggedIn,createAccountLimiter,(req,res,next)=>{
        if(req && req.user && req.user._id){
           instance.getService("SureyService",(err,service)=>{
               if(err){
                   console.log('--error while saving survey--',err);
                   res.status(401).send({reason:"error while saving new survey"})
               }
               var obj = {};
               obj.surveyName = req.body.surveyName;
               obj.formsInfo = req.body.formsInfo;
               obj.surveyAmount = req.body.surveyAmount;
               console.log('----fasdsd',obj)
               service.saveNewSurvey(obj,(err,result)=>{
                    if(err){
                       console.log('--error while saving---',err);
                        res.status(401).send({reason:"error while saving new survey"})
                    }
                    else{
                        console.log('---saved success fully',result)
                       res.json("Saved sucess fully");
                    }
               });
           });
        }
    });

    app.get('/survey',checkIsLoggedIn,createAccountLimiter,(req,res,next)=>{
       if(req && req.user && req.user._id){
          instance.getService("SureyService",(err,service)=>{
             if(err){
                 res.status(401).send("error while getting service");
                 return
             }
             
             service.getAllSurvey((err,result)=>{
                  if(err){
                     console.log('--errro while saving register info--',err);
                     res.status(401).send({reason:"Error While saving info"});
                     return;
                  }
                  console.log('-allSurvey--',result);
                  res.json({allSurvey:result});
             });
          });
       }
    });

    app.get('/logout',checkIsLoggedIn, (req, res,next)=> {
        if(req && req.user && req.user._id){
            res.clearCookie("token");
            res.redirect("/");
        }
        else{
            res.redirect("/login");
        }
    });

    app.get('/analytics',checkIsLoggedIn,createAccountLimiter, (req, res,next)=> {
        if(req && req.user && req.user._id){
          var obj = {isloggedin:true}
            res.render('analytics',obj)
        }
        else{
            res.redirect("/login");
        }
    });

    app.get('/submitted-survey',checkIsLoggedIn, createAccountLimiter,(req, res,next)=> {
        if(req && req.user && req.user._id){
          instance.getService("SureyService",(err,service)=>{
            if(err){
              console.log('error while getting service--',err);
              res.status(401).send("err while getting service");
              return
            }

            service.getAllSurveyAndAnswers((err,result)=>{
              if(err){
                console.log(err);
                res.status(401).send("error while getting analytics data");
                return
              }
              res.json(result)
            })
          })
        }
        else{
            res.redirect("/login");
        }
    });
}