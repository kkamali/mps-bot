require('dotenv-extended').load();

var builder = require('botbuilder');
var restify = require('restify');

var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log('%s listening to %s', server.name, server.url);
});

var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});

server.get('/', restify.serveStatic({
    directory: __dirname,
    default: '/index.html'
}));

server.post('/api/messages', connector.listen());

var bot = new builder.UniversalBot(connector);

var recognizer = new builder.LuisRecognizer(process.env.LUIS_MODEL_URL);
var intents = new builder.IntentDialog({ recognizers: [recognizer] });
bot.dialog('/', intents);

intents.onBegin(
    function(session, args, next) {
        session.send("Hi! I’m MPSBot -- I can answer questions about Microsoft Production Studios! You can ask me things like 'What is MPS?' or 'What kind of services does MPS provide?'");
    }
);

intents.matches('mps_general', [
    function(session, args, next) {
        session.send("You reached MPS General");
    }
]);

intents.matches('services', [
    function(session, args, next) {
        session.send("You reached services");
    }
]);

intents.matches('audio_equipment', [
    function(session, args, next) {
        session.send("You reached audio equipment");
    }
]);

intents.matches('book_services', [
    function(session, args, next) {
        session.send("You reached service booking");
    }
]);

intents.matches('count_editing_bays', [
    function(session, args, next) {
        session.send("You reached counting editing bays");
    }
]);

intents.onDefault(builder.DialogAction.send("I'm sorry, I don't understand. You can ask me things like 'What is MPS?' or 'What kind of services does MPS provide?'"));
