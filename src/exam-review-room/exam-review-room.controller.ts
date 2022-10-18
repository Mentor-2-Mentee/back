import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  UseGuards,
  Query,
  Req,
  Res,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import {
  AuthorizeUserProfile,
  CreateCreateExamReviewRoomRequestDto,
  CreateExamReviewRoomDto,
} from "src/models";
import { JwtAuthGuard } from "src/oauth/jwt/jwt-auth.guard";
import { ExamReviewRoomService } from "./exam-review-room.service";
import { Response } from "express";
import { UserProfileService } from "src/user-profile/user-profile.service";

@Controller("exam-review-room")
export class ExamReviewRoomController {
  constructor(
    private readonly examReviewRoomService: ExamReviewRoomService,
    private readonly userProfileService: UserProfileService
  ) {}

  @Get()
  async findExamReviewRoomListByExamScheduleId(
    @Query("examScheduleId") examScheduleId: number
    // @Query("examType") examType: string
  ) {
    // console.log(
    //   "findExamReviewRoomListByExamScheduleId",
    //   examScheduleId
    //   // examType
    // );
    const examReviewRoomList =
      await this.examReviewRoomService.findExamReviewRoomList(examScheduleId);

    // // if (examType !== undefined) {
    // //   const target = examReviewRoomList.find(
    // //     (examReviewRoom) => examReviewRoom.examType === examType
    // //   );
    // //   return {
    // //     message: `find ${examType}`,
    // //     examReviewRoom: target,
    // //   };
    // // }

    // console.log("examReviewRoomList", examReviewRoomList);

    return {
      message: "OK",
      examReviewRoomList,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get("userInfo")
  async findUserInfoById(
    @Query("examScheduleId") examScheduleId: number,
    @Query("examType") examType: string
  ) {
    // const { userList } = await this.examReviewRoomService.findExamReviewRoomOne(
    //   examScheduleId,
    //   examType
    // );
    const userInfoList = [];

    // for (const userId of userList) {
    //   // const userInfo = await this.OauthService.getProfile(userId);
    //   // userInfoList.push(userInfo);
    // }

    return {
      message: `${examScheduleId}-${examType} userInfoList`,
      userInfoList,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createExamReviewRoom(
    @Req() request: AuthorizeUserProfile,
    @Body() body: CreateExamReviewRoomDto
  ) {
    const [target, isCreated] =
      await this.examReviewRoomService.createExamReviewRoom(body);

    return {
      message: `received ${body}`,
      examReviewRoom: target,
      isCreated,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post("/create-request")
  async createExamReviewRoomRequest(
    @Req() { user }: AuthorizeUserProfile,
    @Body() body: CreateCreateExamReviewRoomRequestDto
  ) {
    // const userData = await this.userProfileService.findUserProfileById(
    //   request.user.id
    // );
    const [isCreated, message] =
      await this.examReviewRoomService.createExamReviewRoomRequest(
        user.id,
        body
      );

    if (!isCreated) throw new HttpException(message, HttpStatus.BAD_REQUEST);
    return {
      message,
    };
  }

  @Get("/create-request")
  async getCreateExamReviewRoomRequestList(
    @Query("examScheduleId") examScheduleId: number
  ) {
    const requestList =
      await this.examReviewRoomService.getCreateExamReviewRoomRequestList({
        examScheduleId,
      });

    return {
      message: `${examScheduleId} requestList`,
      requestList,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Delete("/create-request")
  async cancelExamReviewRoomRequest(
    @Req() request: AuthorizeUserProfile,
    @Query("examScheduleId") examScheduleId: number,
    @Query("examType") examType: string
  ) {
    // const userData = await this.OauthService.getProfile(request.user.id);
    // const requestList =
    //   await this.examReviewRoomService.deleteExamReviewRoomRequest(
    //     userData,
    //     examScheduleId,
    //     examType
    //   );
    // return {
    //   message: `${examScheduleId} requestList`,
    //   data: requestList,
    // };
  }

  // @Get("/question-pdf")
  // async questionPdf(
  //   @Query("examScheduleId") examScheduleId: number,
  //   @Query("examType") examType: string,
  //   @Res() res: Response
  // ) {
  //   const targetRoomData =
  //     await this.examReviewRoomService.findExamReviewRoomOne(
  //       examScheduleId,
  //       examType
  //     );

  //   const buffer = await this.examReviewRoomService.generateQuestionPDF(
  //     targetRoomData,
  //     targetRoomData.examQuestionList
  //   );

  //   res.set({
  //     "Content-Type": "application/pdf",
  //     "Content-Disposition": "attachment; filename=example.pdf",
  //     "Content-Length": buffer.length,
  //   });

  //   res.end(buffer);
  // }

  // @Get("/solution-pdf")
  // async solutionPdf(
  //   @Query("examScheduleId") examScheduleId: number,
  //   @Query("examType") examType: string,
  //   @Res() res: Response
  // ) {
  //   const targetRoomData =
  //     await this.examReviewRoomService.findExamReviewRoomOne(
  //       examScheduleId,
  //       examType
  //     );

  //   const buffer = await this.examReviewRoomService.generateSolutionPDF(
  //     targetRoomData,
  //     targetRoomData.examQuestionList
  //   );

  //   res.set({
  //     "Content-Type": "application/pdf",
  //     "Content-Disposition": "attachment; filename=example.pdf",
  //     "Content-Length": buffer.length,
  //   });

  //   res.end(buffer);
  // }

  @UseGuards(JwtAuthGuard)
  @Post("/enter")
  async roomEnter(@Req() { user }: AuthorizeUserProfile, @Body() body: any) {
    console.log("enter user", user, body);
    return await this.examReviewRoomService.checkUserEntered(
      user.id,
      body.examReviewRoomId
    );
  }
}
