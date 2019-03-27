module.exports = {

	database:'mongodb://localhost/chatapp',
	port:3000,
	secretKey:'tarun',


     facebook:{
     	clientID:process.env.FACEEBOOK_ID || '',
     	clientSecret:process.env.FACEEBOOK_SECRET || '',
     	profilefield:['emails','displayName'],
     	callbackURL:'http://localhost:3000/user/auth/facebook/callback'
     }
}