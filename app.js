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

intents.matches('mps_general', [
    function(session, args, next) {
        session.send("Microsoft Production Studios is a state of the art multimedia facility specializing in all types of media from smaller scale talking head videos, to large scale greenscreen and broadcast videos. We also specialize in audio with two 5.1/7.1 top of the line audio control/mixdown studios with audio booths and other types of interactive media, such as AR/VR/, UI/UX, Touch Screens.");
        session.send("Check out our 3D virtual tour here: https://my.matterport.com/show/?m=LgBoUPH6s4Y");
        session.send("Would you like to ask me any other questions about MPS? You can ask me things like -- 'What types of services does MPS provide?' or 'How many sound stages are there?'");
    }
]);

intents.matches('public_availability', [
    function(session, args, next) {
        session.send("When we have availability we do accept projects and studio bookings. Please contact bookit@microsoft.com for more information!");
        session.send("Would you like to ask me any other questions about our studios? You can ask me things like 'What types of services does MPS provide?' or 'How many sound stages are there?'");
    }
]);

intents.matches('services', [
    function(session, args, next) {
        session.send("We have state of the art sound stages, edit bays, audio control studios, mixdown rooms, encoding archival services and webcast capabilities.");
        session.send("Check out our 3D virtual tour here: https://my.matterport.com/show/?m=LgBoUPH6s4Y");
        session.send("Would you like to ask me any other questions about MPS? You can ask me things like 'Does MPS provide virtual reality experiences?' or 'Are there green rooms?'");
    }
]);

intents.matches('personnel', [
    function(session, args, next) {
        session.send("Yes, at Microsoft Production Studios we have all of the talent available to create the most compelling and relevant media for your audience and market. Please contact us at bookit@microsoft.com for more information!");
        session.send("Would you like to ask me any other questions about MPS? You can ask me things like 'Do edit bays come with an editor?' or 'How do you book services?'");
    }
]);

intents.matches('count_sound_stages', [
    function(session, args, next) {
        var card = createCard(args.intent, session);
        var msg = new builder.Message(session).addAttachment(card);
        session.send(msg);
        session.send("We offer two large stages (A,B) and two smaller stages (D,E). They are all equipped with green screen capability. We also offer two voice over booths and two audio control rooms.");
        session.send("Check out our Matterport scans of stages A, B, C, here --  https://my.matterport.com/show/?m=LgBoUPH6s4Y");
        session.send("Would you like to ask me any other questions about MPS? You can ask me things like 'How many ACRs does MPS have?' or 'Can I bring my own crew?'");
    }
]);

intents.matches('count_editing_bays', [
    function(session, args, next) {
        var card = createCard(args.intent, session);
        var msg = new builder.Message(session).addAttachment(card);
        session.send(msg);
        session.send("At MPS we have 16 edit suites, 3 of which are larger suites. We can expand to 20 suites.");
        session.send("You can check out a scan of one of our edit bays here -- http://msvr.us/Editsuite");
        session.send("Would you like to ask me any other questions about MPS? You can ask me things like 'How many sound stages does MPS have?' or 'What editing software do you use?'");
    }
]);

intents.matches('editing_software', [
    function(session, args, next) {
        session.send("Microsoft Production Studios are an Adobe Premiere house. Each suite has the full Adobe Creative Cloud Suite and Red Giant Ultimate is also on each system.");
        session.send("You can check out a scan of one of our edit bays here -- http://msvr.us/Editsuite");
        session.send("Would you like to ask me any other questions about MPS? You can ask me things like 'How many sound stages does MPS have?' or 'Can I book edit bays by the hour?'");
    }
]);

intents.matches('count_audio_control', [
    function(session, args, next) {
        var card = createCard(args.intent, session);
        var msg = new builder.Message(session).addAttachment(card);
        session.send(msg);
        session.send("Here at MPS we have three ACR (audio control rooms), 2 voice over booths and a few post production audio design rooms.");
        session.send("Check out our Audio control rooms and VO booths here --  http://msvr.us/acr");
        session.send("Would you like to ask me any other questions about MPS? You can ask me things like 'What audio equipment do you use?' or 'Do you have music services?'");
    }
]);

intents.matches('audio_equipment', [
    function(session, args, next) {
        session.send("We mainly use Pro Tools for audio post and SSL console for live production.");
        session.send("Check out our Audio control rooms and VO booths here --  http://msvr.us/acr");
        session.send("Would you like to ask me any other questions about MPS? You can ask me things like 'How many ACRs does MPS have?' or 'Do you have music services?'");
    }
]);

