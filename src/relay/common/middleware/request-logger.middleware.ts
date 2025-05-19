import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { RequestRepository } from '../repositories/request.repository';
import { RequestEntity, RequestStatus } from '../entities/request.entity';

interface RequestUser {
  id?: string;
}

interface RequestWithUser extends Request {
  user?: RequestUser;
}

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  constructor(private readonly requestRepository: RequestRepository) {}

  use(req: RequestWithUser, res: Response, next: NextFunction) {
    // Clone the original response methods
    const originalSend = res.send;
    const originalJson = res.json;

    // Create a request record with initial data
    const requestData: Partial<RequestEntity> = {
      endpoint: req.originalUrl,
      method: req.method,
      requestBody: req.body,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      userId: req.user?.id,
    };

    // Store response data
    let responseBody: any;

    // Override response methods to capture the data
    res.send = function (body: any): Response {
      responseBody = body;
      return originalSend.call(this, body);
    };

    res.json = function (body: any): Response {
      responseBody = body;
      return originalJson.call(this, body);
    };

    // Capture the response when it completes
    res.on('finish', async () => {
      try {
        // Update request record with response data
        requestData.responseBody = responseBody;
        requestData.statusCode = res.statusCode;
        requestData.status =
          res.statusCode >= 200 && res.statusCode < 400
            ? RequestStatus.SUCCESS
            : RequestStatus.FAILED;

        // If there's a transaction hash in the response, link it
        if (responseBody?.transactionHash) {
          requestData.transactionId = responseBody.transactionId;
        }

        // Save the complete request data
        await this.requestRepository.create(requestData);
      } catch (error) {
        console.error('Failed to log request:', error);
      }
    });

    next();
  }
}
