import { Controller, Get, Req, UseGuards } from "@nestjs/common";
import { Request } from "express";
import { BetterAuthGuard } from "../auth/better-auth.guard";

interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    name: string;
    email: string;
  };
}

@Controller("secret")
export class SecretController {
  @Get()
  @UseGuards(BetterAuthGuard)
  getSecret(@Req() request: AuthenticatedRequest) {
    const userName = request.user.name || request.user.email || "User";

    return {
      message: `This is a protected message for ${userName}`,
    };
  }
}
