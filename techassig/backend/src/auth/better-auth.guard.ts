import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from "@nestjs/common";
import type { Request } from "express";
import { auth } from "./auth";

@Injectable()
export class BetterAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    try {
      const headers = new Headers();
      Object.entries(request.headers).forEach(([key, value]) => {
        if (value) {
          headers.set(key, Array.isArray(value) ? value.join(", ") : value);
        }
      });

      const protocol = request.protocol;
      const host = request.get("host") || "localhost:3001";
      const url = `${protocol}://${host}${request.originalUrl}`;

      const webRequest = new Request(url, {
        method: request.method,
        headers,
      });

      const session = await auth.api.getSession({
        headers: webRequest.headers,
      });

      if (!session || !session.user) {
        throw new UnauthorizedException("No valid session found");
      }

      (request as any).user = session.user;
      (request as any).session = session.session;

      return true;
    } catch (error) {
      throw new UnauthorizedException("Authentication failed");
    }
  }
}