intents.matches('mixdown_rooms', [
    function(session, args, next) {
        session.send("We have 5 mixing rooms.");
        session.send("Check out one of our mixdown rooms here - https://my.matterport.com/show/?m=LgBoUPH6s4Y");
        session.send("Would you like to ask me any other questions about MPS? You can ask me things like 'How do I book services?' or 'How many editing suites do you have?'");
    }
]);

intents.matches('square_footage_mps', [
    function(session, args, next) {
        session.send("We have 65,000 sqft here at Microsoft Production Studios.");
        session.send("Check out our 3D virtual tour here: https://my.matterport.com/show/?m=LgBoUPH6s4Y");
        session.send("Would you like to ask me any other questions about MPS? You can ask me things like 'How many sound stages are there?' or 'What types of services do you provide?'");
    }
]);

intents.matches('music_services', [
    function(session, args, next) {
        session.send("We offer custom composition, sound design and have an extensive needle drop music library. Please contact stmusic@microsoft.com!");
        session.send("Would you like to ask me any other questions about MPS? You can ask me things like 'How many audio control rooms do you have?' or 'When are you open?'");
    }
]);

intents.matches('streaming_services', [
    function(session, args, next) {
        session.send("Yes, streaming will be provided through both Skype Meeting Broadcast and MPS Live for internal audiences, built on Azure Media Services through a collaboration between Production Studios and IT. Encryption and authentication meet ISRM standards for HBI content.");
        session.send("Check out our broadcast service center here -- http://msvr.us/bscmay17");
        session.send("Please contact StreamTeam@microsoft.com for more info about our services!");
        session.send("Would you like to ask me any other questions about MPS? You can ask me things like 'What kind of network do you support?' or 'Do you have music services?'");
    }
]);

intents.matches('book_services', [
    function(session, args, next) {
        session.send("If you'd like to book services with us please contact bookit@microsoft.com or you can call us at 425.706.7501!");
        session.send("Would you like to know more about our services at MPS? You can ask me things like 'What types of services do you provide?' or 'Do you create mixed reality experiences?'");
    }
]);

intents.matches('pay_services', [
    function(session, args, next) {
        session.send("There are two ways to pay: we cross charge an internal SAP code or submit an external bill to an outside company.");
        session.send("For more information about payment, please contact StreamTeam@microsoft.com for more information.");
        session.send("Would you like to know more about us at MPS? You can ask me things like 'Can I book facilities by the hour?' or 'How do I book services?'");
    }
]);

intents.matches('vr_services', [
    function(session, args, next) {
        session.send("We work with an extensive group of developers and outside agencies to develop AR/MR/VR work!");
        session.send("Would you like to know more about MPS? You can ask me things like 'What type of virutal reality experiences do you create?' or 'How do I book a virtual reality experience?'");
    }
]);

intents.matches('type_vr_services', [
    function(session, args, next) {
        session.send("In 2017 we explored HoloLens mixed reality proof of concept called HoloStages and a virtual experience through HTC Vive and Oculus of our new stages.");
        session.send("Would you like to know more about MPS? You can ask me things like 'How do I book a VR experience?' or 'How many sound stages do you have?'");
    }
]);

intents.matches('book_vr_services', [
    function(session, args, next) {
        session.send("For information about booking VR services, please contact us at bookit@microsoft.com or you can call us at 425.706.7501.");
        session.send("Would you like to know more about MPS? You can ask me things like 'What types of VR experiences do you create?' or 'How do I book a crew for a project?'");
    }
]);

intents.matches('network_support', [
    function(session, args, next) {
        session.send("We have two 10GB direct internet ISPs and 400GBPS on Corpnet.");
        session.send("Would you like to know more about MPS? You can ask me things like 'What audio equipment do you use?' or 'How do I get a project order opened with MPS?'");
    }
]);

intents.matches('edit_bays_editors', [
    function(session, args, next) {
        session.send("No, editors are not provided but you can hire your own or we can suggest one!");
        session.send("Would you like to know more about MPS? You can ask me things like 'How many edit bays do you have?' or 'How many square feet is MPS?'");
    }
]);

