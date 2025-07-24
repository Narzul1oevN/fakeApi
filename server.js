
const express = require("express");
const bodyParser = require("body-parser");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerDocument = YAML.load("./swagger.yaml");

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

let items = [];

// GET all items
app.get("/items", (req, res) => {
  res.json(items);
});

// GET item by id
app.get("/items/:id", (req, res) => {
  const item = items.find((i) => i.id === req.params.id);
  if (!item) return res.status(404).send("Item not found");
  res.json(item);
});

// POST new item
app.post("/items", (req, res) => {
  const item = req.body;
  items.push(item);
  res.status(201).json(item);
});

// PUT update item
app.put("/items/:id", (req, res) => {
  const index = items.findIndex((i) => i.id === req.params.id);
  if (index === -1) return res.status(404).send("Item not found");
  items[index] = req.body;
  res.json(items[index]);
});

// DELETE item
app.delete("/items/:id", (req, res) => {
  const index = items.findIndex((i) => i.id === req.params.id);
  if (index === -1) return res.status(404).send("Item not found");
  items.splice(index, 1);
  res.sendStatus(204);
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
  console.log(`Swagger UI on http://localhost:${port}/api-docs`);
});
