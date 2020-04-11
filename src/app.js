const express = require("express");
const cors = require("cors");
const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

const checkIfExistsRepository = (request, response, next) => {
  const { id } = request.params;
  const repository = repositories.find((el) => el.id === id);

  if (!repository)
    return response
      .status(400)
      .json({ status: "fail", message: "Repository not found" });

  return next();
};

app.use("/repositories/:id", checkIfExistsRepository);

app.get("/repositories", (request, response) => {
  return response.status(200).json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  };

  repositories.push(repository);

  return response.status(201).json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { title, url, techs } = request.body;
  const { id } = request.params;

  const repository = repositories.find((el) => el.id === id);
  const repositoryIndex = repositories.findIndex((el) => el.id === id);
  const updatedRepository = {
    id: repository.id,
    title,
    url,
    techs,
    likes: repository.likes,
  };

  repositories[repositoryIndex] = updatedRepository;

  return response.status(200).json(updatedRepository);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const repositoryIndex = repositories.findIndex((el) => el.id === id);
  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;
  const repository = repositories.find((el) => el.id === id);
  repository.likes += 1;

  response.status(201).json(repository);
});

module.exports = app;
