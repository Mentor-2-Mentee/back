import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { ExamQuestionService } from "./exam-question.service";

@Controller("exam-question")
export class ExamQuestionController {
  constructor(private readonly examQuestionService: ExamQuestionService) {}
}
