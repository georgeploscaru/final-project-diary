import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'

import { getDiaryItems } from '../../businessLogic/diaryItems'
import { createLogger } from '../../utils/logger'
import { getUserId } from '../utils'

const logger = createLogger('getDiaryItems')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info('Processing getDiaryItems event', { event })

  const userId = getUserId(event)

  const items = await getDiaryItems(userId)

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      items
    })
  }
}
