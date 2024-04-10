const handler = (req, res) => {
  const path = req.url;

  if (path === "/") {
    res.setHeader("Content-Type", "text/html");
    res.write("Greetings from node.js");
    res.write("<form action=/create-user method=POST><input type=text name=username><button type=submit>Send</button></form>");
    return res.end();
  }

  if (path === "/users") {
    res.setHeader("Content-Type", "text/html");
    res.write("<ul><li>User 1</li><li>User 2</li><li>User 3</li></ul>");
    return res.end();
  }

  if (path === "/create-user") {
    const body = [];
    req.on("data", (chunk) => {
      body.push(chunk);
    });
    req.on("end", () => {
      const parsedBody = Buffer.concat(body).toString();
      console.log(parsedBody.split("=")[1]);
    });
    res.statusCode = 302;
    res.setHeader("Location", "/users");
    return res.end();
  }
};

module.exports = handler;
