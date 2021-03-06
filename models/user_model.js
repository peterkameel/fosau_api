const mongoose = require('mongoose');
const nodemailer = require('nodemailer');

const UserSchema = mongoose.Schema({
       username:String,
       email:String,
       password:String
},{ versionKey: false,
    collection:'user'});

const User = mongoose.model('user',UserSchema);

//signup function
exports.signup = (body, res) => {
    const user = new User({
        username: body.username,
        email: body.email,
        password: body.password
    });
    //check if user exist
    User.find({ email: user.email })
        .exec()
        .then(result => {
            if (result.length === 0)
                user.save().then(result => {
                    res.json({
                        error: false,
                        massage: 'Singup Successfull',
                        user: result
                    });
                }).catch(err => console.log(err));
            else res.json({
                error: true,
                massage: 'User exsist'
            });
        });
};

//Login function
exports.login = (email,password, result1) => {
    User.find({ password:password }).exec().then(res => {
        if (res.length > 0)
            User.find({ email: email, password: password })
                .exec()
                .then(result => {
                    if (result.length > 0) {
                        result1.json({
                            error: false,
                            massage: 'Login Successfull',
                            user: result[0]
                        });
                    } else result1.json({
                        error: true,
                        massage: 'Check Your Email'
                    });
                });
        else result1.json({
            error: true,
            massage: 'Check Your Password'
        });
    });
};

//forget password functions
exports.forgetpassword = (body, result) => {
    User.find({ email: body.email })
        .exec().then(res => {
            if (res.length > 0) {
                const email = res[0].email;
                const pass  = res[0].password;
                sendMail(email, pass, result);
            } else result.json({
                error: true,
                massage: 'Check Your Email'
            });
        });
};

const sendMail = (email, pass, result) => {
    var transporter = nodemailer.createTransport({
        service: 'yahoo',
        auth: {
            user: 'peterkameel95@yahoo.com',
            pass: 'exlvxipdqiaqzopk'}
    });

    var mailOptions = {
        from:'peterkameel95@yahoo.com' ,
        to: email,
        subject: 'Restore Password',
        text: 'Use this password to login: ' + pass
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            result.json({error: error});
        } else {
            result.json({error: false, massage: 'Email is send'});
        }
    });
};

//update user name fun
exports.username = (item, result) => {
    const query = { email: item.email };
    User.findOneAndUpdate(query,{
       username: item.username
    }).exec().then(ress => {
        result.json({
            error: false,
            massage: 'Update successfull',
            user: {username:item.username}
        });
    }).catch(error => { console.log(error) });
}

//update user name fun
exports.userpass = (item, result) => {
    const query = { email: item.email , password:item.password};
    User.findOneAndUpdate(query,{
       password: item.newpassword
    }).exec().then(ress => {
        result.json({
            error: false,
            massage: 'Update successfull',
            user: {password:item.newpassword}
        });
    }).catch(error => { console.log(error) });
}
