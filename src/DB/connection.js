
const mongoose = require('mongoose');
//const DB_URL = "mongodb://127.0.0.1:27017/Infection"
//const DB_URL =  'mongodb+srv://YoussefRashad:tzmNOPr0T7T29tvk@cluster0.96shq.mongodb.net/Infection?retryWrites=true&w=majority'
const DB_URL =  'mongodb+srv://mostafaghazaly:tsaCFDK0LVvAPYdo@cluster0.lsbie.mongodb.net/InfectionDisease?retryWrites=true&w=majority'


mongoose.connect(DB_URL,{
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
})