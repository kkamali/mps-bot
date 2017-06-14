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

bot.on('conversationUpdate', (message) => {
    (message.membersAdded || [])
        .filter((identity) => identity.id == message.address.bot.id)
        .forEach((identity) => {
            const reply = new builder.Message()
                .address(message.address)
                .text("Hi, I'm MPSBot! I can answer questions about Microsoft Production Studios! You can ask me things like 'What is MPS?' or 'What kind of services does MPS provide?'");
            bot.send(reply);
        });
});

bot.dialog('/', intents);

// intents.onBegin(
//     function(session, args, next) {
//         session.send("Hi! I’m MPSBot -- I can answer questions about Microsoft Production Studios! You can ask me things like 'What is MPS?' or 'What kind of services does MPS provide?'");
//     }
// );

intents.matches('mps_general', [
    function(session, args, next) {
        session.send("Microsoft Production Studios is a state of the art multimedia facility specializing in all types of media from smaller scale talking head videos, to large scale greenscreen and broadcast videos. We also specialize in audio with two 5.1/7.1 top of the line audio control/mixdown studios with audio booths and other types of interactive media, such as AR/VR/, UI/UX, Touch Screens.");
        session.send("Check out our 3D virtual tour here: https://my.matterport.com/show/?m=LgBoUPH6s4Y");
    }
]);

intents.matches('public_availability', [
    function(session, args, next) {
        session.send("When we have availability we do accept projects and studio bookings. Please contact bookit@microsoft.com for more information on bookings and availability.");
    }
]);

intents.matches('services', [
    function(session, args, next) {
        session.send("We have state of the art sound stages, edit bays, audio control studios, mixdown rooms, encoding archival services and webcast capabilities.");
    }
]);

intents.matches('personnel', [
    function(session, args, next) {
        session.send("Yes, we have all of the talent available to create the most compelling and relevant media for your audience and market.");
        session.send("Please Contact bookit@microsoft.com");
    }
]);

intents.matches('count_sound_stages', [
    function(session, args, next) {
        var card = createCard(args.intent, session);
        var msg = new builder.Message(session).addAttachment(card);
        session.send(msg);
        session.send("We offer two large stages (A,B) and two smaller stages (D,E). They are all equipped with green screen capability. We also offer two voice over booths and two audio control rooms.");
        session.send("Check out our Matterport scans of stages A, B, C, here --  https://my.matterport.com/show/?m=LgBoUPH6s4Y");
    }
]);

intents.matches('count_editing_bays', [
    function(session, args, next) {
        var card = createCard(args.intent, session);
        var msg = new builder.Message(session).addAttachment(card);
        session.send(msg);
        session.send("We have 16 edit suites, 3 of which are larger suites. We can expand to 20 suites.");
        session.send("Check out one of our edit bays here -- https://my.matterport.com/show/?m=LgBoUPH6s4Y");
    }
]);

intents.matches('editing_software', [
    function(session, args, next) {
        session.send("We are an Adobe Premiere house. Each suite has the full Adobe Creative Cloud Suite. Red Giant Ultimate is also on each system");
    }
]);

intents.matches('count_audio_control', [
    function(session, args, next) {
        session.send("We have three ACR (audio control rooms), 2 voice over booths and a few post production audio design rooms.");
    }
]);

intents.matches('audio_equipment', [
    function(session, args, next) {
        session.send("We mainly use Pro Tools for audio post and SSL console for live production.");
    }
]);

intents.matches('mixdown_rooms', [
    function(session, args, next) {
        session.send("We have 5 mixing rooms.");
    }
]);

intents.matches('square_footage_mps', [
    function(session, args, next) {
        session.send("We have 65,000 sqft.");
    }
]);

intents.matches('music_services', [
    function(session, args, next) {
        session.send("We offer custom composition, sound design and have an extensive needle drop music library.");
    }
]);

intents.matches('streaming_services', [
    function(session, args, next) {
        session.send("Yes, streaming will be provided through both Skype Meeting Broadcast and MPS Live for internal audiences, built on Azure Media Services through a collaboration between Production Studios and IT. Encryption and authentication meet ISRM standards for HBI content.");
        session.send("Contact StreamTeam@microsoft.com for more info.");
    }
]);

intents.matches('book_services', [
    function(session, args, next) {
        session.send("Email bookit@microsoft.com or you can call us at 425.706.7501.");
    }
]);

intents.matches('pay_services', [
    function(session, args, next) {
        session.send("There are two ways to pay: we cross charge an internal SAP code or submit an external bill to an outside company.");
    }
]);

intents.matches('vr_services', [
    function(session, args, next) {
        session.send("we work with an extensive group of developers and outside agencies to develop AR/MR/VR work.");
    }
]);

