// const express = require("express");
// const router = express.Router();

// const users = require("../data/users");

// // This is the same code as the previous example!
// // We've simply changed "app" to "router" and
// // included an export at the end of the file.
// // We also change the route paths to be relative to
// // the base paths defined in index.js.

// router
//   .route("/")
//   .get((req, res) => {
//     res.json(users);
//   })
//   .post((req, res) => {
//     if (req.body.name && req.body.username && req.body.email) {
//       if (users.find((u) => u.username == req.body.username)) {
//         res.json({ error: "Username Already Taken" });
//         return;
//       }

//       const user = {
//         id: users[users.length - 1].id + 1,
//         name: req.body.name,
//         username: req.body.username,
//         email: req.body.email,
//       };

//       users.push(user);
//       res.json(users[users.length - 1]);
//     } else res.json({ error: "Insufficient Data" });
//   });

// router
//   .route("/:id")
//   .get((req, res, next) => {
//     const user = users.find((u) => u.id == req.params.id);
//     if (user) res.json(user);
//     else next();
//   })
//   .patch((req, res, next) => {
//     const user = users.find((u, i) => {
//       if (u.id == req.params.id) {
//         for (const key in req.body) {
//           users[i][key] = req.body[key];
//         }
//         return true;
//       }
//     });

//     if (user) res.json(user);
//     else next();
//   })
//   .delete((req, res, next) => {
//     const user = users.find((u, i) => {
//       if (u.id == req.params.id) {
//         users.splice(i, 1);
//         return true;
//       }
//     });

//     if (user) res.json(user);
//     else next();
//   });

// module.exports = router;

const express = require("express");
const router = express.Router();

const users = require("../data/users");
const posts = require("../data/posts");
const error = require("../utilities/error");

router
  .route("/")
  .get((req, res) => {
    const links = [
      {
        href: "users/:id",
        rel: ":id",
        type: "GET",
      },
    ];

    res.json({ users, links });
  })
  .post((req, res, next) => {
    if (req.body.name && req.body.username && req.body.email) {
      if (users.find((u) => u.username == req.body.username)) {
        next(error(409, "Username Already Taken"));
      }

      const user = {
        id: users[users.length - 1].id + 1,
        name: req.body.name,
        username: req.body.username,
        email: req.body.email,
      };

      users.push(user);
      res.json(users[users.length - 1]);
    } else next(error(400, "Insufficient Data"));
  });

router
  .route("/:id")
  .get((req, res, next) => {
    const user = users.find((u) => u.id == req.params.id);

    const links = [
      {
        href: `/${req.params.id}`,
        rel: "",
        type: "PATCH",
      },
      {
        href: `/${req.params.id}`,
        rel: "",
        type: "DELETE",
      },
      {
        href: `/${req.params.id}/posts`,
        rel: "posts",
        type: "GET"
      }
    ];

    if (user) res.json({ user, links });
    else next();
  })
  .patch((req, res, next) => {
    const user = users.find((u, i) => {
      if (u.id == req.params.id) {
        for (const key in req.body) {
          users[i][key] = req.body[key];
        }
        return true;
      }
    });

    if (user) res.json(user);
    else next();
  })
  .delete((req, res, next) => {
    const user = users.find((u, i) => {
      if (u.id == req.params.id) {
        users.splice(i, 1);
        return true;
      }
    });

    if (user) res.json(user);
    else next();
  });

router
    .route("/:id/posts")
    .get((req, res, next) => {
        const userPosts = posts.filter((p)=> {
            return p.userId == req.params.id
        });

        if (userPosts) res.json(userPosts);
        else next();
  })

module.exports = router;
