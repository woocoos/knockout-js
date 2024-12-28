import type { Request, Response } from '@ice/app';


export default {
  'POST /mock-api/error-400': (request: Request, response: Response) => {
    response.status(400);
    response.send({
      errors: [
        {
          "code": 400,
          "message": "password not match"
        }
      ]
    });
  }
}
