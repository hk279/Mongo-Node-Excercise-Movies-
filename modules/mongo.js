var mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const userSchema = mongoose.Schema(
    {
        username: {
            type: String,
            required: [true, "Username is required."],
            minlength: [3, "Username needs to be at least 3 characters long."],
        },
        password: {
            type: String,
            required: [true, "Password is required."],
            minlength: [3, "Password needs to be at least 3 characters long."],
        },
    },
    {
        collection: "users",
    }
);

const movieSchema = mongoose.Schema(
    {
        plot: String,
        genres: Array,
        runtime: Number,
        cast: Array,
        num_mflix_comments: Number,
        poster: String,
        title: String,
        fullplot: String,
        countries: Array,
        released: Date,
        directors: Array,
        writers: Array,
        awards: Object,
        lastupdated: String,
        year: Number,
        imdb: Object,
        type: String,
        tomatoes: Object,
    },
    {
        strict: false,
        collection: "movies",
    }
);

exports.saveUser = function saveUser(regUsername, regPassword) {
    const User = mongoose.model("User", userSchema);

    const uri = process.env.URI;
    mongoose.connect(uri, { dbName: "users" });

    var db = mongoose.connection;
    db.on("error", () => {
        console.log("Database connection error");
    });
    db.once("open", () => {
        console.log("Database connection established!");
    });

    var newUser = new User({
        username: regUsername,
        password: regPassword,
    });

    newUser
        .save()
        .catch((err) => {
            console.log(err.message);
        })
        .then((r) => {
            console.log("New user saved\n" + r);
            db.close();
        });
};

exports.getUser = async function getUser(loginUsername, loginPassword) {
    const User = mongoose.model("User", userSchema);

    const uri = process.env.URI;
    mongoose.connect(uri, { dbName: "users" });

    var db = mongoose.connection;
    db.on("error", () => {
        console.log("Database connection error");
    });
    db.once("open", () => {
        console.log("Database connection established!");
    });

    var identifiedUser = await User.find({
        username: loginUsername,
        password: loginPassword,
    })
        .catch((err) => {
            console.log(err);
        })
        .then((r) => {
            if (r.length > 0) {
                confirmedId = r[0];
                console.log("Login successful!");
                console.log(confirmedId.username);
                db.close();
                return confirmedId;
            } else {
                db.close();
                return null;
            }
        });
    console.log(identifiedUser);
    return identifiedUser;
};
exports.getMovies = async function getMovies(keyword) {
    const Movie = mongoose.model("Movie", movieSchema);

    const uri = process.env.URI;

    mongoose.connect(uri, { dbName: "sample_mflix" });

    var db = mongoose.connection;
    db.on("error", () => {
        console.log("Database connection error");
    });
    db.once("open", () => {
        console.log("Database connection established!");
    });

    var result = await Movie.find({
        title: new RegExp("\\b" + keyword + "\\b", "i"),
    })
        .catch((err) => {
            console.log(err);
        })
        .then((r) => {
            db.close();
            return r;
        });

    console.log(result);
    return result;
};
