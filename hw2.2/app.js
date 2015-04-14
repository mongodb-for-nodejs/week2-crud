var MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost:27017/weather', function (err, db) {
    if (err) { throw err; }

    var data = db.collection('data');

    var query = {};
    var options = { sort: [['State', 1], ['Temperature', -1]] };

    var coursor = data.find(query, {}, options);



    var i = 0;
    var currentState = '';
    var resultArr = [];

    coursor.each(function (err, doc) {
        if (doc == null) {
            console.dir(resultArr);

            for (var j = 0; j < resultArr.length; j++) {
                data.update({ '_id': resultArr[j]['_id'] }, { $set: { 'month_high': true } }, {}, function (err, updated) {
                    if (err) { throw err; };
                    console.log('Updated: ' + updated);
                });
            }

            return 0;
            db.close();
        }

        if (i == 0) {
            currentState = doc.State;
            resultArr.push(doc);
        }

        if (currentState != doc.State) {
            currentState = doc.State;
            resultArr.push(doc);

        }

        i++;
    });

});
