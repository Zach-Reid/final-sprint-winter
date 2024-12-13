const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true
}));

// Set EJS as view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Dummy poll data for illustration (replace with actual DB logic)
const polls = [
    { id: 1, question: 'What is your favorite color?', options: [{ answer: 'Red', votes: 3 }, { answer: 'Blue', votes: 5 }] },
    { id: 2, question: 'What is your favorite pet?', options: [{ answer: 'Cat', votes: 2 }, { answer: 'Dog', votes: 8 }] }
];

// Routes

// Home page - unauthenticated view
app.get('/', (req, res) => {
    const user = req.session.user || null; // Get user from session if available
    res.render('index/unauthenticatedIndex', { user });
});

// Dashboard - only visible to logged-in users
app.get('/dashboard', (req, res) => {
    const user = req.session.user || null; // Get user from session if available
    if (!user) {
        return res.redirect('/');
    }
    res.render('index/authenticatedIndex', { user, polls });
});

// Logout route
app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send("Failed to log out.");
        }
        res.redirect('/');
    });
});

// Start the server
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});



