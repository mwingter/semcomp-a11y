const riddlethonQuestionService = require("../../services/riddlethon-question.service");

const {
  handleValidationResult,
} = require("../../lib/handle-validation-result");
const { handleError } = require("../../lib/handle-error");

module.exports = {
  list: async (req, res, next) => {
    try {
      handleValidationResult(req);

      const questionsFound = await riddlethonQuestionService.get();

      return res.status(200).json(questionsFound);
    } catch (error) {
      return handleError(error, next);
    }
  },
  create: async (req, res, next) => {
    try {
      handleValidationResult(req);

      const { index, title, question, imgUrl, clue, answer, isLegendary } =
        req.body;

      const createdQuestion = await riddlethonQuestionService.adminCreate(
        {
          index,
          title,
          question,
          imgUrl,
          clue,
          answer,
          isLegendary,
        },
        req.adminUser
      );

      return res.status(200).send(createdQuestion);
    } catch (error) {
      return handleError(error, next);
    }
  },
  update: async (req, res, next) => {
    try {
      handleValidationResult(req);

      const { id } = req.params;
      const { index, title, question, imgUrl, clue, answer, isLegendary } =
        req.body;

      const updatedQuestion = await riddlethonQuestionService.adminUpdate(
        id,
        {
          index,
          title,
          question,
          imgUrl,
          clue,
          answer,
          isLegendary,
        },
        req.adminUser
      );

      return res.status(200).send(updatedQuestion);
    } catch (error) {
      return handleError(error, next);
    }
  },
  delete: async (req, res, next) => {
    try {
      handleValidationResult(req);

      const { id } = req.params;

      const questionDeleted = await riddlethonQuestionService.adminDelete(
        id,
        req.adminUser
      );

      return res.status(200).send(questionDeleted);
    } catch (error) {
      return handleError(error, next);
    }
  },
};
