import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'

import { deleteDiaryItem } from '../../businessLogic/diaryItems'
import { createLogger } from '../../utils/logger'
import { getUserId } from '../utils'

const logger = createLogger('deleteDiaryItem')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info('Processing deleteDiaryItem event', { event })

  const userId = getUserId(event)
  const diaryDiaryId = event.pathParameters.diaryDiaryId
  
  try {
    await deleteDiaryItem(userId, diaryDiaryId)
  } catch (e) {
    if (e.message == 'Not Found') {
      return {
        statusCode: 404,
        body: JSON.stringify({
          message: e.message
        })
      }
    } else if (e.message == 'Forbidden'){
      return {
        statusCode: 403,
        body: JSON.stringify({
          message: e.message
        })
      }
    }
  }

  return {
    statusCode: 204,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: ''
  }
}
