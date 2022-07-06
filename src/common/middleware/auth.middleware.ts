import {
  Injectable,
  NestMiddleware,
  UseGuards,
  Request as N_Request,
} from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import { JwtAuthGuard } from "src/oauth/jwt/jwt-auth.guard";

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log("middleware2 : Request...", req.user);

    next();
  }
}