intents.matches('own_crew', [
    function(session, args, next) {
        session.send("In certain cases, yes you can bring in your own crew. Give us a call at 425.706.7501!");
        session.send("Would you like to know more about MPS? You can ask me things like 'Can I book by the hour?' or 'What kind of network do you support?'");
    }
]);

intents.matches('book_by_hour', [
    function(session, args, next) {
        session.send("Yes, you can book by the hour. Please email bookit@microsoft.com or you can call us at 425.706.7501.");
        session.send("Would you like to know more about MPS? You can ask me things like 'How many audio control rooms are there?' or 'How many sound stages do you have?'");
    }
]);

intents.matches('encode_archive', [
    function(session, args, next) {
        session.send("Yes, we archive all of Microsoft's media and we have a full digital media services with the best encoding engineers and technology.");
        session.send("Would you like to know more about MPS? You can ask me things like 'What kind of network do you support?' or 'How many sound stages do you have?");
    }
]);

intents.matches('rehearsals', [
    function(session, args, next) {
        session.send("Yes! The space can be rented for events. Please email us at bookit@microsoft.com or you can call us at 425.706.7501.");
        session.send("Would you like to ask me more questions about MPS? You can ask me things like 'How many sound stages do you have?' or 'Are there green rooms available?'")
    }
]);

intents.matches('closed_captioning', [
    function(session, args, next) {
        session.send("Yes, you can find details and more information at this website about accessible media -- http://Enable.");
        session.send("Would you like to ask me more questions about MPS? You can ask me things like 'Does MPS follow ADA standards?' or 'How do I book a crew?'");
    }
]);

intents.matches('book_crew', [
    function(session, args, next) {
        session.send("For questions about booking crew members, please email us at bookit@microsoft.com or you can call us at 425.706.7501.");
        session.send("Would you like to ask me more questions about MPS? You can ask me things like 'Can I bring my own crew?' or 'Can I book by the hour?'");
    }
]);

intents.matches('security', [
    function(session, args, next) {
        session.send("For more information about our security protocols, please email us at bookit@microsoft.com or you can call us at 425.706.7501.");
        session.send("Would you like to ask me more questions about MPS? You can ask me things like 'What kind of network do you support?' or 'What kinds of services do you provide?'");
    }
]);

intents.matches('open_po', [
    function(session, args, next) {
        session.send("We have a team of coordinators that can help with opening project orders! Please email AVLSOW@microsoft.com for more information.");
        session.send("Would you like to ask me more questions about MPS? You can ask me things like 'How do I book a crew?' or 'How many sound stages are there?'");
    }
]);

intents.matches('green_rooms', [
    function(session, args, next) {
        session.send("Yes, at Microsoft Production Studios we have very comfortable private green rooms with a 'living room' layout (including sofa, table and TV) with kitchens, private bathrooms and showers.");
        session.send("Check out our 3D virtual tour here: https://my.matterport.com/show/?m=LgBoUPH6s4Y");
        session.send("Would you like to ask me more questions about MPS? You can ask me things like 'Do you host rehearsals?' or 'When are you open?'");
    }
]);

intents.matches('tour', [
    function(session, args, next) {
        session.send("If you'd like to schedule a tour, please email bookit@microsoft.com or you can call us at 425.706.7501.");
        session.send("You can also check out our 3D virtual tour here: https://my.matterport.com/show/?m=LgBoUPH6s4Y");
        session.send("Would you like to ask me more questions about MPS? You can ask me things like 'When are you open?' or 'Do you have green rooms?'");
    }
]);

intents.matches('pricing', [
    function(session, args, next) {
        session.send("For information on pricing please email bookit@microsoft.com or you can call us at 425.706.7501.");
        session.send("Would you like to ask me more questions about MPS? You can ask me things like 'Can I take a tour?' or 'Can I book by the hour?'");
    }
]);

intents.matches('ada_standards', [
    function(session, args, next) {
        session.send("Yes, Microsoft is very dedicated to the inclusion of all people.");
        session.send("Would you like to ask me more questions about MPS? You can ask me things like 'Can I take a tour?' or 'Do you do closed captioning?'");
    }
]);

intents.matches('conference_rooms', [
    function(session, args, next) {
        session.send("MPS has a number of remote desks located on the second floor as well as conference rooms that can be booked with reception upon availability.");
        session.send("Would you like to ask me more questions about MPS? You can ask me things like 'How do I book a conference room?' or 'How many edit rooms are there?'");
    }
]);

