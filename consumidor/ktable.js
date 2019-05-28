'use strict';

/*
    { value: '{"quality":720,"ping":149}' }
*/

const {KafkaStreams} = require("kafka-streams");
const config = require ('./config.json');

const kafkaStreams = new KafkaStreams(config);

kafkaStreams.on("error", (error) => {
    console.log("Error occured:", error.message);
});

//creating a ktable requires a function that can be
//used to turn the kafka messages into key-value objects
//as tables can only be built on key-value pairs

function keyMapper  (a)  {
    const asd = JSON.parse(a.value);
        return ({ ts: time, key: key.toString(), value: JSON.parse(value.toString()) });
};


    const table = kafkaStreams.getKTable("asd", keyMapper);

    //consume the first 100 messages on the topic to build the table
    table
        .consumeUntilMs(10000, () => {
            //fires when 100 messages are consumed

            //the table has been built, there are two ways
            //to access the content now

            //1. as map object
            table.getTable().then(map => {
                console.log(map); //will log "strawberry"
            });

            //2. as replayed stream
            table.forEach(row => {
                console.log(row);
            });

            //you can replay as often as you like
            //replay will simply place every key-value member
            //of the internal map onto the stream once again
            table.replay();
            //kafka consumer will be closed automatically
        })
        //be aware that any operator you append during this runtime
        //will apply for any message that is on the stream (in change-log behaviour)
        //you have to consume the topic first, for it to be present as table
        .atThroughput(50, () => {
            //fires once when 50 messages are consumed
            console.log("consumed 50 messages.");
            run();
        });




const run = async () => {
    await table.start()

};

    

run ()
    .catch (console.error);
