import {Router} from 'express';
import path = require('path');
import * as passport from 'passport';

const index = Router();

// /* GET home page. */
// index.get('/', function(req, res, next) {
//   res.render('index', { title: 'Visual Studio Code!' });
// });
// 
// /* GET Quick Start. */
// index.get('/quickstart', function(req, res, next) {
//   res.render('quickstart');
// });

index.post('/signup', function(req, res, next) {
	if (!req.body.email || !req.body.password) {
		return res.json({ error: 'Email and Password required' });
	}
	passport.authenticate('local-signup', function(err, user, info) {
		if (err) {
			return res.json(err);
		}
		if (user.error) {
			return res.json({ error: user.error });
		}
		req.logIn(user, function(err) {
			if (err) {
				return res.json(err);
			}
			return res.json({ redirect: '/profile' });
		});
	})(req, res, next);
});

index.post('/login', function(req, res, next) {
	if (!req.body.email || !req.body.password) {
		return res.json({ error: 'Email and Password required' });
	}
	passport.authenticate('local-login', function(err, user, info) {
		if (err) {
			return res.json(err);
		}
		if (user.error) {
			return res.json({ error: user.error });
		}
		req.logIn(user, function(err) {
			if (err) {
				return res.json(err);
			}
			return res.json({ redirect: '/profile' });
		});
	})(req, res, next);
});

// -------------  FACEBOOK -----------------------------
index.get('/auth/facebook', passport.authenticate('facebook', { scope: 'email' }));

index.get('/auth/facebook/callback',
	passport.authenticate('facebook', {
		successRedirect: '/profile',
		failureRedirect: '/'
	}));


// ----------------- TWITTER ----------------------------
index.get('/auth/twitter', passport.authenticate('twitter'));

index.get('/auth/twitter/callback',
	passport.authenticate('twitter', {
		successRedirect: '/profile',
		failureRedirect: '/'
	})
);


// ------------------ GOOGLE ----------------------------
index.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

index.get('/auth/google/callback',
	passport.authenticate('google', {
		successRedirect: '/profile',
		failureRedirect: '/'
	}));


// ------------ Logout   /logout -----------------------
index.post('/logout', function(req, res) {
	req.logout();
	res.json({ redirect: '/' });
});

// --------------  user data   /api/userData ---------------
index.get('/api/userData', isLoggedInAjax, function(req, res) {
	return res.json(req.user);
});

/* GET home page */
index.get('*', function(req, res) {
    console.log('in index');
	res.sendFile(path.join(__dirname, '../public/index.html'));
});


function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
    }
	res.redirect('/');
}

function isLoggedInAjax(req, res, next) {
	if (!req.isAuthenticated()) {
		return res.json({ redirect: '/login' });
	} else {
		next();
	}
}

export default index;