intents.matches('approved_vendors', [
    function(session, args, next) {
        session.send("At Microsoft Production Studios we have 40 approved suppliers.");
        session.send("Would you like to know more about MPS? You can ask me questions like 'Can I get information on approved suppliers?' or 'How do I open a project order?'");
    }
]);

intents.matches('info_vendors', [
    function(session, args, next) {
        session.send("For information on our approved vendors, please email us at AVLSOW@microsoft.com.");
        session.send("Would you like to know more about MPS? You can ask me questions like 'Do you follow ADA standards?' or 'Do you have Skype services?'");
    }
]);

intents.matches('book_conference_room', [
    function(session, args, next) {
        session.send("To book a conference room, please contact recep127@microsoft.com for more information.");
        session.send("Would you like to know more about MPS? You can ask me questions like 'How many approved vendors does MPS have?' or 'Can I take a tour?'");
    }
]);

intents.matches('hours', [
    function(session, args, next) {
        session.send("Microsoft Production Studios is open Monday through Friday from 8-6pm.");
        session.send("Would you like to learn more about MPS? You can ask me questions like 'What kind of services do you provide?' or 'What audio equipment do you use?'");
    }
]);

intents.matches('pictures', [
    function(session, args, next) {
        var card = createCard(args.intent, session);
        var msg = new builder.Message(session).addAttachment(card);
        session.send(msg);
        session.send("Check out our 3D virtual tour here: https://my.matterport.com/show/?m=LgBoUPH6s4Y");
        session.send("Would you like to learn more about MPS? You can ask me questions like 'What kind of services do you provide?' or 'How many editing rooms do you have?'");
    }
]);

intents.matches('videos', [
    function(session, args, next) {
        session.send("We create ads, training videos, broadcasts, case studios, demo, sizzle reels, game trailers and animated videos here at Microsoft Studios!");
        session.send("Would you like to learn more about MPS? You can ask me questions like 'What kind of services do you provide?' or 'How many editing rooms do you have?'");
    }
]);

function createCard(intent, session) {
    if (intent == "count_sound_stages") {
        return new builder.VideoCard(session)
            .title("Studio A")
            .subtitle("One of our sound stages at MPS")
            .media([
                {
                    url: "https://onedrive.live.com/download?cid=55C97BAF21B67854&resid=55C97BAF21B67854%21119&authkey=ACmRFtvAKCkQXJc"
                }
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
    if (intent == "count_audio_control") {
        return new builder.VideoCard(session)
            .title("Audio Control Room")
            .subtitle("One of our audio control rooms at MPS")
            .media([
                {
                    url: "https://onedrive.live.com/download?cid=55C97BAF21B67854&resid=55C97BAF21B67854%21118&authkey=AC2rTfPdFxYMOBE"
                }
            ]);
    }
    if (intent == "pictures") {
        return new builder.HeroCard(session)
            .title("Microsoft Production Studios")
            .images([
                builder.CardImage.create(session, "https://h2byka.dm2302.livefilestore.com/y4mnmxjY-STMamVS18JIkE33oxXP2Nf5015NEeNySngxgWj8idKrcYvHrJCSs4d8_nLbxzLl_eAhE-JR_NtKUq6XAM_nWM3rvcqGKqba5sO2USwmKIm1necibT1Cn06LuNsAfmzK7t28JpCTYObVAqTHR9kzLrZTv9QV07-rya22B9FrNHCirZJcokqdmpcrm3_6QoiQw-sAxzBuSPDZFmi5xkPjuY-tAo8633QyzW0pzk?width=7360&height=4912&cropmode=none", "https://5asfwa.dm2302.livefilestore.com/y4mvLljYwKU1QePvBzLHmDWxQ1oI9WPa2wqVXSHfoy9rukBnhcv4wdypekBJ-G1WzHaYqOxoe3t-t6FW4Q0B1IJc4SkhNsalqcgrtdm6PsF-9L2GtdDj8O1-LP8gkFwfLDV0I0S3sfwuBIhhIgxKvqkQu5nU1-lI2GKWECva1mHDclT_vM4VcQgc0o2WQ_SFXaxGVxDtcsDtaM0FfZIWsoGZ7igTPjlCATFTuBVQCqjqUg?width=7360&height=4912&cropmode=none")
            ]);
    }
}

intents.onDefault(builder.DialogAction.send("I'm sorry, I don't understand. You can ask me things like 'What is MPS?' or 'What kind of services does MPS provide?'"));
