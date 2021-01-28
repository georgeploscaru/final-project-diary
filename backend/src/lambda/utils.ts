import { APIGatewayProxyEvent } from "aws-lambda";
import { parseUserId } from "../auth/utils";


import { createLogger } from '../utils/logger'
const logger = createLogger('Auth')


/**
 * Get a user id from an API Gateway event
 * @param event an event from API Gateway
 *
 * @returns a user id from a JWT token
 */
export function getUserId(event: APIGatewayProxyEvent): string {
  logger.info('GEPL AUTHORIZATION headers: ' +  event.headers.Authorization)
  const authorization = event.headers.Authorization
  const split = authorization.split(' ')
  
  const jwtToken = split[1]
  logger.info('GEPL AUTHORIZATION jwtToken: ' +  jwtToken)
  return parseUserId(jwtToken)
}