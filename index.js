const express = require("express");
const path = require("path");
const csrf = require("csurf");
const flash = require("connect-flash");
const mongoose = require("mongoose");
const exphbs = require("express-handlebars");
const session = require("express-session");
const MongoStore = require("connect-mongodb-session")(session);
const homeRouters = require("./routes/home");
const addRouters = require("./routes/add");
const courseRouters = require("./routes/courses");
const cardRouters = require("./routes/card");
const AuthRouters = require("./routes/auth");
const ordersRouters = require("./routes/orders");
const app = express();
const varMiddleware = require("./middleware/variables");
const userMiddleware = require("./middleware/user");
const keys = require("./keys");

const hbs = exphbs.create({
  defaultLayout: "main",
  extname: "hbs",
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true,
  },
});

const store = new MongoStore({
  collection: "sessions",
  uri: keys.MONGODB_URI,
});

app.engine("hbs", hbs.engine); // Регистрируем движок hbs и передаем его значение
app.set("view engine", "hbs"); // Здесь уже его используем
app.set("views", "views");

app.use(express.static(path.join(__dirname, "public")));
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(
  session({
    secret: keys.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store,
  })
);
app.use(csrf());
app.use(flash());
app.use(varMiddleware);
app.use(userMiddleware);

app.use("/", homeRouters);
app.use("/add", addRouters);
app.use("/courses", courseRouters);
app.use("/card", cardRouters);
app.use("/orders", ordersRouters);
app.use("/auth", AuthRouters);

const PORT = process.env.PORT || 3000;

async function start() {
  try {
    await mongoose.connect(keys.MONGODB_URI);

    // const candidate = await User.findOne();
    // if (!candidate) {
    //   const user = new User({
    //     email: "apc7@ukr.net",
    //     name: "Sergey",
    //     card: { items: [] },
    //   });
    //   await user.save();
    // }

    app.listen(PORT, () => {
      console.log(`Server has been ran on port ${PORT} `);
    });
  } catch (error) {
    console.log(error);
  }
}

start();

const password = "DSmyJHjEmJT597s3";
const user = "apc71405";
const ip = "46.98.106.219/32";
