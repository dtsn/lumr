import createError from 'http-errors';
import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import lightsRouter from './api/lights.js';
import discoverRouter from './api/discover.js';
import fxRouter from './api/fx.js';

const app = express();
const port = process.env.PORT || 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(path.resolve(), 'public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/api/lights', lightsRouter);
app.use('/api/fx', fxRouter);
app.use('/api/discover', discoverRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};
	console.log(err);

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

app.listen(port, () => console.log(`Listening on port ${port}`));
