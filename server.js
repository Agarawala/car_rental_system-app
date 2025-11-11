const express = require("express");
const app = express();
const PORT = 3000;

app.use(express.json());
let users = [];

let cnt = 1;
app.post("/signup", (req, res) => {
  const { username, password } = req.body;

  users.push({
    userId: cnt,
    username,
    password,
    bookings: [],
  });
  res.status(201).json({
    msg: "added with userId " + cnt,
  });
  cnt++;
});

app.get("/users", (req, res) => {
  res.json({
    allUsers: users,
  });
});

let cnt2 = 100;
app.post("/bookings/:userId", (req, res) => {
  const { carName, days, rentPerDay } = req.body;

  for (let i = 0; i < users.length; i++) {
    if (req.params.userId == users[i]["userId"]) {
      users[i]["bookings"].push({
        bookingId: cnt2,
        carName,
        days,
        rentPerDay,
        status: "booked",
      });

      return res.status(201)({
        msg: "booked",
        bookingId: cnt2++,
        totalcost: days * rentPerDay,
      });
    }
  }

  res.json({
    msg: "something went wrong",
  });
});

app.get("/bookings/:userId", (req, res) => {
  const { userId } = res.params;
  for (let i = 0; i < users.length; i++) {
    if (userId == users[i]["userId"]) {
      return res.json({
        msg: users[i]["bookings"],
      });
    }
  }
  res.json({
    msg: "somthing wrong",
  });
});

app.get("/bookings/:userId/:bookingId", (req, res) => {
  const { userId, bookingId } = req.params;

  for (let i = 0; i < users.length; i++) {
    if (userId == users[i]["userId"]) {
      for (let j = 0; j < users[i]["bookings"].length; j++) {
        if (users[i]["bookings"][j]["bookingId"] == bookingId) {
          return res.json({
            msg: users[i]["bookings"][j],
          });
        }
      }
    }
  }

  res.json({
    msg: "something went wrong",
  });
});

app.put("/bookings/:userId/:bookingsId/:status", (req, res) => {
  const { userId, bookingId, status } = req.params;
  for (let i = 0; i < users.length; i++) {
    if (userId == users[i]["userId"]) {
      for (let j = 0; j < users[i]["bookings"].length; j++) {
        if (users[i]["bookings"][j]["bookingId"] == bookingId) {
          users[i]["bookings"][j]["status"] = status;
          res.json({
            message: "Status updated successfully",
          });
        }
      }
    }
  }

  res.json({
    msg: "somthing wrong",
  });
});

app.delete("bookings/:userId/:bookingId", () => {
  const { userId, bookingId } = req.params;
  let newarr = [];

  for (let i = 0; i < users.length; i++) {
    if (userId == users[i]["userId"]) {
      for (let j = 0; j < users[i]["booking"].length; j++) {
        if (users[i]["bookings"][j]["bookingId"] != bookingId) {
          newarr.push(users[i]["booking"][j]);
        }
      }
      users[i]["booking"] = newarr;
      return res.json({
        msg: "done!",
      });
    }
  }

  res.json({
    msg: "something went wrong",
  });
});

app.get("/summary/:userId", (req, res) => {
  const userId = req.params.userId;

  for (let i = 0; i < users.length; i++) {
    let ans = 0;
    if (users[i]["userId"] == userId) {
      for (let j = 0; j < users[i]["bookings"].length; j++) {
        if (
          users[i]["bookings"][j]["status"] == "booked" ||
          users[i]["bookings"][j]["status"] == "completed"
        ) {
          ans =
            ans +
            users[i]["bookings"][j]["days"] *
              users[i]["bookings"][j]["rentPerDay"];
        }
      }

      return res.json({
        userId,
        username: users[i]["username"],
        totolbookings: users[i]["bookings"].length,
        totalAmmountspend: ans,
      });
    }
  }

  res.json({
    msg: "something wrong",
  });
});

app.listen(PORT, () => {
  console.log("listening");
});