intents.matches('type_vr_services', [
    function(session, args, next) {
        session.send("In 2017 we explored HoloLens mixed reality proof of concept called HoloStages and a virtual experience through HTC Vive and Oculus of our new stages.");
    }
]);

intents.matches('book_vr_services', [
    function(session, args, next) {
        session.send("Email bookit@microsoft.com or you can call us at 425.706.7501.");
    }
]);

intents.matches('network_support', [
    function(session, args, next) {
        session.send("Two 10GB direct internet ISPs and 400GBPS on Corpnet.");
    }
]);

intents.matches('edit_bays_editors', [
    function(session, args, next) {
        session.send("No, but you can hire your own or we can suggest one!");
    }
]);

intents.matches('own_crew', [
    function(session, args, next) {
        session.send("In certain cases, yes. Give us a call!");
    }
]);

intents.matches('book_by_hour', [
    function(session, args, next) {
        session.send("Yes, you can. Please email bookit@microsoft.com or you can call us at 425.706.7501.");
    }
]);

intents.matches('encode_archive', [
    function(session, args, next) {
        session.send("Yes, we archive all of Microsoft's media and we have a full digital media services with the best encoding engineers and technology.");
    }
]);

intents.matches('rehearsals', [
    function(session, args, next) {
        session.send("Yes! The space can be rented for events. Email bookit@microsoft.com or you can call us at 425.706.7501.");
    }
]);

intents.matches('closed_captioning', [
    function(session, args, next) {
        session.send("Yes, you can find details and more information at this website about accessible media. http://Enable.");
    }
]);

intents.matches('book_crew', [
    function(session, args, next) {
        session.send("Email bookit@microsoft.com or you can call us at 425.706.7501.");
    }
]);

intents.matches('security', [
    function(session, args, next) {
        session.send("Email bookit@microsoft.com or you can call us at 425.706.7501.");
    }
]);

intents.matches('open_po', [
    function(session, args, next) {
        session.send("We have a team of coordinators that can help with that. Email AVLSOW@microsoft.com.");
    }
]);

intents.matches('green_rooms', [
    function(session, args, next) {
        session.send("Yes, we have very comfortable private green rooms with a 'living room' layout (including sofa, table and TV) with kitchens, private bathrooms and showers.");
    }
]);

intents.matches('tour', [
    function(session, args, next) {
        session.send("Email bookit@microsoft.com or you can call us at 425.706.7501.");
    }
]);

intents.matches('pricing', [
    function(session, args, next) {
        session.send("Email bookit@microsoft.com or you can call us at 425.706.7501.");
    }
]);

intents.matches('ada_standards', [
    function(session, args, next) {
        session.send("Yes, Microsoft is very dedicated to the inclusion of all people.");
    }
]);

intents.matches('conference_rooms', [
    function(session, args, next) {
        session.send("MPS has a number of remote desks located on the second floor as well as conference rooms that can be booked with reception upon availability.");
    }
]);

intents.matches('approved_vendors', [
    function(session, args, next) {
        session.send("About 40 approved suppliers.");
    }
]);

intents.matches('info_vendors', [
    function(session, args, next) {
        session.send("Email AVLSOW@microsoft.com.");
    }
]);

function createCard(intent, session) {
    if (intent == "count_sound_stages") {
        return new builder.HeroCard(session)
            .title("Studio D")
            .subtitle("One of our sound stages at MPS")
            .images([
                builder.CardImage.create(session, "https://ituoyw.dm2302.livefilestore.com/y4mgGEolZw9cSdPADEYbPvNri9T069D395crfgCXbi0kalm40Dl3qKEIDjiJjyJKmZ8DkJaiXjGeAILA4BLJb58LAMzKVqble9xByMoIEOvLKBA-E8msK9mVZcRgwT5iYpM-13jVIlM8Ich5FW9qqvFVLXOWr2BSL3jA5DyXVNDKI-_tofLtM0FfgFfF06bzPXHTM9WlaxSK870uxzGhLZHcVs3P88QY_I-T1z9vBMCb2c?width=7360&height=4912&cropmode=none")
            ]);
    }
    if (intent == "count_editing_bays") {
        return new builder.VideoCard(session)
            .title("Edit Bay")
            .subtitle("One of our edit bays at MPS")
            .media([
                {
                    url: "https://onedrive.live.com/download?cid=55C97BAF21B67854&resid=55C97BAF21B67854%21117&authkey=AH0pdJQx5I9DNPA" 
                }
            ]);
    }
}

intents.onDefault(builder.DialogAction.send("I'm sorry, I don't understand. You can ask me things like 'What is MPS?' or 'What kind of services does MPS provide?'"));
