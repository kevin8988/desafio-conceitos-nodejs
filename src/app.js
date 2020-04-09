const express = require("express");
const cors = require("cors");
const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

const checkIfExistsProject = (request, response, next) => {
  const { id } = request.params;
  const project = repositories.find((el) => el.id === id);

  if (!project)
    return response
      .status(400)
      .json({ status: "fail", message: "Project not found" });

  return next();
};

app.use("/repositories/:id", checkIfExistsProject);

app.get("/repositories", (request, response) => {
  return response.status(200).json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const project = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  };

  repositories.push(project);

  return response.status(201).json(project);
});

app.put("/repositories/:id", (request, response) => {
  const { title, url, techs } = request.body;
  const { id } = request.params;

  const project = repositories.find((el) => el.id === id);
  const projectIndex = repositories.findIndex((el) => el.id === id);
  const updatedProject = {
    id: project.id,
    title,
    url,
    techs,
    likes: project.likes,
  };

  repositories[projectIndex] = updatedProject;

  return response.status(200).json(updatedProject);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const projectIndex = repositories.findIndex((el) => el.id === id);
  repositories.splice(projectIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;
  const project = repositories.find((el) => el.id === id);
  project.likes = project.likes + 1;

  response.status(200).json(project);
});

module.exports = app;
