const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerDocument = YAML.load("./swagger.yaml");

const app = express();
const port = process.env.PORT || 3000;

// ✅ Разрешаем CORS
app.use(cors());
app.options("*", cors()); // ⬅️ Обработка preflight

// 📦 Middleware
app.use(bodyParser.json());

// 🧾 Swagger UI с отключённым внешним валидатором
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument, {
  swaggerOptions: {
    validatorUrl: null
  }
}));

// 📦 Массив данных
let items = [];

// 🔍 Получить все items
app.get("/items", (req, res) => {
  res.json(items);
});

// 🔍 Получить один item по ID
app.get("/items/:id", (req, res) => {
  const item = items.find((i) => i.id === req.params.id);
  if (!item) return res.status(404).send("Item not found");
  res.json(item);
});

// ➕ Создать новый item
app.post("/items", (req, res) => {
  const item = req.body;
  items.push(item);
  res.status(201).json(item);
});

// ✏️ Обновить item
app.put("/items/:id", (req, res) => {
  const index = items.findIndex((i) => i.id === req.params.id);
  if (index === -1) return res.status(404).send("Item not found");
  items[index] = req.body;
  res.json(items[index]);
});

// ❌ Удалить item
app.delete("/items/:id", (req, res) => {
  const index = items.findIndex((i) => i.id === req.params.id);
  if (index === -1) return res.status(404).send("Item not found");
  items.splice(index, 1);
  res.sendStatus(204);
});

// 🚀 Запуск сервера
app.listen(port, () => {
  console.log(`✅ Server running on http://localhost:${port}`);
  console.log(`📘 Swagger UI on http://localhost:${port}/api-docs`);
});
